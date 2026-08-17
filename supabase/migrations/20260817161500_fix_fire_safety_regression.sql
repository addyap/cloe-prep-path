-- Repair two regressions introduced by 20260817104100_stage2_listening_audio_coupled.sql
--
-- ⚠️  REQUIRES ONE AUDIO REGENERATION (passage audio x1) — see bottom.
--
-- WHAT WENT WRONG. The stage-2 migration treated question 6d3a5ad1 as a
-- STANDALONE listening item. It is not: it is linked to passage d6b0e8b0
-- ('Fire Safety Reminder'), so the spoken script is the PASSAGE body and the
-- question's own prompt_text is the on-screen question stem. Editing the
-- question therefore fixed nothing audible and broke two things:
--
--   1. 6d3a5ad1 lost its question stem. prompt_text was overwritten with the
--      full announcement script, so the item displayed the whole passage where
--      its question ('What should you NOT use during a fire?') used to be.
--
--   2. 64368a14 became UNANSWERABLE. Its options were replaced with a set that
--      does not contain its correct_answer ('At the end of the hall on the
--      left'), so no learner could ever answer it correctly. This is the one
--      key-not-in-options defect in the entire 870-item bank.
--
--   3. The BrE fix never reached the audio. The passage body still said
--      'elevator' and 'parking lot' and kept its old matching audio, while the
--      question text around it had been switched to 'lift' / 'car park' —
--      the exact read/hear desync the staged approach existed to prevent.
--
-- THE REAL FIX: change the PASSAGE (the spoken source), restore both questions
-- to their original stems and option sets, and carry the BrE fix through the
-- options so passage, audio, stems and options all agree.

begin;

-- 1. The spoken source. elevator -> lift, parking lot -> car park.
--    audio_url nulled so the stale AmE recording is not served.
update public.passages
set body = 'Attention, everyone. This is a short reminder about fire safety. The fire exit is at the end of the hall on the left. Please do not use the lift during a fire. Walk to the car park and wait there. The safety meeting is every first Monday of the month.',
    audio_url = null
where id = 'd6b0e8b0-48ad-4fe5-873f-5b6839353c86';

-- 2. Restore the question stem; carry BrE through the options.
update public.questions
set prompt_text = 'What should you NOT use during a fire?',
    options = '["The stairs","The fire exit","The lift","The car park"]'::jsonb,
    correct_answer = 'The lift'
where id = '6d3a5ad1-f185-4420-a95b-2205d1d20a89';

-- 3. Restore the answerable option set (key put back), with BrE distractors.
update public.questions
set options = '["At the end of the hall on the right","At the end of the hall on the left","Next to the lift","In the car park"]'::jsonb,
    correct_answer = 'At the end of the hall on the left'
where id = '64368a14-67a2-4522-96fb-94a312907a19';

commit;

-- POST-APPLY:
--   production /admin/generate -> "Generate passage audio (next 30)" x1
--
-- VERIFY (both must return 0 rows):
--   select id from public.questions where type='mcq' and not (options ? correct_answer);
--   select id from public.passages where skill='listening' and audio_url is null;
