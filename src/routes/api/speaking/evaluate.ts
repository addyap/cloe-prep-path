import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { createOpenAiProvider } from "@/lib/ai-gateway.server";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const PHASES = ["interview", "role_play", "discussion"] as const;

const FeedbackSchema = z.object({
  estimated_level: z.enum(LEVELS),
  scores: z.object({
    fluency: z.number().int().min(0).max(5),
    range: z.number().int().min(0).max(5),
    accuracy: z.number().int().min(0).max(5),
    interaction: z.number().int().min(0).max(5),
  }),
  comments: z.object({
    fluency: z.string(),
    range: z.string(),
    accuracy: z.string(),
    interaction: z.string(),
  }),
  tips: z.array(z.string()).min(2).max(4),
  summary: z.string(),
});

type Feedback = z.infer<typeof FeedbackSchema>;

function extFromMime(mime: string): string {
  const m = mime.split(";")[0].trim();
  return (
    (
      {
        "audio/webm": "webm",
        "audio/mp4": "mp4",
        "audio/mpeg": "mp3",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/ogg": "ogg",
        "audio/aac": "aac",
      } as Record<string, string>
    )[m] ?? "webm"
  );
}

async function transcribe(audio: Blob, openaiKey: string): Promise<string> {
  const form = new FormData();
  form.append("model", "gpt-4o-mini-transcribe");
  form.append("file", audio, `recording.${extFromMime(audio.type || "audio/webm")}`);
  form.append("language", "en");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
    },
    body: form,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Transcription failed (${res.status}): ${t.slice(0, 300)}`);
  }
  const json = (await res.json()) as { text?: string };
  return json.text ?? "";
}

async function evaluate(params: {
  prompt_text: string;
  target_level: (typeof LEVELS)[number];
  phase: (typeof PHASES)[number];
  transcript: string;
  openaiKey: string;
}): Promise<Feedback> {
  const gateway = createOpenAiProvider(params.openaiKey);
  const model = gateway("gpt-4o-mini");

  const phaseLabel: Record<(typeof PHASES)[number], string> = {
    interview: "Phase 1 — Interview about candidate's background",
    role_play: "Phase 2 — Professional role-play scenario",
    discussion: "Phase 3 — Thematic discussion / opinion",
  };

  const system = `You are an experienced CLOE / CEFR English oral examiner.
You assess short spoken responses transcribed from audio.
You account for spoken-language features (false starts, fillers, contractions) and
do not penalise transcription artefacts. Always reply in English.`;

  const userPrompt = `${phaseLabel[params.phase]} (target level ${params.target_level}).

PROMPT GIVEN TO CANDIDATE:
"""
${params.prompt_text}
"""

CANDIDATE'S TRANSCRIBED RESPONSE:
"""
${params.transcript || "(no speech detected)"}
"""

Return:
- estimated_level: the CEFR level this response actually demonstrates (A1–C2).
- scores (0–5 integers each):
    * fluency — pace, hesitation, length, coherence of delivery.
    * range — vocabulary and grammatical variety appropriate to the task.
    * accuracy — grammatical and lexical correctness.
    * interaction — how well they addressed the prompt / role.
- comments: one short sentence per criterion (<= 25 words) citing evidence.
- tips: 2–4 concrete, prioritised improvements.
- summary: one encouraging sentence (<= 25 words).`;

  const result = await generateText({
    model,
    system,
    prompt: userPrompt,
    output: Output.object({ schema: FeedbackSchema }),
  });
  return result.experimental_output as Feedback;
}

export const Route = createFileRoute("/api/speaking/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") ?? "";
          if (!authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
          const token = authHeader.slice(7);

          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
          if (!OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          });
          const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
          if (claimsErr || !claimsData?.claims?.sub) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
          const userId = claimsData.claims.sub as string;

          const form = await request.formData();
          const audio = form.get("audio");
          const question_id = String(form.get("question_id") ?? "");
          const prompt_text = String(form.get("prompt_text") ?? "");
          const target_level = String(form.get("target_level") ?? "B1") as (typeof LEVELS)[number];
          const phase = String(form.get("phase") ?? "interview") as (typeof PHASES)[number];
          const save = String(form.get("save") ?? "true") !== "false";

          if (!(audio instanceof Blob) || audio.size < 512) {
            return new Response(JSON.stringify({ error: "Recording too short or empty." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (audio.size > 20 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "Recording too large (max 20MB)." }), {
              status: 413,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (!LEVELS.includes(target_level) || !PHASES.includes(phase)) {
            return new Response(JSON.stringify({ error: "Invalid level or phase." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const transcript = await transcribe(audio, OPENAI_API_KEY);
          const feedback = await evaluate({
            prompt_text,
            target_level,
            phase,
            transcript,
            openaiKey: OPENAI_API_KEY,
          });

          const overall = Math.round(
            ((feedback.scores.fluency +
              feedback.scores.range +
              feedback.scores.accuracy +
              feedback.scores.interaction) /
              20) *
              100,
          );

          let attempt_id: string | null = null;
          if (save && question_id) {
            const { data, error } = await supabase
              .from("attempts")
              .insert({
                user_id: userId,
                question_id,
                skill: "speaking",
                cefr_level: feedback.estimated_level,
                user_answer: transcript,
                is_correct: null,
                score: overall / 100,
                feedback: { ...feedback, phase } as never,
              })
              .select("id")
              .single();
            if (!error) attempt_id = data.id;
          }

          return Response.json({ attempt_id, transcript, feedback, overall });
        } catch (e: unknown) {
          const err = e as { message?: string; statusCode?: number };
          const status = err.statusCode === 429 ? 429 : err.statusCode === 402 ? 402 : 500;
          return new Response(
            JSON.stringify({ error: err.message ?? "Speaking evaluation failed" }),
            { status, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
