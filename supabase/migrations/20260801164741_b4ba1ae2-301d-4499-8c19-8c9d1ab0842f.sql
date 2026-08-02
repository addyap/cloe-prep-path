-- Listening passage layer (punch-list Tier 1a from the 2026-08-01 quality
-- audit): every listening item today is a single decontextualized
-- sentence, unlike reading and word_bank which both use extended
-- multi-question passages. This closes that gap by reusing the exact
-- same passages/questions.passage_id architecture reading already uses —
-- a listening passage is a longer dialogue/monologue script (passages.body)
-- with 2-4 linked mcq questions (questions.passage_id), same shape as a
-- reading passage. The only schema addition needed is audio_url on
-- passages, mirroring questions.audio_url (nullable — falls back to
-- browser TTS reading passages.body aloud when unset, same fallback
-- pattern already used for standalone listening questions).

ALTER TABLE public.passages ADD COLUMN audio_url text;
