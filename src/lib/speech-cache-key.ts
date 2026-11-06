import { AUDIO_VERSION, KOKORO_MODEL } from "./audio-config";
import type { KokoroVoice } from "./audio-config";
import { speechSegments } from "./speech-script";

export async function speechCacheKey(script: string, voice?: KokoroVoice): Promise<string> {
  const recipe = JSON.stringify([AUDIO_VERSION, KOKORO_MODEL, "q8", speechSegments(script, voice)]);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(recipe));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
