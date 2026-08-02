-- A1 difficulty fix. The 2026-08-01 audit flagged "a couple of A1 items
-- mildly over-demanding". Auditing all current A1 content found the real
-- offenders: three formal_register mcq items asked learners to judge
-- formal-vs-casual REGISTER ("I would be most grateful if you could
-- attend to my device at your earliest convenience" vs a casual text) --
-- a B2/C1 sociolinguistic discrimination skill, not something an A1
-- learner ("I know a few basic words") can reasonably be expected to
-- have. A fourth, a reconstruction item, used "confirm receipt of this
-- email" -- B1+ business vocabulary in an A1 slot. Replaced all four with
-- true A1-level content in the same context_tag/type, testing basic
-- politeness markers (please/could you vs a bare imperative) instead of
-- register nuance, and simple everyday vocabulary instead of business
-- jargon.

UPDATE public.questions SET
  prompt_text = 'You meet a new colleague. Which introduction is polite?',
  options = to_jsonb(ARRAY[
    'Hello, my name is Alex. Nice to meet you.',
    'What do you want?',
    'I don''t have time for this.',
    'Go away, please.'
  ]::text[]),
  correct_answer = 'Hello, my name is Alex. Nice to meet you.',
  explanation = '"Hello, nice to meet you" is the simple, polite way to introduce yourself to someone new. The other options are rude or unfriendly.'
WHERE id = '34e6d4e2-7967-406c-8e7b-862bb32e399f';

UPDATE public.questions SET
  prompt_text = 'You need help from a colleague. Which message is polite?',
  options = to_jsonb(ARRAY[
    'Could you help me, please?',
    'Help me now!',
    'You must help me.',
    'Do it now.'
  ]::text[]),
  correct_answer = 'Could you help me, please?',
  explanation = '"Could you... please?" is a simple, polite way to ask for help. The other options sound like orders, not requests.'
WHERE id = '020a64b5-ba14-437d-879c-41d5c7844768';

UPDATE public.questions SET
  prompt_text = 'Your computer is not working. Which message to IT is polite?',
  options = to_jsonb(ARRAY[
    'Can you help me, please? My computer is not working.',
    'Fix my computer now!',
    'Computer broken. Do something.',
    'Hurry up and fix it.'
  ]::text[]),
  correct_answer = 'Can you help me, please? My computer is not working.',
  explanation = 'Using "please" and explaining the problem clearly and calmly is the polite way to ask for help. The other options are rude or unclear.'
WHERE id = '89d0b600-ceb6-4da9-8fa5-bedb12e8af17';

UPDATE public.questions SET
  options = to_jsonb(ARRAY[
    'Please close',
    'the door',
    'when you leave.'
  ]::text[]),
  correct_answer = 'Please close the door when you leave.'
WHERE id = '477f0050-612f-47dc-bd58-c312096d3b64';
