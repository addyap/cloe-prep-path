ALTER TABLE public.passages  ADD COLUMN word_bank jsonb;
ALTER TABLE public.questions ADD COLUMN ordinal   smallint;

ALTER TABLE public.passages
  ADD CONSTRAINT word_bank_is_array CHECK (
    word_bank IS NULL OR (jsonb_typeof(word_bank) = 'array' AND jsonb_array_length(word_bank) >= 3)
  );

ALTER TABLE public.questions
  ADD CONSTRAINT word_bank_shape CHECK (
    type <> 'word_bank' OR (passage_id IS NOT NULL AND ordinal IS NOT NULL AND correct_answer IS NOT NULL)
  );

CREATE UNIQUE INDEX idx_questions_passage_ordinal
  ON public.questions (passage_id, ordinal) WHERE type = 'word_bank';
