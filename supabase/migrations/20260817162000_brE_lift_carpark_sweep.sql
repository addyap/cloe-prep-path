-- BrE sweep: remaining 'elevator' / 'parking lot' in listening content
--
-- Found by a corpus-wide sweep after repairing the fire-safety regression.
-- These five items were never in the audited scope but carry the same AmE
-- defect the site standard rules out. Site standard is British English.
--
-- ⚠️  PART OF THIS IS AUDIO-COUPLED — see the regeneration note at the bottom.
--
-- Coupling was determined per item, not assumed:
--   * For a STANDALONE listening question, extractSpokenScript (src/lib/utils.ts)
--     voices the FIRST QUOTED SPAN of prompt_text. Text outside the quotes, and
--     the options, are read on screen and never spoken.
--   * For a PASSAGE-LINKED question, the passage body is the spoken script and
--     the question's own prompt_text is just the on-screen stem.
--   So: options are always audio-safe; a passage-linked stem is audio-safe; only
--   a passage body or a quoted span inside a standalone prompt is coupled.

begin;

-- ---------- AUDIO-SAFE (no regeneration needed) ----------

-- 75fac455  standalone, but 'elevator' sits in an OPTION, not in the quoted
-- span ("The new printer is on the second floor, next to the kitchen."), so the
-- recording is unaffected.
update public.questions
set options = '["First floor near the kitchen","Second floor next to the kitchen","Third floor near the lift","Second floor near reception"]'::jsonb
where id = '75fac455-0f19-4b5e-ad9e-ca63dc04547e';

-- 5e245051  passage-linked: prompt_text is the on-screen stem, never spoken.
update public.questions
set prompt_text = 'Why is the car park closing?'
where id = '5e245051-9a4b-4e13-9b19-06c6fe2be4d6';

-- ae4f3fdf  passage-linked: options only.
update public.questions
set options = '["On the west side of the building","On the street","In the visitor car park on Oak Street","At the train station"]'::jsonb,
    correct_answer = 'In the visitor car park on Oak Street'
where id = 'ae4f3fdf-2774-48af-b169-4efc1d5a4147';

-- ---------- AUDIO-COUPLED (regeneration required) ----------

-- 25a78734  'elevator' is inside the quoted span, so it IS spoken. Key moves
-- with it: correct_answer must stay byte-identical to an option.
update public.questions
set prompt_text = 'You hear: "The lift is out of order today. Please use the stairs." What is out of order today?',
    options = '["The lift","The stairs","The front door","The printer"]'::jsonb,
    correct_answer = 'The lift',
    audio_url = null
where id = '25a78734-e2c6-4b08-af45-e7668f3df1cb';

-- a7189123  passage body is the spoken script. Title updated for consistency.
update public.passages
set title = 'Car Park Closure',
    body = 'Attention all staff. The main car park on the east side of the building will be closed next week from Monday to Wednesday for repairs. During that time, please use the visitor car park on Oak Street. It is a five-minute walk from the main entrance. Remember to display your employee badge on your dashboard so your car is not towed. Thank you for your patience.',
    audio_url = null
where id = 'a7189123-43e4-4eec-ab3f-af403c3f7f4b';

commit;

-- POST-APPLY REGENERATION (covers this file AND the pending fire-safety fix):
--   production /admin/generate -> "Generate passage audio (next 30)" x1
--                                   (d6b0e8b0 Fire Safety, a7189123 Car Park)
--                              -> "Generate audio (next 30)"         x1
--                                   (25a78734 lift out of order)
--
-- VERIFY (all three must return 0 rows):
--   select id from public.questions where type='mcq' and not (options ? correct_answer);
--   select id from public.passages where skill='listening' and audio_url is null;
--   select id from public.questions where skill='listening' and passage_id is null and audio_url is null;
