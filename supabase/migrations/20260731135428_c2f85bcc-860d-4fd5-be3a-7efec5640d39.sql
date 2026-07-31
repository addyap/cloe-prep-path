-- Phase 1 of the fill-in-the-blank / text-reconstruction / word-bank format
-- rebuild (content-completeness audit against the official CLOE written
-- section, which lists these as distinct item types alongside MCQ).
--
-- gap_fill already exists in question_type but has never had real content —
-- confirmed zero existing gap_fill rows before adding these constraints, so
-- no NOT VALID / backfill needed. options is deliberately left unconstrained
-- (unused by the UI today, but keeps a future "accepted alternate answers"
-- escape hatch cheap).
ALTER TABLE public.questions
  ADD CONSTRAINT gap_fill_requires_answer CHECK (
    type <> 'gap_fill' OR correct_answer IS NOT NULL
  );

ALTER TABLE public.questions
  ADD CONSTRAINT gap_fill_prompt_has_blank CHECK (
    type <> 'gap_fill' OR strpos(prompt_text, '_____') > 0
  );
