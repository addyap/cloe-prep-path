import type {
  getListeningAudioBatch,
  saveListeningAudio,
  createListeningAudioUpload,
} from "./audio-gen.functions";

export async function generateBrowserAudioBatch(
  kind: "question" | "passage",
  regenerateAll: boolean,
  getBatch: (
    ...args: Parameters<typeof getListeningAudioBatch>
  ) => ReturnType<typeof getListeningAudioBatch>,
  save: (...args: Parameters<typeof saveListeningAudio>) => ReturnType<typeof saveListeningAudio>,
  prepare: (
    ...args: Parameters<typeof createListeningAudioUpload>
  ) => ReturnType<typeof createListeningAudioUpload>,
  progress?: (message: string) => void,
) {
  const { synthesizeBrowserSpeech } = await import("./kokoro-browser");
  const options = { kind, regenerateAll };
  const batch = await getBatch({ data: options });
  let generated = 0;
  const errors: string[] = [];
  for (const item of batch.items) {
    try {
      const target = { kind: item.kind, id: item.id, cacheKey: item.cacheKey };
      const upload = await prepare({ data: target });
      if (upload.token) {
        const audio = await synthesizeBrowserSpeech(item.script, undefined, progress);
        const { supabase } = await import("@/integrations/supabase/client");
        const { error } = await supabase.storage
          .from("listening-audio")
          .uploadToSignedUrl(upload.path, upload.token, audio, {
            contentType: "audio/wav",
            cacheControl: "31536000",
          });
        // Finalization also handles another admin winning an immutable upload.
        if (error) {
          const completed = await prepare({ data: target });
          if (completed.token) throw new Error("Couldn't upload the generated audio. Try again.");
        }
      }
      await save({ data: target });
      generated++;
    } catch (error) {
      errors.push(
        `${item.id}: ${error instanceof Error ? error.message : "Couldn't generate audio."}`,
      );
    }
  }
  const { remaining } = await getBatch({ data: options });
  return { generated, remaining, errors };
}
