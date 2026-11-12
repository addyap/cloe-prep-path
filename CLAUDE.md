# cloe-prep-path

CLOE Prep: practice for the CLOE English certification. TanStack Start (React) on Vercel.

## No database, no sign-in (November 2026)

The site used to run on a Supabase project that Lovable set up. That project disappeared in November 2026 (its address stopped resolving), which broke sign-in and the whole practice area. It was rebuilt without a backend rather than restored:

- **Content** (`src/data/questions.json`, `src/data/passages.json`) was recovered from the old Supabase migrations and ships with the site. Edit these files to change content. They are loaded on first use.
- **Learner data** (profile, attempts, sessions, badges) is kept in the learner's own browser (localStorage). There are no accounts: each browser is one learner. Learners were already anonymous before (silent anonymous sign-in), so nothing user-facing was lost.
- **`src/lib/local-db.ts`** provides `db`, which mimics the small part of the Supabase client the pages used (`db.from(table).select().eq()…`, `db.auth.getUser()`). Use it for all data. It returns whole rows and ignores column lists; joins (`questions(context_tag)`) aren't supported, so join in the page.
- Don't add a database, sign-in or other runtime backend back without asking.

## Audio

Listening audio is recorded ahead of time with Kokoro (free, runs locally), British voices, into `public/audio/q-<id>.mp3` and `public/audio/passage-<id>.mp3`. `npm run audio` (after a one-off `npm run audio:setup`, which needs `brew install uv ffmpeg espeak-ng`) records what's new or changed and writes each item's `audio_url` (with a `?v=` fingerprint) into the JSON. Edit listening text, then re-run it.

## AI feedback (still OpenAI)

Writing feedback (`src/lib/writing-feedback.functions.ts`) and speaking evaluation (`src/routes/api/speaking/evaluate.ts`) are server functions that call OpenAI with `OPENAI_API_KEY` (a Vercel environment variable). They only mark the answer; the browser saves the attempt (`src/lib/attempts.ts`). They need no sign-in, as before (learners were anonymous then too).

## Commands

- `npm run dev`, `npm run build`, `npm run lint`
- `npm run audio:setup` once, then `npm run audio` to record listening audio
