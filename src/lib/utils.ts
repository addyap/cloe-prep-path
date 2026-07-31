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

/**
 * Fisher–Yates, but retries (capped) while the result equals the input
 * order. shuffle() returning the identity permutation is harmless for MCQ
 * (the correct option can legitimately land back where it started) but
 * fatal for a text-reconstruction exercise — an unshuffled scramble hands
 * the learner the answer outright.
 */
export function scramble<T>(arr: readonly T[]): T[] {
  if (arr.length < 2) return [...arr];
  let out = shuffle(arr);
  for (let attempt = 0; attempt < 10 && out.every((v, i) => v === arr[i]); attempt++) {
    out = shuffle(arr);
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
 * grammar drill, so no edit-distance matching. Checks against every
 * accepted answer, not just one — a content audit of the first gap_fill
 * round found that most free-typed items genuinely admit more than one
 * correct synonym ("bought" vs "purchased", "sign" vs "finalize"), and
 * exact-match-only grading would mark an equally correct answer wrong.
 */
export function gradeGapFill(userAnswer: string, acceptedAnswers: readonly string[]): boolean {
  if (acceptedAnswers.length === 0) return false;
  const norm = normalizeAnswer(userAnswer);
  return acceptedAnswers.some((a) => normalizeAnswer(a) === norm);
}

/**
 * Single grading entry point for every question type — mcq, reconstruction,
 * and word_bank all grade by exact string equality (their answer space is
 * either a fixed option/token set or a shuffled-but-unmodified sentence, so
 * there's nothing to normalize); gap_fill is the only free-typed format and
 * routes through the more forgiving gradeGapFill. `acceptedAnswers` is
 * gap_fill-only (ignored for other types) and falls back to just
 * `correctAnswer` when omitted or empty, so callers that don't have an
 * accepted-answers list yet still grade correctly against the single answer.
 */
export function gradeAnswer(
  type: string,
  userAnswer: string,
  correctAnswer: string | null,
  acceptedAnswers?: readonly string[] | null,
): boolean {
  if (type === "gap_fill") {
    const pool =
      acceptedAnswers && acceptedAnswers.length > 0
        ? acceptedAnswers
        : correctAnswer
          ? [correctAnswer]
          : [];
    return gradeGapFill(userAnswer, pool);
  }
  return !!correctAnswer && userAnswer === correctAnswer;
}
