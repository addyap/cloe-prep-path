// Kokoro runs locally in a worker. These settings contain no credentials.
export const AUDIO_VERSION = "kokoro-browser-v1";
export const KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const AUDIO_VERSION_TAG = `#${AUDIO_VERSION}`;
export const PREVIEW_VOICES = [
  "bf_emma",
  "bm_george",
  "bf_isabella",
  "bm_fable",
  "af_heart",
  "am_michael",
] as const;
export type KokoroVoice = (typeof PREVIEW_VOICES)[number];
export const NARRATOR_VOICE: KokoroVoice = "bf_emma";
export const DIALOGUE_VOICES = PREVIEW_VOICES;

export type ListeningAudioTarget = { kind: "question" | "passage"; id: string };

export function isPlayableAudio(url: string | null | undefined): url is string {
  return !!url && /^(https?:\/\/|blob:)/i.test(url);
}

export function needsKokoroAudio(url: string | null | undefined): boolean {
  // Untagged recordings remain playable. Replace generated OpenAI recipes and tts: markers.
  return (
    !isPlayableAudio(url) ||
    /#v\d+$/.test(url) ||
    (/#kokoro[\w-]+$/.test(url) && !url.endsWith(AUDIO_VERSION_TAG))
  );
}
