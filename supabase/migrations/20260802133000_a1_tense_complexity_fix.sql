-- A1 grammar_vocab tense-complexity fix. Follow-up to the A1 audit:
-- two items tested present continuous for a temporary exception against
-- a habitual present-simple routine, joined by contrast/cause clauses
-- ("We usually use email, but this week we ___ the phones because the
-- server is down"; "The photocopier is broken, so Anna ___ the documents
-- by hand today"). The grammar point itself is reasonable, but the
-- two-clause contrast/cause sentence structure is above A1's "very
-- short, simple sentences" descriptor. Simplified to the same single-
-- clause "Look!... right now" pattern already used correctly elsewhere
-- in the A1 tenses set, keeping the present continuous grammar point.

UPDATE public.questions SET
  prompt_text = 'Look! Sara _____ a phone call right now.',
  options = to_jsonb(ARRAY['is making','makes','made','will make']::text[]),
  correct_answer = 'is making',
  explanation = 'Present continuous with "right now" describes an action happening at this moment.'
WHERE id = '78eac7e8-2f4c-4837-bd6e-9c3d02096c4f';

UPDATE public.questions SET
  prompt_text = 'Look! Anna _____ the documents right now.',
  options = to_jsonb(ARRAY['is copying','copies','copied','will copy']::text[]),
  correct_answer = 'is copying',
  explanation = 'Present continuous with "right now" describes an action happening at this moment.'
WHERE id = '198dceef-2f1b-44be-b3bd-9d5ca2be4d37';
