-- The listening_prompt_text_format constraint (20260730164322) was written
-- before the listening passage layer existed, and only accounted for the
-- single-item "You hear: "<script>" <question>?" format. Passage-linked
-- listening questions correctly have plain question text with no embedded
-- script (the script lives in passages.body instead), so the constraint
-- needs to exempt rows with a passage_id.
ALTER TABLE public.questions DROP CONSTRAINT listening_prompt_text_format;

ALTER TABLE public.questions
  ADD CONSTRAINT listening_prompt_text_format CHECK (
    skill <> 'listening' OR passage_id IS NOT NULL OR prompt_text ~ '^You hear: "[^"]*" .*\?$'
  );
