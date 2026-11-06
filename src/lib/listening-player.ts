import { isPlayableAudio, needsKokoroAudio } from "./audio-config";
import type { ListeningAudioTarget } from "./audio-config";

export type PlayerState = {
  plays: number;
  status: "idle" | "loading" | "playing";
  error: string | null;
};
export const INITIAL_PLAYER_STATE: PlayerState = { plays: 0, status: "idle", error: null };

export class ListeningPlayer {
  private state: PlayerState = { ...INITIAL_PLAYER_STATE };
  private request = 0;
  private audio: HTMLAudioElement | null = null;
  private urls = new Map<string, string>();

  constructor(
    private resolve: (
      target: ListeningAudioTarget,
      script?: string,
    ) => Promise<{ audioUrl: string }>,
    private maxPlays: number,
    private changed: (state: PlayerState) => void,
    private createAudio: (url: string) => HTMLAudioElement = (url) => new Audio(url),
  ) {}

  private update(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.changed(this.state);
  }

  stop() {
    this.request++;
    if (this.audio) {
      this.audio.onended = this.audio.onpause = this.audio.onerror = null;
      this.audio.pause();
      this.audio = null;
    }
    this.update({ status: "idle" });
  }

  dispose() {
    this.stop();
    for (const url of this.urls.values()) if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    this.urls.clear();
  }

  reset() {
    this.stop();
    this.update({ ...INITIAL_PLAYER_STATE });
  }

  setRate(rate: number) {
    if (this.audio) this.audio.playbackRate = rate;
  }

  async play(target: ListeningAudioTarget, audioUrl: string | null, rate = 1, script?: string) {
    if (
      this.state.status === "loading" ||
      this.state.status === "playing" ||
      this.state.plays >= this.maxPlays
    )
      return;
    this.stop();
    const request = this.request;
    this.update({ status: "loading", error: null });
    const key = `${target.kind}:${target.id}`;
    let url = this.urls.get(key) ?? audioUrl;
    let note: string | null = null;
    try {
      if (needsKokoroAudio(url)) {
        try {
          url = (await this.resolve(target, script)).audioUrl;
          if (request !== this.request) {
            if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            return;
          }
          this.urls.set(key, url);
        } catch (error) {
          // Keep an existing lesson usable during provider outages or migration.
          if (!isPlayableAudio(url)) throw error;
          note = "Kokoro couldn't prepare this clip. Playing its saved audio.";
        }
        if (request !== this.request) return;
      }
      const audio = this.createAudio(url!);
      this.audio = audio;
      audio.playbackRate = rate;
      audio.onended = audio.onpause = () => {
        if (request === this.request) this.update({ status: "idle" });
      };
      audio.onerror = () => {
        if (request === this.request) {
          this.urls.delete(key);
          this.stop();
          this.update({
            error: "Couldn't load the audio. Check your connection and press play to retry.",
          });
        }
      };
      await audio.play();
      if (request !== this.request) {
        audio.pause();
        return;
      }
      this.update({ status: "playing", plays: this.state.plays + 1, error: note });
    } catch (error) {
      if (request !== this.request) return;
      this.stop();
      this.update({
        error:
          error instanceof Error && error.name === "NotAllowedError"
            ? "Audio is ready. Press play again to start."
            : error instanceof Error && error.message
              ? error.message
              : "Couldn't play the audio. Press play to retry.",
      });
    }
  }
}
