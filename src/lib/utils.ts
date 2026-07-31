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

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.!?;:,]+$/, "");
}

/**
 * gap_fill grading: forgiving of whitespace/case/curly-quote/trailing-
 * punctuation differences, but not fuzzy — spelling is the point of a
 * grammar drill, so no edit-distance matching.
 */
export function gradeGapFill(userAnswer: string, correctAnswer: string | null): boolean {
  if (!correctAnswer) return false;
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

/**
 * Single grading entry point for every question type — mcq, reconstruction,
 * and word_bank all grade by exact string equality (their answer space is
 * either a fixed option/token set or a shuffled-but-unmodified sentence, so
 * there's nothing to normalize); gap_fill is the only free-typed format and
 * routes through the more forgiving gradeGapFill.
 */
export function gradeAnswer(
  type: string,
  userAnswer: string,
  correctAnswer: string | null,
): boolean {
  if (type === "gap_fill") return gradeGapFill(userAnswer, correctAnswer);
  return !!correctAnswer && userAnswer === correctAnswer;
}
