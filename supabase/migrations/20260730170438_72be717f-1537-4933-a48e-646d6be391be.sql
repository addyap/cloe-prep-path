-- Lets a learner flag a question they think is wrong/ambiguous straight from
-- the practice UI. Insert-only for regular users (own reports); no SELECT
-- policy for `authenticated`, so reports are reviewed via the service-role
-- CLI (`supabase db query --linked`), not exposed to other users.
CREATE TABLE public.question_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_answer TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can report a question" ON public.question_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT INSERT ON public.question_reports TO authenticated;
GRANT ALL ON public.question_reports TO service_role;
