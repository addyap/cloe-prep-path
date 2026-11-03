/**
 * Records the listening audio with Kokoro (https://huggingface.co/hexgrad/Kokoro-82M),
 * a free voice model that runs on this computer, and points each listening
 * question and passage in src/data/*.json at its file in public/audio/.
 *
 * - Standalone listening questions: the quoted script in the prompt, one voice.
 * - Listening passages: a labelled dialogue ("Anna: ...") gets one voice per
 *   speaker; anything else is read by the narrator.
 *
 * One-off setup (needs `brew install uv ffmpeg espeak-ng`):
 *   npm run audio:setup
 * Then, whenever listening content changes:
 *   npm run audio            record what's new or changed
 *   npm run audio -- --force re-record everything
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { extractSpokenScript } from "../src/lib/utils";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const AUDIO_DIR = `${ROOT}public/audio`;
const QUESTIONS = `${ROOT}src/data/questions.json`;
const PASSAGES = `${ROOT}src/data/passages.json`;
const PYTHON = `${ROOT}.venv-kokoro/bin/python`;
const FORCE = process.argv.includes("--force");

// British voices, as CLOE is a British English exam. Names starting "b" are
// British in Kokoro: "bf_" female, "bm_" male.
const NARRATOR = "bf_emma";
const VOICES = ["bf_emma", "bm_george", "bf_isabella", "bm_lewis", "bf_alice", "bm_fable"];

interface Line {
  text: string;
  voice: string;
}
type Item = { id: string; skill: string; audio_url: string | null } & Record<string, unknown>;

if (!existsSync(PYTHON)) {
  console.error(
    "Kokoro isn't set up yet: run `npm run audio:setup` first (needs `brew install uv ffmpeg espeak-ng`).",
  );
  process.exit(1);
}

/** Labelled dialogue turns, or null for narration (same rules as before). */
function splitDialogue(body: string): { speaker: string; text: string }[] | null {
  const label = /^([A-Z][A-Za-z .'-]{0,24}):\s*(.+)$/;
  const turns: { speaker: string; text: string }[] = [];
  for (const line of body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)) {
    const m = line.match(label);
    if (m) turns.push({ speaker: m[1].trim(), text: m[2].trim() });
    else if (turns.length) turns[turns.length - 1].text += " " + line;
    else return null;
  }
  return turns.length >= 2 && new Set(turns.map((t) => t.speaker)).size >= 2 ? turns : null;
}

function passageLines(body: string): Line[] {
  const turns = splitDialogue(body);
  if (!turns) return [{ text: body, voice: NARRATOR }];
  const voiceOf = new Map<string, string>();
  return turns.map((t) => {
    if (!voiceOf.has(t.speaker)) voiceOf.set(t.speaker, VOICES[voiceOf.size % VOICES.length]);
    return { text: t.text, voice: voiceOf.get(t.speaker)! };
  });
}

/** The URL changes whenever the text or voices do, so browsers never play a stale clip. */
function audioUrl(file: string, lines: Line[]) {
  const version = createHash("sha1").update(JSON.stringify(lines)).digest("hex").slice(0, 8);
  return `/audio/${file}?v=${version}`;
}

const kokoro = spawn(PYTHON, [`${ROOT}scripts/kokoro-speak.py`], {
  stdio: ["pipe", "pipe", "inherit"],
});
const replies = createInterface({ input: kokoro.stdout! })[Symbol.asyncIterator]();

async function record(lines: Line[], file: string) {
  kokoro.stdin!.write(JSON.stringify({ lines, out: `${AUDIO_DIR}/${file}` }) + "\n");
  const reply = await replies.next();
  if (reply.done) throw new Error("Kokoro stopped unexpectedly (its error is above).");
}

async function main() {
  mkdirSync(AUDIO_DIR, { recursive: true });
  const questions = JSON.parse(readFileSync(QUESTIONS, "utf8")) as Item[];
  const passages = JSON.parse(readFileSync(PASSAGES, "utf8")) as Item[];

  const jobs: { item: Item; file: string; lines: Line[] }[] = [];
  let next = 0;
  for (const q of questions) {
    if (q.skill !== "listening" || q.passage_id) continue;
    const text = extractSpokenScript(q.prompt_text as string);
    jobs.push({
      item: q,
      file: `q-${q.id}.mp3`,
      lines: [{ text, voice: VOICES[next++ % VOICES.length] }],
    });
  }
  for (const p of passages) {
    if (p.skill !== "listening") continue;
    jobs.push({ item: p, file: `passage-${p.id}.mp3`, lines: passageLines(p.body as string) });
  }

  const todo = jobs.filter(
    (j) =>
      FORCE ||
      j.item.audio_url !== audioUrl(j.file, j.lines) ||
      !existsSync(`${AUDIO_DIR}/${j.file}`),
  );
  console.log(`${todo.length} of ${jobs.length} listening clips to record.`);

  for (const [i, job] of todo.entries()) {
    await record(job.lines, job.file);
    job.item.audio_url = audioUrl(job.file, job.lines);
    if ((i + 1) % 25 === 0) console.log(`  ${i + 1} of ${todo.length}`);
  }
  kokoro.stdin!.end();

  writeFileSync(QUESTIONS, JSON.stringify(questions, null, 1) + "\n");
  writeFileSync(PASSAGES, JSON.stringify(passages, null, 1) + "\n");
  console.log(`Recorded ${todo.length} clip(s).`);
}

await main();
