import { describe, expect, mock, test } from "bun:test";
import { speechSegments } from "../src/lib/speech-script";
import { joinWav, pcmToWav } from "../src/lib/wav";
import { ListeningPlayer } from "../src/lib/listening-player";
import type { PlayerState } from "../src/lib/listening-player";
import { INITIAL_PLAYER_STATE } from "../src/lib/listening-player";

import { wav } from "./wav-fixture";

describe("Kokoro synthesis", () => {
  test("uses distinct stable speaker voices and omits labels", () => {
    const segments = speechSegments(
      "Anna: Hello.\nBen: Morning.\nAnna: How are you?\nQuite well, thanks.",
    );
    expect(segments.map((s) => s.voice)).toEqual(["bf_emma", "bm_george", "bf_emma"]);
    expect(segments[2].text).toBe("How are you? Quite well, thanks.");
    expect(speechSegments('The email says: "Come at ten."')[0].text).toContain("The email says");
    expect(
      speechSegments("Anna: Hello.\nBen: Morning.", "af_heart").every(
        (segment) => segment.voice === "af_heart",
      ),
    ).toBe(true);
  });
  test("chunks long scripts without losing words and bounds workloads", () => {
    const text = Array(300).fill("A longer sentence.").join(" ");
    const segments = speechSegments(text);
    expect(segments.every((s) => s.text.length <= 280)).toBe(true);
    expect(segments.map((s) => s.text).join(" ")).toBe(text);
    expect(() => speechSegments(" ")).toThrow();
    expect(() => speechSegments("a".repeat(6001))).toThrow();
    expect(() =>
      speechSegments(
        Array.from({ length: 33 }, (_, i) => `${i % 2 ? "Anna" : "Ben"}: Hi.`).join("\n"),
      ),
    ).toThrow();
  });
  test("joins all dialogue turns under a single valid header with pauses", () => {
    const result = joinWav([wav([123, 456]), wav([789])]);
    const view = new DataView(result);
    expect(view.getUint32(4, true)).toBe(result.byteLength - 8);
    expect(view.getUint32(40, true)).toBe(result.byteLength - 44);
    expect(view.getInt16(44, true)).toBe(123);
    expect(view.getInt16(48, true)).toBe(0);
    expect(view.getInt16(result.byteLength - 2, true)).toBe(789);
    expect(() => joinWav([wav(), wav([1], 16000)])).toThrow("inconsistent");
    expect(() => joinWav([new TextEncoder().encode("not audio").buffer])).toThrow();
    expect(() => joinWav([wav().slice(0, 45)])).toThrow();
  });
  test("encodes finite PCM samples with clipping for browser playback", () => {
    const buffer = pcmToWav(new Float32Array([-2, -1, 0, 1, 2]), 24000);
    const view = new DataView(buffer);
    expect(view.getInt16(44, true)).toBe(-32768);
    expect(view.getInt16(48, true)).toBe(0);
    expect(view.getInt16(52, true)).toBe(32767);
    expect(() => pcmToWav(new Float32Array([NaN]), 24000)).toThrow();
  });
});

const target = { kind: "question" as const, id: "11111111-1111-4111-8111-111111111111" };
function playerHarness(
  maxPlays = 2,
  resolve = mock(async () => ({
    audioUrl: "https://storage.example/kokoro.wav#kokoro-browser-v1",
  })),
) {
  let state: PlayerState = { ...INITIAL_PLAYER_STATE };
  const audios: HTMLAudioElement[] = [];
  const create = (url: string) => {
    const audio = {
      src: url,
      playbackRate: 1,
      pause: mock(() => {}),
      play: mock(async () => {}),
      onended: null,
      onpause: null,
      onerror: null,
    } as unknown as HTMLAudioElement;
    audios.push(audio);
    return audio;
  };
  const player = new ListeningPlayer(resolve, maxPlays, (next) => (state = next), create);
  return { player, audios, resolve, state: () => state };
}

describe("practice and exam playback", () => {
  test("resolves legacy scripts with Kokoro, caches replays and enforces the play cap", async () => {
    const h = playerHarness();
    await h.player.play(target, "tts:Legacy script", 0.75);
    expect(h.resolve).toHaveBeenCalledTimes(1);
    expect(h.state().plays).toBe(1);
    expect(h.audios[0].playbackRate).toBe(0.75);
    h.player.setRate(1);
    expect(h.audios[0].playbackRate).toBe(1);
    h.player.stop();
    await h.player.play(target, null);
    expect(h.resolve).toHaveBeenCalledTimes(1);
    h.player.stop();
    await h.player.play(target, null);
    expect(h.audios.length).toBe(2);
  });
  test("replays a generated blob without synthesizing again and releases it on disposal", async () => {
    const h = playerHarness(
      2,
      mock(async () => ({ audioUrl: "blob:https://cloe.example/clip" })),
    );
    await h.player.play(target, null, 1, "Spoken script.");
    h.player.stop();
    await h.player.play(target, null, 1, "Spoken script.");
    expect(h.resolve).toHaveBeenCalledTimes(1);
    expect(h.state().plays).toBe(2);
    const revoke = URL.revokeObjectURL;
    const revoked = mock(() => {});
    URL.revokeObjectURL = revoked;
    try {
      h.player.dispose();
      expect(revoked).toHaveBeenCalledWith("blob:https://cloe.example/clip");
    } finally {
      URL.revokeObjectURL = revoke;
    }
  });
  test("does not spend an exam play on synthesis failure", async () => {
    const resolve = mock(async () => {
      throw new Error("Kokoro is unavailable");
    });
    const h = playerHarness(1, resolve);
    await h.player.play(target, null);
    expect(h.state().plays).toBe(0);
    expect(h.state().error).toBe("Kokoro is unavailable");
    expect(h.state().status).toBe("idle");
  });
  test("keeps an older saved clip playable during a Kokoro outage", async () => {
    const h = playerHarness(
      1,
      mock(async () => {
        throw new Error("Kokoro unavailable");
      }),
    );
    await h.player.play(target, "https://storage.example/old.mp3#v3");
    expect(h.audios[0].src).toEndWith("old.mp3#v3");
    expect(h.state().plays).toBe(1);
    expect(h.state().error).toContain("Playing its saved audio");
  });
  test("retains uploaded recordings and does not spend a play on browser rejection", async () => {
    const h = playerHarness(1);
    const promise = h.player.play(target, "https://storage.example/recorded.mp3");
    await promise;
    expect(h.resolve).not.toHaveBeenCalled();
    expect(h.state().plays).toBe(1);
    h.player.reset();
    // Set up a browser that rejects playback before it starts.
    let rejectedState: PlayerState = { ...INITIAL_PLAYER_STATE };
    const failed = new ListeningPlayer(
      h.resolve,
      1,
      (state) => {
        rejectedState = state;
      },
      () =>
        ({
          pause() {},
          play: async () => {
            throw new Error("Playback blocked");
          },
        }) as unknown as HTMLAudioElement,
    );
    await failed.play(target, "https://storage.example/recorded.mp3");
    expect(rejectedState.plays).toBe(0);
    expect(rejectedState.error).toBe("Playback blocked");
    expect(rejectedState.status).toBe("idle");
  });
  test("ignores duplicate clicks and late synthesis after navigation", async () => {
    let finish!: (value: { audioUrl: string }) => void;
    const resolve = mock(() => new Promise<{ audioUrl: string }>((res) => (finish = res)));
    const h = playerHarness(1, resolve);
    const pending = h.player.play(target, null);
    await h.player.play(target, null);
    expect(resolve).toHaveBeenCalledTimes(1);
    h.player.reset();
    finish({ audioUrl: "https://storage.example/late.wav" });
    await pending;
    expect(h.audios.length).toBe(0);
    expect(h.state().plays).toBe(0);
  });
  test("stops active audio on navigation and ignores late playback success", async () => {
    const h = playerHarness(1);
    const playback = h.player.play(target, "https://storage.example/exam.mp3");
    h.player.stop();
    await playback;
    expect(h.audios[0].pause).toHaveBeenCalled();
    expect(h.state().plays).toBe(0);
    expect(h.state().status).toBe("idle");
  });
});
