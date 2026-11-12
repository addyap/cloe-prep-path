import { KokoroTTS, env } from "kokoro-js";
import { KOKORO_MODEL } from "../lib/audio-config";
import { speechSegments } from "../lib/speech-script";
import type { KokoroVoice } from "../lib/audio-config";
import { joinWav, pcmToWav } from "../lib/wav";

env.wasmPaths = "/kokoro-runtime/";
let model: Promise<KokoroTTS> | undefined;

self.onmessage = async (
  event: MessageEvent<{ id: number; script: string; voice?: KokoroVoice }>,
) => {
  const { id, script, voice } = event.data;
  const progress = (message: string) => self.postMessage({ id, type: "progress", message });
  try {
    const segments = speechSegments(script, voice);
    progress(
      "Loading the voice model. The first use needs a download; later uses reuse the cache.",
    );
    model ??= KokoroTTS.from_pretrained(KOKORO_MODEL, {
      dtype: "q8",
      device: "wasm",
      progress_callback: (status) => {
        if (status.status === "progress")
          progress(`Downloading voice model: ${Math.round(status.progress)}%`);
      },
    }).catch((error) => {
      model = undefined;
      throw error;
    });
    const tts = await model;
    const audio: ArrayBuffer[] = [];
    for (let i = 0; i < segments.length; i++) {
      progress(`Preparing audio ${i + 1} of ${segments.length}…`);
      const result = await tts.generate(segments[i].text, { voice: segments[i].voice, speed: 1 });
      audio.push(pcmToWav(result.audio, result.sampling_rate));
      if (audio.reduce((sum, part) => sum + part.byteLength, 0) > 24 * 1024 * 1024) {
        throw new Error("Generated audio is too long.");
      }
    }
    const buffer = joinWav(audio);
    self.postMessage({ id, type: "complete", buffer }, { transfer: [buffer] });
  } catch (error) {
    console.error("Kokoro audio generation failed", error);
    const detail = import.meta.env.DEV && error instanceof Error ? ` (${error.message})` : "";
    self.postMessage({
      id,
      type: "error",
      message:
        "Couldn't prepare Kokoro audio on this device. Check your connection and try again." +
        detail,
    });
  }
};
