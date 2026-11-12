/**
 * Saving AI-marked attempts. The server marks the answer (see
 * writing-feedback.functions.ts and api/speaking/evaluate.ts) and the
 * attempt is kept in the learner's browser, like every other attempt.
 */
import { db } from "@/lib/local-db";
import type { Database, Json } from "@/lib/db-types";

type Level = Database["public"]["Enums"]["cefr_level"];

interface Marked {
  feedback: { estimated_level: Level };
  overall: number;
}

async function save(
  skill: "writing" | "speaking",
  questionId: string,
  answer: string,
  marked: Marked,
  extra: Record<string, unknown> = {},
): Promise<string | null> {
  const { data: u } = await db.auth.getUser();
  if (!u.user) return null;
  const { data } = await db
    .from("attempts")
    .insert({
      user_id: u.user.id,
      question_id: questionId,
      skill,
      cefr_level: marked.feedback.estimated_level,
      user_answer: answer,
      is_correct: null,
      score: marked.overall / 100,
      feedback: { ...marked.feedback, ...extra } as unknown as Json,
    })
    .select("id")
    .single();
  return data?.id ?? null;
}

export function saveWritingAttempt(questionId: string, text: string, marked: Marked) {
  return save("writing", questionId, text, marked);
}

export function saveSpeakingAttempt(
  questionId: string,
  marked: Marked & { transcript: string },
  phase: string,
) {
  return save("speaking", questionId, marked.transcript, marked, { phase });
}
