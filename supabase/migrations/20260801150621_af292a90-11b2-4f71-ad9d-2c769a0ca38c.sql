-- Follow-up pass: 9 rows missed by the first spelling-normalization
-- migration (20260801150441) — the -yze/-yse pattern wasn't covered, and
-- two rows only had explanation OR prompt_text fixed, not both.

-- 1 (prompt_text, correct_answer, AND options array entry must all stay in sync)
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'traveling', 'travelling'),
  correct_answer = replace(correct_answer, 'traveling', 'travelling'),
  options = replace(options::text, 'traveling', 'travelling')::jsonb
WHERE id = 'ca7c3a8e-2f09-40c2-b74f-d0508d6444fb';

-- 2
UPDATE public.questions SET explanation = replace(explanation, 'favor', 'favour')
WHERE id = '1a24c579-723d-45e7-b0ac-1aef7fb8fc3f';

-- 3
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'favor', 'favour'),
  explanation = replace(explanation, 'favor', 'favour')
WHERE id = '6bc42790-df99-4e4b-8b23-2452a5994947';

-- 4
UPDATE public.questions SET prompt_text = replace(prompt_text, 'apologizing', 'apologising')
WHERE id = '43087bc8-7a84-478c-9904-2cc52f3357b2';

-- 5
UPDATE public.questions SET explanation = replace(explanation, 'organization', 'organisation')
WHERE id = '71ba1379-1dcf-4a52-b4d2-1355b2abe500';

-- 6 (-yze/-yse pattern, not -ize/-ise)
UPDATE public.questions SET prompt_text = replace(prompt_text, 'analyzing', 'analysing')
WHERE id = 'a8d89932-2102-47e6-9c0a-d9f672bdec95';

-- 7
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'specializes', 'specialises'),
  explanation = replace(explanation, 'Specialize', 'Specialise')
WHERE id = '85afc8cf-461a-4276-9c38-7caf92346dba';

-- 8 (explanation was already fixed in the first pass; prompt_text was missed)
UPDATE public.questions SET prompt_text = replace(prompt_text, 'color', 'colour')
WHERE id = 'cf0719ad-5ef8-41f2-98f2-e330d39f5996';

-- 9 (prompt_text was already fixed in the first pass; explanation was missed)
UPDATE public.questions SET explanation = replace(explanation, 'favor', 'favour')
WHERE id = '273318cf-98c3-4d08-91af-a3a2ea5fcef1';
