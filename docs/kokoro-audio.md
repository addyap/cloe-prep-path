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

Keep the existing Supabase server variables and the `listening-audio` public
bucket. Admin uploads use `SUPABASE_SERVICE_ROLE_KEY` on the server, as before.
Learner speech and voice previews don't use that key. Keep `OPENAI_API_KEY` for
the existing question generation, transcription, and feedback features.
No additional environment variables or database migrations are required.

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

## Upgrade the shared audio bank

You need a CLOE admin account and the existing Supabase storage setup.

1. Open **Admin → Generate → Voice preview** and play a sample.
2. Enable **Re-voice everything** to replace older clips, including uploaded
   recordings, with Kokoro. Leave it unchecked to fill missing audio only.
3. Select **Re-voice item audio (next 2)** until its remaining count reaches zero.
4. Select **Re-voice passage audio (next 2)** until its count reaches zero.
5. Resolve any reported errors, then verify an item and dialogue as a learner.

Keep the admin page open during each batch. The admin browser performs speech
generation, then uploads directly to Supabase with a short-lived token scoped
to one canonical object path. Audio bytes do not pass through Vercel's request
body. The server checks the admin role, canonical script hash, file metadata,
size, and WAV structure before updating the lesson's audio URL. Signed tokens
are created only for admins; the service-role key stays on the server.

An object path includes a hash of the script, model, voices, and recipe version.
Uploads are immutable, and old objects remain available for rollback. A retry
reuses an uploaded object after a failed row update. The server rejects a save
if its script changed after the batch was loaded.

Re-voicing skips clips tagged with `#kokoro-browser-v1`. Bump `AUDIO_VERSION`
in `src/lib/audio-config.ts` when changing the voicing recipe. If you edit a
script, clear its `audio_url` to regenerate that individual clip.

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
6. Generate an admin batch and verify its stored clips play for another learner
   without initializing the model.

Unit tests cover script parsing, WAV assembly, playback limits, cancellation,
upload scoping, immutable storage, and failure recovery. A live browser check
is also needed to verify WebAssembly, model downloads, and media playback.
Authenticated production bank updates still require access to an admin session
and the production Supabase environment.

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
