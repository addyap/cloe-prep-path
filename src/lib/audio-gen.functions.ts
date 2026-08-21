import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { extractSpokenScript } from "@/lib/utils";

const BUCKET = "listening-audio";

// Bump this when the voicing recipe changes. New files are tagged with it via a
// URL fragment (browsers strip fragments before fetching, so playback is
// unaffected), which lets "re-voice all" batch through only the clips that
// haven't been regenerated with the current recipe yet.
const AUDIO_VERSION = "v3";
const VERSION_TAG = `#${AUDIO_VERSION}`;

// marin and cedar are OpenAI's newest, highest-quality voices (their own
// recommendation for best naturalness); the rest are the expressive set. All are
// far more human than the classic voices (nova, onyx, echo, …) learners called
// robotic. Standalone items rotate through these (so a session has voice variety)
// and each dialogue speaker gets a distinct one; the order gives adjacent
// speakers a clear contrast (marin/cedar read female/male).
const NATURAL_VOICES = ["marin", "cedar", "coral", "ash", "sage", "verse"] as const;
const NARRATOR_VOICE = "marin";

// gpt-4o-mini-tts follows detailed, specific style direction — vague adjectives
// barely move it, so these spell out accent, affect, pacing and rhythm.
const NARRATOR_INSTRUCTIONS =
  "Voice: a warm, natural British English speaker (Received Pronunciation), like a friendly " +
  "professional narrating an audio lesson. Affect: relaxed, human and engaging. Pacing: natural " +
  "and unhurried, with realistic sentence rhythm — gentle pauses at commas and full stops, and " +
  "natural intonation that rises and falls. Sound like a real person talking to a learner, never " +
  "robotic, clipped, flat or monotone.";
const DIALOGUE_INSTRUCTIONS =
  "Voice: a natural British English speaker (Received Pronunciation) in a real, everyday " +
  "conversation. Affect: warm, expressive and conversational, with genuine emotion that fits the " +
  "moment — polite, curious, apologetic, helpful as appropriate. Pacing: natural spoken rhythm " +
  "with lifelike intonation and small pauses. Sound like a real person speaking, never robotic, " +
  "flat or monotone.";

async function synthesizeSpeech(
  text: string,
  apiKey: string,
  voice: string,
  instructions: string,
): Promise<ArrayBuffer> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      instructions,
      response_format: "mp3",
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`TTS failed (${res.status}): ${t.slice(0, 200)}`);
  }
  return res.arrayBuffer();
}

type Turn = { speaker: string; text: string };

/**
 * Parse a passage body into speaker turns if — and only if — it is a genuine
 * labelled dialogue ("Anna: …\nBen: …" with at least two distinct speakers).
 * Narration (with or without embedded quotes) returns null and is voiced by a
 * single narrator.
 */
function splitDialogue(body: string): Turn[] | null {
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const label = /^([A-Z][A-Za-z .'-]{0,24}):\s*(.+)$/;
  const turns: Turn[] = [];
  for (const line of lines) {
    const m = line.match(label);
    if (m) {
      turns.push({ speaker: m[1].trim(), text: m[2].trim() });
    } else if (turns.length) {
      // A wrapped continuation of the current speaker's line.
      turns[turns.length - 1].text += " " + line;
    } else {
      return null; // starts with un-labelled prose → treat as narration
    }
  }
  const speakers = new Set(turns.map((t) => t.speaker));
  return turns.length >= 2 && speakers.size >= 2 ? turns : null;
}

/** Voice each speaker's turn with a distinct natural voice, then stitch the
 *  MP3 segments into one clip (MP3 is frame-based, so byte concatenation plays
 *  back cleanly without re-encoding). */
async function synthesizeDialogue(turns: Turn[], apiKey: string): Promise<ArrayBuffer> {
  const voiceOf = new Map<string, string>();
  let next = 0;
  const segments: ArrayBuffer[] = [];
  for (const turn of turns) {
    let voice = voiceOf.get(turn.speaker);
    if (!voice) {
      voice = NATURAL_VOICES[next % NATURAL_VOICES.length];
      next++;
      voiceOf.set(turn.speaker, voice);
    }
    segments.push(await synthesizeSpeech(turn.text, apiKey, voice, DIALOGUE_INSTRUCTIONS));
  }
  const total = segments.reduce((n, b) => n + b.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const seg of segments) {
    out.set(new Uint8Array(seg), offset);
    offset += seg.byteLength;
  }
  return out.buffer;
}

const InputSchema = z.object({
  limit: z.number().int().min(1).max(30).default(15),
  // When true, re-voice clips already generated by an older recipe, not just
  // the ones with no audio at all.
  regenerateAll: z.boolean().default(false),
});

// PostgREST predicate selecting rows that still need this recipe: either no
// audio yet, or audio tagged with an older version than the current one.
const STALE_OR = `audio_url.is.null,audio_url.not.ilike.*${VERSION_TAG}`;

export const generateListeningAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin only");

    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("Missing OPENAI_API_KEY");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const missingQuery = supabaseAdmin
      .from("questions")
      .select("id, prompt_text")
      .eq("skill", "listening")
      .is("passage_id", null);
    const { data: missing, error } = await (
      data.regenerateAll ? missingQuery.or(STALE_OR) : missingQuery.is("audio_url", null)
    ).limit(data.limit);
    if (error) throw new Error(error.message);
    if (!missing || missing.length === 0) return { generated: 0, remaining: 0, errors: [] };

    let generated = 0;
    const errors: string[] = [];

    await Promise.all(
      missing.map(async (q, i) => {
        try {
          const script = extractSpokenScript(q.prompt_text);
          const voice = NATURAL_VOICES[i % NATURAL_VOICES.length];
          const audio = await synthesizeSpeech(script, key, voice, NARRATOR_INSTRUCTIONS);
          const path = `${q.id}.mp3`;
          const { error: upErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
          if (upErr) throw new Error(upErr.message);
          const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
          const { error: updErr } = await supabaseAdmin
            .from("questions")
            .update({ audio_url: pub.publicUrl + VERSION_TAG })
            .eq("id", q.id);
          if (updErr) throw new Error(updErr.message);
          generated++;
        } catch (e: unknown) {
          errors.push(`${q.id}: ${(e as Error).message ?? "unknown error"}`);
        }
      }),
    );

    const remainingQuery = supabaseAdmin
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("skill", "listening")
      .is("passage_id", null);
    const { count: remaining } = await (data.regenerateAll
      ? remainingQuery.or(STALE_OR)
      : remainingQuery.is("audio_url", null));

    return { generated, remaining: remaining ?? 0, errors };
  });

/**
 * Same idea as generateListeningAudio, but for listening passages
 * (dialogue/monologue scripts backing a multi-question unit). Genuine labelled
 * dialogues are voiced with a distinct natural voice per speaker; narration is
 * read by a single natural narrator.
 */
export const generateListeningPassageAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin only");

    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("Missing OPENAI_API_KEY");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const missingQuery = supabaseAdmin.from("passages").select("id, body").eq("skill", "listening");
    const { data: missing, error } = await (
      data.regenerateAll ? missingQuery.or(STALE_OR) : missingQuery.is("audio_url", null)
    ).limit(data.limit);
    if (error) throw new Error(error.message);
    if (!missing || missing.length === 0) return { generated: 0, remaining: 0, errors: [] };

    let generated = 0;
    const errors: string[] = [];

    await Promise.all(
      missing.map(async (p) => {
        try {
          const turns = splitDialogue(p.body);
          const audio = turns
            ? await synthesizeDialogue(turns, key)
            : await synthesizeSpeech(p.body, key, NARRATOR_VOICE, NARRATOR_INSTRUCTIONS);
          const path = `passage-${p.id}.mp3`;
          const { error: upErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
          if (upErr) throw new Error(upErr.message);
          const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
          const { error: updErr } = await supabaseAdmin
            .from("passages")
            .update({ audio_url: pub.publicUrl + VERSION_TAG })
            .eq("id", p.id);
          if (updErr) throw new Error(updErr.message);
          generated++;
        } catch (e: unknown) {
          errors.push(`${p.id}: ${(e as Error).message ?? "unknown error"}`);
        }
      }),
    );

    const remainingQuery = supabaseAdmin
      .from("passages")
      .select("id", { count: "exact", head: true })
      .eq("skill", "listening");
    const { count: remaining } = await (data.regenerateAll
      ? remainingQuery.or(STALE_OR)
      : remainingQuery.is("audio_url", null));

    return { generated, remaining: remaining ?? 0, errors };
  });
