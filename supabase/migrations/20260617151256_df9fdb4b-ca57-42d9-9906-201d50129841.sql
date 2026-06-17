
CREATE TABLE public.passages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  skill public.skill_type NOT NULL DEFAULT 'reading',
  cefr_level public.cefr_level NOT NULL,
  context_tag public.context_tag NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.passages TO authenticated;
GRANT ALL ON public.passages TO service_role;

ALTER TABLE public.passages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read passages"
  ON public.passages FOR SELECT TO authenticated USING (true);

ALTER TABLE public.questions
  ADD COLUMN passage_id uuid REFERENCES public.passages(id) ON DELETE CASCADE;

CREATE INDEX idx_questions_passage_id ON public.questions(passage_id);
