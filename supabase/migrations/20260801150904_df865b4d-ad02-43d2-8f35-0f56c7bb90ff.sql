-- Second follow-up pass: 10 rows missed by the first two spelling
-- migrations — mostly a recurring "emphasizes the duration" template
-- phrase across tense-explanation rows, plus finalize/prioritize/summarize
-- (the -ize/-ise family is large; each prior pass caught a subset).

-- 1
UPDATE public.questions SET explanation = replace(explanation, 'traveling', 'travelling')
WHERE id = 'ca7c3a8e-2f09-40c2-b74f-d0508d6444fb';

-- 2, 4, 8 (same "emphasizes the duration" template, 3 rows)
UPDATE public.questions SET explanation = replace(explanation, 'emphasizes', 'emphasises')
WHERE id IN ('0fe2842b-f18d-4c1f-ac47-7c804763fab0', 'e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be', 'c45c0799-1b56-4bdc-a690-2c02fa72b0ae');

-- 3
UPDATE public.questions SET prompt_text = replace(prompt_text, 'Summarize', 'Summarise')
WHERE id = '8070a143-cd6d-48ea-8412-72b4a7f0f407';

-- 5, 10 (prioritize/prioritizing, 2 rows)
UPDATE public.questions SET prompt_text = replace(prompt_text, 'prioritize', 'prioritise')
WHERE id = '815b385c-7f99-461f-8bb8-12412f5c3acd';
UPDATE public.questions SET explanation = replace(explanation, 'prioritizing', 'prioritising')
WHERE id = '79dafaae-09d2-4ba1-9348-c4115002c330';

-- 6 (explanation AND the matching options array distractor)
UPDATE public.questions SET
  explanation = replace(explanation, 'finalizing', 'finalising'),
  options = replace(options::text, 'Finalizing', 'Finalising')::jsonb
WHERE id = '45b96713-3aaf-44d1-a0cb-e3d46f45bcbb';

-- 7
UPDATE public.questions SET prompt_text = replace(prompt_text, 'finalized', 'finalised')
WHERE id = '9327d481-fca4-4125-ae63-ff87e4e646bb';

-- 9 (distractor in options array — correct_answer is "sign", unaffected)
UPDATE public.questions SET options = replace(options::text, 'finalize', 'finalise')::jsonb
WHERE id = '0f924792-4c64-41c4-b41e-43a5057aa689';
