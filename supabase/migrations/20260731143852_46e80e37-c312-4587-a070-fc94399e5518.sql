-- Follow-up to the 'reconstruction' enum addition. Requires at least 3
-- word/phrase chunks in `options` (the scrambled-at-render chunk array, in
-- canonical correct order as stored) and a non-null correct_answer (the
-- canonical joined sentence, used for exact-match grading). A stronger
-- constraint asserting correct_answer = join(options,' ') would need an
-- IMMUTABLE helper function for little benefit — that assertion lives in
-- the Python content validator instead.
--
-- Pre-flight: confirmed 0 existing reconstruction rows before applying.
ALTER TABLE public.questions
  ADD CONSTRAINT reconstruction_shape CHECK (
    type <> 'reconstruction' OR (
      jsonb_typeof(options) = 'array' AND jsonb_array_length(options) >= 3
      AND correct_answer IS NOT NULL
    )
  );
