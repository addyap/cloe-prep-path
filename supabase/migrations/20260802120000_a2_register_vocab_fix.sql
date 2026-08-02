-- A2 formal_register vocabulary fix. Following the A1 audit, checked A2's
-- formal_register items for the same issue. Basic convention recognition
-- (Dear vs Hi, Best regards vs Bye) is legitimately A2, but four items
-- leaned on genuine slang vocabulary in their options ("gon review",
-- "bumped up", "OMG...lol", "swamped with work", "hit me up") -- a
-- comprehension load above A2's basic/everyday vocabulary, even though
-- the underlying formal-vs-casual skill being tested is in scope at this
-- level. Simplified each to plain, common vocabulary while preserving
-- the register distinction being tested.

UPDATE public.questions SET
  options = to_jsonb(ARRAY[
    'We are going to review the figures next week.',
    'We''re gonna check the numbers next week.',
    'Let''s look at the figures, ok?',
    'Checking figures next week!'
  ]::text[]),
  correct_answer = 'We are going to review the figures next week.'
WHERE id = '773ac1be-b6d8-4c58-b504-d453b0061e00';

UPDATE public.questions SET
  options = to_jsonb(ARRAY[
    'Congratulations on your promotion; your hard work has been well deserved.',
    'Nice one, well done!',
    'Congrats, you really earned this!',
    'Heard you got a new job, nice.'
  ]::text[]),
  correct_answer = 'Congratulations on your promotion; your hard work has been well deserved.'
WHERE id = '3eff3c84-4d17-46de-99ab-627a21e87043';

UPDATE public.questions SET
  options = to_jsonb(ARRAY[
    'I regret to inform you that I am unable to accept your invitation.',
    'Sorry, I''m busy today, maybe next time!',
    'Please be advised that I decline your lunch invitation.',
    'I must respectfully decline due to prior commitments.'
  ]::text[]),
  correct_answer = 'Sorry, I''m busy today, maybe next time!'
WHERE id = '6403b618-431b-4d04-a338-bad88f6031d6';

UPDATE public.questions SET
  options = to_jsonb(ARRAY[
    'Hello, this is Claire Dubois from Acme Ltd. I am calling about our order. Please call me back.',
    'Hi, it''s Claire, please call me back.',
    'Claire here, about the order, call me.',
    'Hi, it''s Claire from Acme, please call back.'
  ]::text[]),
  correct_answer = 'Hello, this is Claire Dubois from Acme Ltd. I am calling about our order. Please call me back.',
  explanation = 'This message gives a clear name, company, and reason for calling, and closes politely, which fits a first call to a supplier you don''t know. The other options skip the full introduction or company name, which is too casual for someone who has never spoken to you before.'
WHERE id = '1718c4b3-d6d1-4904-ab2b-c6c4e14134b5';
