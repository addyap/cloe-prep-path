-- BrE/AmE spelling normalization pass (punch-list item #3 from the
-- 2026-08-01 quality audit). Brings ~a dozen individually-authored
-- `questions` rows into line with the British-English standard already
-- used consistently in `passages` and the bulk of `questions`.
-- organize->organise family, license->licence (noun), vacation->holiday,
-- color->colour, program->programme (institution sense), favor->favour,
-- traveling->travelling, rumor->rumour.

-- 1
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'apologized', 'apologised'),
  explanation = replace(explanation, 'Apologize', 'Apologise')
WHERE id = '879b22d8-aa3e-4184-9df1-584d16282e95';

-- 2
UPDATE public.questions SET prompt_text = replace(prompt_text, 'apologizes', 'apologises')
WHERE id = 'cf64768f-540c-40e9-aba2-d710c1c8c4ae';

-- 3
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '17f8dd47-2474-4eb1-aa33-190a02678787';

-- 4
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '84b64e14-54c4-445f-8486-84b6940104df';

-- 5
UPDATE public.questions SET explanation = replace(explanation, 'apologizes', 'apologises')
WHERE id = 'de68800a-7035-44b3-95cb-cab70cdac249';

-- 6 (phrase-level reword, not a single-word swap)
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'requested the same week off for vacation', 'requested the same week''s holiday')
WHERE id = 'f4a07a49-e08a-45b4-b93b-8b9aac90445b';

-- 7 (prompt_text, correct_answer, AND the matching options array entry must all stay in sync)
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'Apologizing', 'Apologising'),
  correct_answer = replace(correct_answer, 'apologize', 'apologise'),
  options = replace(options::text, 'apologize', 'apologise')::jsonb
WHERE id = '5da5e01f-1447-4258-972d-a8db5f1287f6';

-- 8
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '0ac567f4-d63e-45a1-9b86-09e0785c8581';

-- 9
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'Summarizing', 'Summarising'),
  explanation = replace(explanation, 'organizes', 'organises')
WHERE id = 'b9d770c8-464c-4f27-9118-6ce0de9215d7';

-- 10
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '0a53869d-f796-4050-9d4c-4e8dcf115044';

-- 11 (phrase-level reword)
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'unlimited vacation days', 'unlimited holiday allowance')
WHERE id = '23798614-628d-453d-9a24-7444f97d1d39';

-- 12
UPDATE public.questions SET explanation = replace(explanation, 'colors', 'colours')
WHERE id = 'cf0719ad-5ef8-41f2-98f2-e330d39f5996';

-- 13
UPDATE public.questions SET
  prompt_text = replace(prompt_text, 'license', 'licence'),
  explanation = replace(explanation, 'license', 'licence')
WHERE id = 'df3e9b91-6762-424a-a1ea-762a31f6bbf3';

-- 14
UPDATE public.questions SET prompt_text = replace(prompt_text, 'color', 'colour')
WHERE id = '47d44884-0710-4e12-9e6e-3ab3286f9471';

-- 15
UPDATE public.questions SET prompt_text = replace(prompt_text, 'program', 'programme')
WHERE id = '6017eefa-4dc3-4788-8e14-1a3021b6d5f4';

-- 16
UPDATE public.questions SET explanation = replace(explanation, 'organize', 'organise')
WHERE id = '901cd7d3-a410-4cd2-a4b9-344830745508';

-- 17
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '2c214b5c-55b4-4eca-a46a-8cb2d849ab89';

-- 18
UPDATE public.questions SET prompt_text = replace(prompt_text, 'organize', 'organise')
WHERE id = '79dafaae-09d2-4ba1-9348-c4115002c330';

-- 19
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '1b8f6180-6e15-401f-b3eb-fffd6c26fae7';

-- 20
UPDATE public.questions SET explanation = replace(explanation, 'organized', 'organised')
WHERE id = '0518eb86-d5d1-49a4-b5b1-7cbc88f5e99f';

-- 21 (distractor in options array — correct_answer unaffected)
UPDATE public.questions SET options = replace(options::text, 'vacation', 'holiday')::jsonb
WHERE id = '9dcbe32d-12f2-4581-b8aa-19bd20669ec4';

-- 22 (two distractors in options array)
UPDATE public.questions SET
  options = replace(replace(options::text, 'vacation', 'holiday'), 'rumor', 'rumour')::jsonb
WHERE id = '2d94b437-cc6f-4233-a924-d957a8537510';

-- 23 (distractor in options array)
UPDATE public.questions SET options = replace(options::text, 'color', 'colour')::jsonb
WHERE id = '880966d0-230c-4759-95f8-2f958e1fdda4';

-- 24
UPDATE public.questions SET prompt_text = replace(prompt_text, 'traveling', 'travelling')
WHERE id = 'e32ba2bf-ab32-4256-a80a-1808d159431d';

-- 25
UPDATE public.questions SET explanation = replace(explanation, 'organization', 'organisation')
WHERE id = '14bf6dff-4000-4502-9eef-91297936cb9d';

-- 26
UPDATE public.questions SET explanation = replace(explanation, 'organization', 'organisation')
WHERE id = '09052fdc-9bdf-4759-b0fc-0025dee58dec';

-- 27
UPDATE public.questions SET explanation = replace(explanation, 'favor', 'favour')
WHERE id = 'e0d045f4-3ffd-402f-9a44-c28baafe219a';

-- 28
UPDATE public.questions SET prompt_text = replace(prompt_text, 'Organizational', 'Organisational')
WHERE id = 'de9b6759-a4ed-42f9-b3da-81c2e8bbd4d1';

-- 29
UPDATE public.questions SET prompt_text = replace(prompt_text, 'specialize', 'specialise')
WHERE id = '1dc47d15-4bce-4a14-bf03-5560b056b8c5';

-- 30
UPDATE public.questions SET explanation = replace(explanation, 'apologizing', 'apologising')
WHERE id = 'fab3c0eb-255a-49ad-8f74-1fbb817b5f48';

-- 31 (this round's own word_bank content, generated earlier this session)
UPDATE public.questions SET explanation = replace(explanation, 'organization', 'organisation')
WHERE id = '113966e5-1f2f-4b8c-8333-d0962295dd41';

-- 32
UPDATE public.questions SET prompt_text = replace(prompt_text, 'favor', 'favour')
WHERE id = '273318cf-98c3-4d08-91af-a3a2ea5fcef1';
