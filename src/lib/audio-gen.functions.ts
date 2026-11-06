import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const BatchSchema = z.object({
  kind: z.enum(["question", "passage"]),
  regenerateAll: z.boolean().default(false),
});

export const getListeningAudioBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => BatchSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) throw new Error("Forbidden: admin only");
    const { getAudioBatch } = await import("./listening-audio.server");
    return getAudioBatch(data.kind, data.regenerateAll);
  });

const TargetSchema = z.object({
  kind: z.enum(["question", "passage"]),
  id: z.string().uuid(),
  cacheKey: z.string().regex(/^[a-f0-9]{64}$/),
});

export const createListeningAudioUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => TargetSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) throw new Error("Forbidden: admin only");
    const { createAudioUpload } = await import("./listening-audio.server");
    return createAudioUpload(data);
  });

export const saveListeningAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => TargetSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin) throw new Error("Forbidden: admin only");
    const { storeListeningAudio } = await import("./listening-audio.server");
    return { audioUrl: await storeListeningAudio(data) };
  });
