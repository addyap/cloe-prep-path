-- Third follow-up pass: final 2 rows missed by prior spelling-
-- normalization migrations (already applied directly via `supabase db
-- query --linked`; this migration file exists to keep the version-
-- controlled migration history in sync with the live database).

-- prompt_text was missed in the 20260801150904 pass (explanation/options
-- for this same row were fixed then, but not the spoken listening script).
UPDATE public.questions SET prompt_text = replace(prompt_text, 'finalizing', 'finalising')
WHERE id = '45b96713-3aaf-44d1-a0cb-e3d46f45bcbb';

UPDATE public.questions SET explanation = replace(explanation, 'minimization', 'minimisation')
WHERE id = 'a6120d0e-f07d-4b8a-b606-dd95e026626f';
