import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { extractSpokenScript } from "@/lib/utils";

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
const BUCKET = "listening-audio";

async function synthesizeSpeech(text: string, apiKey: string, voice: string): Promise<ArrayBuffer> {
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
      response_format: "mp3",
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`TTS failed (${res.status}): ${t.slice(0, 200)}`);
  }
  return res.arrayBuffer();
}

const InputSchema = z.object({
  limit: z.number().int().min(1).max(30).default(15),
});

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

    const { data: missing, error } = await supabaseAdmin
      .from("questions")
      .select("id, prompt_text")
      .eq("skill", "listening")
      .is("audio_url", null)
      .limit(data.limit);
    if (error) throw new Error(error.message);
    if (!missing || missing.length === 0) return { generated: 0, remaining: 0, errors: [] };

    let generated = 0;
    const errors: string[] = [];

    await Promise.all(
      missing.map(async (q, i) => {
        try {
          const script = extractSpokenScript(q.prompt_text);
          const voice = VOICES[i % VOICES.length];
          const audio = await synthesizeSpeech(script, key, voice);
          const path = `${q.id}.mp3`;
          const { error: upErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
          if (upErr) throw new Error(upErr.message);
          const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
          const { error: updErr } = await supabaseAdmin
            .from("questions")
            .update({ audio_url: pub.publicUrl })
            .eq("id", q.id);
          if (updErr) throw new Error(updErr.message);
          generated++;
        } catch (e: unknown) {
          errors.push(`${q.id}: ${(e as Error).message ?? "unknown error"}`);
        }
      }),
    );

    const { count: remaining } = await supabaseAdmin
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("skill", "listening")
      .is("audio_url", null);

    return { generated, remaining: remaining ?? 0, errors };
  });
