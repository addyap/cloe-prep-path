import type { KokoroVoice } from "./audio-config";
import { speechCacheKey } from "./speech-cache-key";

const CACHE = "cloe-kokoro-audio-v1";
let worker: Worker | undefined;
let nextId = 0;
let queue: Promise<unknown> = Promise.resolve();

async function cacheAudio(key: string, blob?: Blob): Promise<Blob | undefined> {
  try {
    if (!globalThis.caches) return;
    const cache = await caches.open(CACHE);
    const url = new URL(`/__kokoro_cache__/${key}`, location.origin).href;
    if (!blob) return (await cache.match(url))?.blob();
    await cache.put(
      url,
      new Response(blob, {
        headers: { "content-type": "audio/wav", "content-length": String(blob.size) },
      }),
    );
    const keys = await cache.keys();
    let size = 0;
    for (const request of [...keys].reverse()) {
      const item = await cache.match(request);
      size += Number(item?.headers.get("content-length") || 0);
      if (size > 32 * 1024 * 1024 || keys.indexOf(request) < keys.length - 12)
        await cache.delete(request);
    }
  } catch {
    /* Cache restrictions and quota must not prevent speech playback. */
  }
}

// One model and one generation at a time, regardless of how many controls ask.
export async function synthesizeBrowserSpeech(
  script: string,
  voice?: KokoroVoice,
  progress?: (message: string) => void,
): Promise<Blob> {
  const key = await speechCacheKey(script, voice);
  const cached = await cacheAudio(key);
  if (cached) return cached;
  const run = async () => {
    const cached = await cacheAudio(key);
    if (cached) return cached;
    if (typeof Worker === "undefined" || typeof WebAssembly === "undefined")
      throw new Error("Kokoro needs a browser with WebAssembly support.");
    worker ??= new Worker(new URL("../workers/kokoro.worker.ts", import.meta.url), {
      type: "module",
    });
    const activeWorker = worker;
    const id = ++nextId;
    const blob = await new Promise<Blob>((resolve, reject) => {
      const finish = (error?: Error, buffer?: ArrayBuffer) => {
        clearTimeout(timer);
        activeWorker.onmessage = activeWorker.onerror = activeWorker.onmessageerror = null;
        if (error) {
          activeWorker.terminate();
          worker = undefined;
          reject(error);
        } else resolve(new Blob([buffer!], { type: "audio/wav" }));
      };
      const timer = setTimeout(
        () => finish(new Error("Preparing audio took too long. Press play to retry.")),
        300_000,
      );
      activeWorker.onmessage = (event) => {
        if (event.data.id !== id) return;
        if (event.data.type === "progress") progress?.(event.data.message);
        else if (event.data.type === "complete") finish(undefined, event.data.buffer);
        else finish(new Error(event.data.message));
      };
      activeWorker.onerror = activeWorker.onmessageerror = () =>
        finish(new Error("Couldn't start Kokoro audio. Refresh and try again."));
      activeWorker.postMessage({ id, script, voice });
    });
    await cacheAudio(key, blob);
    return blob;
  };
  const pending = queue.then(run, run);
  queue = pending.catch(() => {});
  return pending;
}
