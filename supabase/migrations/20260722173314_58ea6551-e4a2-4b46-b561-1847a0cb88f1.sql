-- Fix a TOCTOU race in first-admin bootstrap: the app previously did a
-- count-then-insert as two separate round-trips (admin.functions.ts's
-- claimFirstAdmin), so two concurrent requests during the bootstrap window
-- could both read count=0 and both succeed. An advisory lock inside a single
-- atomic function closes that window.
CREATE OR REPLACE FUNCTION public.claim_first_admin(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('claim_first_admin'));
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'An admin already exists. Ask an existing admin to grant access.';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'admin');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_first_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin(uuid) TO authenticated;

-- Restrict badges.code to the fixed set of badges the app actually awards
-- (src/lib/progress-stats.ts's evaluateBadges) — previously any authenticated
-- user could INSERT an arbitrary code value for themselves.
ALTER TABLE public.badges
  ADD CONSTRAINT badges_code_check
  CHECK (code IN ('first_steps', 'century_club', 'first_mock', 'seven_day_streak', 'level_up'));
