# Use browser-based Kokoro audio

This guide helps CLOE maintainers deploy Kokoro speech on Vercel, upgrade the
listening bank, and verify playback. Speech runs locally in a browser worker.
You don't need a DeepInfra account, speech API key, or separate Kokoro server.

## Deploy

Use the normal Vercel deployment workflow. The build targets Nitro's `vercel`
preset. The `prebuild` script copies the installed ONNX runtime into
`public/kokoro-runtime`; Vite includes these files and a separate speech worker
in the static deployment. The worker loads only when speech generation is
needed. Model weights and voices download from Hugging Face on first use.

The site has no database (see CLAUDE.md). Keep `OPENAI_API_KEY` for writing
feedback and speaking transcription and feedback. No other environment
variables are required.

The security policy permits WebAssembly compilation and model downloads from
Hugging Face. Executable runtime modules are served from the application's own
origin. No speech-service credentials are included in the browser bundle.

## Play listening exercises

Practice and mock exams share one player:

- Current stored Kokoro clips and uploaded recordings play directly.
- Missing clips, legacy `tts:` placeholders, and older generated clips use
  browser Kokoro. The learner sees model-download and generation progress.
- Browser model assets and up to 12 generated clips, bounded to 32 MB, are
  cached when storage is available. Playback still works if caching is blocked.
- If local generation fails while upgrading an older clip, its saved audio
  plays with an explanatory message. Missing clips show a retry message.
- A play counts after playback starts: two plays in practice and one in mock
  exams. A blocked browser start offers another Play click without consuming
  the allowance. Navigating away stops audio and suppresses late playback.

The first generation needs a substantial model download and enough device
memory for inference. Later runs reuse cached assets when available. Generation
speed depends on the device. Stored bank clips avoid the model download
entirely, so upgrading the bank is useful for learners on slower devices.

Narration uses Emma. Labelled dialogues assign a stable, distinct voice to
each speaker without speaking the labels. Standalone question extraction omits
the printed question after a quoted script. Long scripts are split into short
segments to avoid Kokoro's tokenizer limit. Output is 24 kHz, 16-bit PCM WAV,
joined under one RIFF header with short pauses between segments.

## Record the shared audio bank

Every listening question and passage is pre-recorded with Kokoro on a
maintainer's computer and shipped as static files in `public/audio/`, so
learners normally never load the model. Browser generation is only a fallback
for a clip that has no recording.

1. One-off setup: `brew install uv ffmpeg espeak-ng`, then `npm run audio:setup`.
2. After editing listening content in `src/data/*.json`, run `npm run audio`.
   It records new or changed clips and writes each item's `audio_url`
   (`/audio/q-<id>.mp3?v=<fingerprint>` or `/audio/passage-<id>.mp3?v=…`).
3. Commit the new MP3s and the updated JSON.

`npm run audio -- --force` re-records everything.

## Verify a change

Run the local checks with the committed Bun lockfile:

```sh
bun install --frozen-lockfile
bun run test
bunx tsc --noEmit
bun run build
```

The scripts prepare runtime files automatically for development and builds.
To start local development, run:

```sh
bun run dev
```

Verify these browser behaviors:

1. Generate a missing clip and wait for the loading message to complete.
2. Play and replay it, change the practice speed, and verify the play cap.
3. Play a dialogue and confirm both voices and the complete script are audible.
4. Navigate away while generation or playback is in progress; confirm it does
   not start or continue in the next question.
5. Test a failed generation or playback start; confirm a retry remains possible.
6. Play a recorded clip and confirm it plays without loading the model.

Unit tests cover script parsing, WAV assembly, playback limits, cancellation
and failure recovery. A live browser check is also needed to verify
WebAssembly, model downloads, and media playback.

## Dependencies and limits

The implementation uses [kokoro-js](https://github.com/hexgrad/kokoro/tree/main/kokoro.js)
and its quantized `onnx-community/Kokoro-82M-v1.0-ONNX` model with the WASM backend.
It does not require WebGPU or cross-origin isolation headers. Each script is
limited to 6,000 characters and 32 segments. Generation is serialized through
one worker and has a five-minute timeout. Shared clips must be smaller than
24 MB. Private browsing, storage quotas, low memory, and slow CPUs can affect
generation or cache retention; saved audio remains the least demanding path.

## Roll back

Revert the code change and redeploy to restore the previous generator. To
restore specific earlier clips, set their `audio_url` values to the retained
storage object URLs. Back up the database before a bank-wide re-voice if you
need to restore all previous assignments together. Learner recording and
transcription retain their existing implementation.
