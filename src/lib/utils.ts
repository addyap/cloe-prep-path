import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Listening prompt_text is authored as `You hear: "<spoken script>" <printed question>?`
 * — pull out just the quoted script for TTS playback so the printed question (which the
 * user should only see, not hear) isn't read aloud too.
 */
export function extractSpokenScript(text: string): string {
  const m = text.match(/["“]([^"”]*)["”]/);
  if (m) return m[1];
  return text.replace(/^You hear:\s*/i, "");
}

/**
 * Fisher–Yates shuffle (returns a new array). Applied to MCQ options at load
 * time so the stored answer-key position in the database is irrelevant to
 * what users see — grading compares option text, never position.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
