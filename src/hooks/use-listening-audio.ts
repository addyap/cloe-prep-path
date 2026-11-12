import { useEffect, useMemo, useState } from "react";
import type { ListeningAudioTarget } from "@/lib/audio-config";
import { INITIAL_PLAYER_STATE, ListeningPlayer } from "@/lib/listening-player";

export function useListeningAudio(unitKey: string | undefined, maxPlays: number, rate = 1) {
  const [loadingNote, setLoadingNote] = useState("Preparing audio…");
  const [state, setState] = useState(INITIAL_PLAYER_STATE);
  const player = useMemo(
    () =>
      new ListeningPlayer(
        async (_target, script) => {
          if (!script) throw new Error("This clip has no spoken script.");
          const { synthesizeBrowserSpeech } = await import("@/lib/kokoro-browser");
          const blob = await synthesizeBrowserSpeech(script, undefined, setLoadingNote);
          return { audioUrl: URL.createObjectURL(blob) };
        },
        maxPlays,
        setState,
      ),
    [maxPlays],
  );
  useEffect(() => {
    player.reset();
    return () => player.dispose();
  }, [player, unitKey]);
  useEffect(() => player.setRate(rate), [player, rate]);
  return {
    ...state,
    loadingNote,
    play: (target: ListeningAudioTarget, url: string | null, script: string) =>
      player.play(target, url, rate, script),
    stop: () => player.stop(),
  };
}
