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
