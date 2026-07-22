import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createOpenAiProvider } from "@/lib/ai-gateway.server";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const FeedbackSchema = z.object({
  estimated_level: z.enum(LEVELS),
  scores: z.object({
    task_achievement: z.number().int().min(0).max(5),
    coherence: z.number().int().min(0).max(5),
    grammar_range: z.number().int().min(0).max(5),
    vocabulary: z.number().int().min(0).max(5),
  }),
  comments: z.object({
    task_achievement: z.string(),
    coherence: z.string(),
    grammar_range: z.string(),
    vocabulary: z.string(),
  }),
  suggestions: z.array(z.string()).min(2).max(3),
  improved_sample: z.string(),
  summary: z.string(),
});

export type WritingFeedback = z.infer<typeof FeedbackSchema>;

const InputSchema = z.object({
  question_id: z.string().uuid(),
  prompt_text: z.string().min(1),
  target_level: z.enum(LEVELS),
  user_text: z.string().min(1).max(8000),
});

export const evaluateWriting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("Missing OPENAI_API_KEY");

    const gateway = createOpenAiProvider(key);
    const model = gateway("gpt-4o-mini");

    const system = `You are an experienced CLOE / CEFR English examiner.
You assess short professional writing tasks on the CEFR scale (A1–C2).
You are strict but fair, and you give actionable, specific feedback.
Always reply in English.`;

    const userPrompt = `TASK (target level ${data.target_level}):
"""
${data.prompt_text}
"""

CANDIDATE'S RESPONSE:
"""
${data.user_text}
"""

Evaluate the response against the task and the target level. Return:
- estimated_level: the CEFR level this response actually demonstrates (A1–C2).
- scores (0–5 integers each):
    * task_achievement — did they fulfil the task fully and appropriately?
    * coherence — organisation, linking, paragraphing, tone consistency.
    * grammar_range — accuracy and variety of structures.
    * vocabulary — range, precision, register, collocations.
- comments: one short sentence per criterion (<= 25 words), citing evidence from the text.
- suggestions: 2–3 concrete, prioritised improvements (e.g. "Use 'I would appreciate' instead of 'I want'").
- improved_sample: a rewritten version of the candidate's response at the target level, same intent, same approximate length, professional register.
- summary: one encouraging sentence (<= 25 words) wrapping up.`;

    let result;
    try {
      result = await generateText({
        model,
        system,
        prompt: userPrompt,
        output: Output.object({ schema: FeedbackSchema }),
      });
    } catch (e: unknown) {
      const err = e as { statusCode?: number; status?: number; message?: string };
      const status = err.statusCode ?? err.status;
      if (status === 429) throw new Error("RATE_LIMIT");
      if (status === 402) throw new Error("CREDITS_EXHAUSTED");
      throw new Error(err.message ?? "AI_ERROR");
    }

    const feedback = result.experimental_output as WritingFeedback;
    const overall = Math.round(
      ((feedback.scores.task_achievement +
        feedback.scores.coherence +
        feedback.scores.grammar_range +
        feedback.scores.vocabulary) /
        20) *
        100,
    );

    const { data: attempt, error } = await context.supabase
      .from("attempts")
      .insert({
        user_id: context.userId,
        question_id: data.question_id,
        skill: "writing",
        cefr_level: feedback.estimated_level,
        user_answer: data.user_text,
        is_correct: null,
        score: overall / 100,
        feedback: feedback as never,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return { attempt_id: attempt.id, feedback, overall };
  });
