import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { extractSpokenScript } from "./utils";
import { AUDIO_VERSION, AUDIO_VERSION_TAG } from "./audio-config";
import type { ListeningAudioTarget } from "./audio-config";
import { speechCacheKey } from "./speech-cache-key";
import { joinWav } from "./wav";

type ListeningSource = ListeningAudioTarget & { script: string; audioUrl: string | null };
const BUCKET = "listening-audio";
const MISSING_OR = "audio_url.is.null,audio_url.eq.,audio_url.ilike.tts:*";
const STALE_OR = `${MISSING_OR},audio_url.not.ilike.*${AUDIO_VERSION_TAG}`;

export async function readListeningSource(
  client: SupabaseClient<Database>,
  target: ListeningAudioTarget,
): Promise<ListeningSource> {
  if (target.kind === "question") {
    const { data, error } = await client
      .from("questions")
      .select("id, prompt_text, audio_url, passage_id")
      .eq("id", target.id)
      .eq("skill", "listening")
      .single();
    if (error || !data) throw new Error("Listening question is unavailable.");
    if (data.passage_id)
      return readListeningSource(client, { kind: "passage", id: data.passage_id });
    return {
      ...target,
      audioUrl: data.audio_url,
      script: data.audio_url?.startsWith("tts:")
        ? data.audio_url.slice(4)
        : extractSpokenScript(data.prompt_text),
    };
  }
  const { data, error } = await client
    .from("passages")
    .select("id, body, audio_url")
    .eq("id", target.id)
    .eq("skill", "listening")
    .single();
  if (error || !data) throw new Error("Listening passage is unavailable.");
  return { ...target, audioUrl: data.audio_url, script: data.body };
}

type AudioTarget = ListeningAudioTarget & { cacheKey: string };

async function audioDestination(target: AudioTarget) {
  const source = await readListeningSource(supabaseAdmin, target);
  const cacheKey = await speechCacheKey(source.script);
  if (cacheKey !== target.cacheKey)
    throw new Error("The script changed. Refresh the audio batch and try again.");
  const path = `${AUDIO_VERSION}/${source.kind}-${source.id}-${cacheKey}.wav`;
  return { source, path, bucket: supabaseAdmin.storage.from(BUCKET) };
}

export async function createAudioUpload(target: AudioTarget) {
  const { path, bucket } = await audioDestination(target);
  const { data: exists, error: lookupError } = await bucket.exists(path);
  if (
    lookupError &&
    ![400, 404].includes(Number("status" in lookupError ? lookupError.status : 0))
  ) {
    throw new Error("Couldn't check the audio storage.");
  }
  if (exists) return { path, token: null };
  const { data, error } = await bucket.createSignedUploadUrl(path, { upsert: false });
  if (error || !data) throw new Error("Couldn't prepare the audio upload.");
  return { path, token: data.token };
}

export async function storeListeningAudio(target: AudioTarget): Promise<string> {
  const { source, path, bucket } = await audioDestination(target);
  const { data: metadata, error: infoError } = await bucket.info(path);
  if (
    infoError ||
    !metadata ||
    typeof metadata.size !== "number" ||
    metadata.size < 44 ||
    metadata.size > 24 * 1024 * 1024 ||
    metadata.contentType !== "audio/wav"
  ) {
    throw new Error("Upload a WAV clip smaller than 24 MB.");
  }
  const { data: audio, error: downloadError } = await bucket.download(path);
  if (downloadError || !audio) throw new Error("Couldn't verify the uploaded audio.");
  joinWav([await audio.arrayBuffer()]); // Validate PCM and all RIFF lengths before publishing the row.
  const audioUrl = bucket.getPublicUrl(path).data.publicUrl + AUDIO_VERSION_TAG;
  const table = source.kind === "question" ? "questions" : "passages";
  const query = supabaseAdmin.from(table).update({ audio_url: audioUrl }).eq("id", source.id);
  const { error: updateError } = await (source.audioUrl === null
    ? query.is("audio_url", null)
    : query.eq("audio_url", source.audioUrl));
  if (updateError)
    throw new Error(
      "Audio was saved, but the exercise couldn't be updated. Retry to reuse the saved clip.",
    );
  return audioUrl;
}

export async function getAudioBatch(kind: "question" | "passage", regenerateAll: boolean) {
  const table = kind === "question" ? "questions" : "passages";
  const predicate = regenerateAll ? STALE_OR : MISSING_OR;
  const query = supabaseAdmin.from(table).select("id").eq("skill", "listening").or(predicate);
  const { data: rows, error } = await (kind === "question" ? query.is("passage_id", null) : query)
    .order("id")
    .limit(2);
  if (error) throw new Error("Couldn't load the listening audio queue.");
  const items = await Promise.all(
    (rows ?? []).map(async (row) => {
      const source = await readListeningSource(supabaseAdmin, { kind, id: row.id });
      return { ...source, cacheKey: await speechCacheKey(source.script) };
    }),
  );
  const countQuery = supabaseAdmin
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("skill", "listening")
    .or(predicate);
  const { count, error: countError } = await (kind === "question"
    ? countQuery.is("passage_id", null)
    : countQuery);
  if (countError) throw new Error("Couldn't load the remaining audio count.");
  return { items, remaining: count ?? 0 };
}
