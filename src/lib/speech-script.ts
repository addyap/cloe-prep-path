import { DIALOGUE_VOICES, NARRATOR_VOICE } from "./audio-config";
import type { KokoroVoice } from "./audio-config";

export type SpeechSegment = { text: string; voice: KokoroVoice };

export function speechSegments(body: string, voice?: KokoroVoice): SpeechSegment[] {
  const narrator = voice ?? NARRATOR_VOICE;
  if (!body.trim() || body.length > 6000) {
    throw new Error("Speech scripts must contain 1–6000 characters.");
  }
  const turns: { speaker: string; text: string }[] = [];
  for (const line of body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)) {
    const match = line.match(/^([A-Z][A-Za-z .'-]{0,24}):\s*(.+)$/);
    if (match) turns.push({ speaker: match[1].trim(), text: match[2].trim() });
    else if (turns.length) turns[turns.length - 1].text += ` ${line}`;
    else return chunkSpeech(body, narrator);
  }
  if (new Set(turns.map((turn) => turn.speaker)).size < 2) return chunkSpeech(body, narrator);
  const voices = new Map<string, KokoroVoice>();
  const segments = turns.flatMap((turn) => {
    if (!voices.has(turn.speaker)) {
      voices.set(turn.speaker, DIALOGUE_VOICES[voices.size % DIALOGUE_VOICES.length]);
    }
    return chunkSpeech(turn.text, voice ?? voices.get(turn.speaker)!);
  });
  if (segments.length > 32) throw new Error("Speech script has too many turns.");
  return segments;
}

function chunkSpeech(text: string, voice: KokoroVoice): SpeechSegment[] {
  let rest = text.trim();
  const chunks: SpeechSegment[] = [];
  while (rest.length > 280) {
    const prefix = rest.slice(0, 280);
    const sentenceEnds = [...prefix.matchAll(/[.!?][”"']?\s/g)];
    const last = sentenceEnds.at(-1);
    const sentenceEnd = last ? last.index! + last[0].length : -1;
    const split = sentenceEnd > 80 ? sentenceEnd : Math.max(prefix.lastIndexOf(" "), 1);
    // Hard split very long unbroken tokens rather than sending an oversized request.
    const end = split > 1 ? split : 280;
    chunks.push({ text: rest.slice(0, end).trim(), voice });
    rest = rest.slice(end).trim();
  }
  if (rest) chunks.push({ text: rest, voice });
  return chunks;
}
