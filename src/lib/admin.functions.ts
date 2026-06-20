import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText, Output } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const SKILLS = ["listening", "reading", "grammar_vocab", "writing", "speaking"] as const;
const CONTEXT_TAGS = [
  "email",
  "meeting",
  "call",
  "negotiation",
  "customer_service",
  "general",
  "tenses",
  "prepositions",
  "business_vocab",
  "phrasal_verbs",
  "formal_register",
  "collocations",
  "interview",
  "role_play",
  "discussion",
] as const;

// ---------- isAdmin ----------
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) return { isAdmin: false };
    return { isAdmin: !!data };
  });

// ---------- Claim first admin (bootstrap) ----------
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      throw new Error("An admin already exists. Ask an existing admin to grant access.");
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Generate questions ----------
const GenInputSchema = z.object({
  skill: z.enum(SKILLS),
  cefr_level: z.enum(LEVELS),
  context_tag: z.enum(CONTEXT_TAGS),
  count: z.number().int().min(1).max(10),
});

const QuestionSchema = z.object({
  prompt_text: z.string().min(5).max(2000),
  type: z.enum(["mcq", "gap_fill", "open_text", "prompt"]),
  options: z.array(z.string()).min(2).max(6).optional(),
  correct_answer: z.string().optional(),
  explanation: z.string().min(5).max(800),
});
const GenOutputSchema = z.object({ questions: z.array(QuestionSchema).min(1).max(10) });

export const generateQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => GenInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    // Authorize: must be admin
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin only");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const skillGuidance: Record<(typeof SKILLS)[number], string> = {
      listening:
        'Write a short workplace audio script (1–4 sentences) inside prompt_text as the transcript. Type "mcq". Provide 3–4 options and one correct_answer (must match an option verbatim).',
      reading:
        'Write a short professional text (2–5 sentences) inside prompt_text. Type "mcq". Provide 3–4 options and one correct_answer (must match an option verbatim).',
      grammar_vocab:
        'Write a single-sentence drill with a blank "_____" or a sentence to correct. Type "mcq" or "gap_fill". Provide 3–4 options and a correct_answer.',
      writing:
        'Write a realistic professional writing task as the prompt_text (e.g. "Reply to this email..."). Type "prompt". Do NOT include options or correct_answer.',
      speaking:
        'Write a speaking prompt (interview question, role-play setup, or discussion topic). Type "prompt". Do NOT include options or correct_answer.',
    };

    const system = `You are a CLOE / CEFR English exam item writer specialising in workplace English.
You craft authentic, original practice items that mirror the CLOE exam.
Write in clear, professional English. Never reuse copyrighted material.`;

    const userPrompt = `Generate ${data.count} original CLOE practice ${data.skill} items.

Target CEFR level: ${data.cefr_level}
Context / sub-topic: ${data.context_tag.replaceAll("_", " ")}

Guidance: ${skillGuidance[data.skill]}

For each item, provide:
- prompt_text: the question, passage, or task
- type: one of mcq, gap_fill, open_text, prompt
- options: array of choices (only for mcq / gap_fill)
- correct_answer: must match one option verbatim (only for mcq / gap_fill)
- explanation: a short, helpful explanation (always required)

Vary the items. Do not repeat structures or vocabulary across items.`;

    let result;
    try {
      result = await generateText({
        model,
        system,
        prompt: userPrompt,
        output: Output.object({ schema: GenOutputSchema }),
      });
    } catch (e: unknown) {
      const err = e as { statusCode?: number; status?: number; message?: string };
      const status = err.statusCode ?? err.status;
      if (status === 429) throw new Error("RATE_LIMIT");
      if (status === 402) throw new Error("CREDITS_EXHAUSTED");
      throw new Error(err.message ?? "AI_ERROR");
    }

    const parsed = GenOutputSchema.parse(result.experimental_output);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = parsed.questions.map((q) => ({
      prompt_text: q.prompt_text,
      type: q.type,
      options: q.options ? (q.options as unknown as object) : null,
      correct_answer: q.correct_answer ?? null,
      explanation: q.explanation,
      skill: data.skill,
      cefr_level: data.cefr_level,
      context_tag: data.context_tag,
    }));
    const { data: inserted, error } = await supabaseAdmin
      .from("questions")
      .insert(rows)
      .select("id");
    if (error) throw new Error(error.message);

    return { inserted_count: inserted?.length ?? 0, preview: parsed.questions };
  });
