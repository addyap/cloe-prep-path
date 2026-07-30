-- Guardrail found by a global content audit: listening prompt_text parsing
-- (extractSpokenScript / extractQuestion in src/lib/utils.ts and
-- practice.listening.tsx) relies on the exact shape
-- `You hear: "<script>" <question>?` with no other quote marks in the
-- string. Nothing previously enforced this at the data layer, so a future
-- content round could silently ship a row that breaks TTS playback or the
-- printed-question split. All 168 existing listening rows already satisfy
-- this pattern (verified before adding the constraint), so this is safe to
-- apply as NOT VALID-free (no existing violators).
ALTER TABLE public.questions
  ADD CONSTRAINT listening_prompt_text_format CHECK (
    skill <> 'listening' OR prompt_text ~ '^You hear: "[^"]*" .*\?$'
  );
