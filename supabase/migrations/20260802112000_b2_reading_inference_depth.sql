-- B2 reading inference/gist/tone depth. Checking B2 for the same pattern
-- fixed at C1 in 20260802094500: it was just as bad, actually -- all 11
-- B2 reading passages were 100% pure fact-lookup (dates, percentages,
-- "what should X do", "who should contact"), zero inference/gist/tone
-- questions anywhere. Same fix as C1: replace the single weakest
-- (most trivial, single-fact) question in each passage with a genuine
-- inference/gist/tone question. In-place UPDATEs only, question count
-- per passage unchanged.

UPDATE public.questions SET
  prompt_text = 'What does the passage suggest about who the Enhanced Plan is designed for?',
  options = to_jsonb(ARRAY[
    'Employees with ongoing dental or vision needs',
    'Employees who want the cheapest option available',
    'Employees without any dependants',
    'Employees who already have the Family Plan'
  ]::text[]),
  correct_answer = 'Employees with ongoing dental or vision needs',
  explanation = 'The email says "the Enhanced Plan may suit employees with ongoing dental or vision needs better than the Standard Plan" -- directly signalling who it is aimed at, not the cheapest option, dependant-free staff, or Family Plan holders.'
WHERE id = '05dc1de6-0eec-48d2-9d15-d09d2563ca0e';

UPDATE public.questions SET
  prompt_text = 'What does offering a phased implementation suggest about the sender''s understanding of the client''s situation?',
  options = to_jsonb(ARRAY[
    'The sender recognises the client may have cash-flow concerns about the change',
    'The sender believes the client is trying to avoid payment entirely',
    'The sender wants to end the business relationship',
    'The sender is unwilling to negotiate on payment terms'
  ]::text[]),
  correct_answer = 'The sender recognises the client may have cash-flow concerns about the change',
  explanation = 'The letter says "we understand that cash flow may be a concern on your end, so we are open to discussing a phased implementation" -- the offer is a direct response to an anticipated client concern, not distrust, hostility, or rigidity.'
WHERE id = '9737c137-792f-4919-8c1b-dfeb344538ce';

UPDATE public.questions SET
  prompt_text = 'What is the main purpose of this notice?',
  options = to_jsonb(ARRAY[
    'To explain the cause of delivery delays and ask for customers'' patience',
    'To announce the permanent closure of the distribution centre',
    'To offer customers a refund for delayed orders',
    'To recruit additional couriers'
  ]::text[]),
  correct_answer = 'To explain the cause of delivery delays and ask for customers'' patience',
  explanation = 'The notice explains the cause ("high demand and ongoing disruption"), asks customers to avoid duplicate orders, and closes by "thank you for your patience" -- its core purpose is explaining the delay and requesting patience, not announcing closure, offering refunds, or recruiting.'
WHERE id = '877a1408-c475-443a-bde9-d7bae93ea49e';

UPDATE public.questions SET
  prompt_text = 'What can be inferred about why employees are encouraged to photograph receipts immediately rather than keep paper copies?',
  options = to_jsonb(ARRAY[
    'To reduce the risk of losing receipts before the ten-day submission deadline',
    'Paper receipts are no longer accepted at all',
    'It is required for insurance purposes unrelated to reimbursement',
    'The mobile app offers a discount on meals'
  ]::text[]),
  correct_answer = 'To reduce the risk of losing receipts before the ten-day submission deadline',
  explanation = 'The passage links late/missing receipts to rejected claims ("claims submitted later than this may be delayed or... rejected entirely") right before recommending photographing receipts immediately -- the advice is implicitly there to avoid losing paper copies before the ten-day deadline, not because paper is banned or for an unrelated reason.'
WHERE id = 'a1ad493c-34e8-4724-9ca8-e888659986e1';

UPDATE public.questions SET
  prompt_text = 'Why does the email reassure existing customers about "missing out on early points"?',
  options = to_jsonb(ARRAY[
    'To address a likely concern that signing up late means losing credit for recent purchases',
    'To warn customers that late registration cancels all future points',
    'To explain that points can only be earned after registering for a full year',
    'To announce that early points will be doubled'
  ]::text[]),
  correct_answer = 'To address a likely concern that signing up late means losing credit for recent purchases',
  explanation = 'The email states existing customers "will automatically receive credit for purchases made in the last three months once they register, so there is no need to worry about missing out" -- this sentence exists specifically to pre-empt a concern about lost credit, not to warn, restrict, or announce a bonus.'
WHERE id = 'f083b550-e336-4b7e-85fd-3d846a1ef221';

UPDATE public.questions SET
  prompt_text = 'What does the passage suggest about the company''s view of taking breaks during the day?',
  options = to_jsonb(ARRAY[
    'It values breaks for wellbeing but has chosen not to formalise them as part of the programme',
    'It considers breaks unimportant compared to yoga and gym subsidies',
    'It requires all employees to take scheduled breaks',
    'It plans to remove breaks entirely from company policy'
  ]::text[]),
  correct_answer = 'It values breaks for wellbeing but has chosen not to formalise them as part of the programme',
  explanation = 'The memo says managers are "encouraged to remind their teams that taking short breaks... is also part of maintaining wellbeing, though this is not a formal element of the programme" -- valued but deliberately informal, not unimportant, mandatory, or being removed.'
WHERE id = 'e4a41300-ff6a-4af2-9baf-c55ead4b4037';

UPDATE public.questions SET
  prompt_text = 'What does keeping the premium range unchanged suggest about the company''s strategy?',
  options = to_jsonb(ARRAY[
    'It wants to protect its relationship with long-term, higher-value clients despite rising costs',
    'It plans to discontinue the premium range soon',
    'It is reducing prices across all product lines',
    'It no longer sells premium products'
  ]::text[]),
  correct_answer = 'It wants to protect its relationship with long-term, higher-value clients despite rising costs',
  explanation = 'The letter frames the frozen premium pricing explicitly "as part of our commitment to long-term partners like yourselves" -- a relationship-preserving move, not discontinuation, a broader price cut, or an end to the product line.'
WHERE id = '91e445ac-1ed7-49b9-95b7-bba8170135db';

UPDATE public.questions SET
  prompt_text = 'What does the survey''s finding about headphone use suggest?',
  options = to_jsonb(ARRAY[
    'Coping strategies for office noise may differ between newer and longer-tenured employees',
    'Headphones are banned for employees who have worked there over ten years',
    'Younger employees are less bothered by noise than longer-serving staff',
    'All employees use headphones equally regardless of tenure'
  ]::text[]),
  correct_answer = 'Coping strategies for office noise may differ between newer and longer-tenured employees',
  explanation = 'The survey found "younger employees were more likely to use headphones to block out noise than employees who had worked at the company for over ten years" -- a difference in coping behaviour, not a ban, a claim about who is more bothered by noise (never stated), or uniform usage.'
WHERE id = '74434dce-0dfb-45ab-8229-8c3b220604ad';

UPDATE public.questions SET
  prompt_text = 'What is the likely purpose of phishing emails creating a sense of urgency, according to the passage?',
  options = to_jsonb(ARRAY[
    'To pressure the recipient into acting quickly without stopping to verify the email''s authenticity',
    'To give the recipient more time to check the sender''s identity',
    'To comply with IT department policy on email formatting',
    'To make the email easier to read'
  ]::text[]),
  correct_answer = 'To pressure the recipient into acting quickly without stopping to verify the email''s authenticity',
  explanation = 'The passage describes these emails as "typically creat[ing] a sense of urgency, asking you to click a link or transfer money immediately" -- urgency is a pressure tactic to provoke a fast, unverified reaction, the opposite of giving more time to check, and unrelated to IT formatting rules or readability.'
WHERE id = '3229bd34-9cf8-4985-8517-f0df2300d38d';

UPDATE public.questions SET
  prompt_text = 'What does allowing a substitute delegate at no extra charge after the refund deadline suggest about the organiser''s approach to late cancellations?',
  options = to_jsonb(ARRAY[
    'It offers a flexible alternative to a refund, letting the registration still be used rather than wasted',
    'It penalises the original delegate further by charging a new fee',
    'It cancels the whole booking automatically',
    'It only applies to delegates who attended the previous year'
  ]::text[]),
  correct_answer = 'It offers a flexible alternative to a refund, letting the registration still be used rather than wasted',
  explanation = 'The email states that after 1 September "no refunds can be given, although substitute delegates are welcome at no extra charge" -- a deliberate flexible option offered in place of a refund, not an added penalty, an automatic cancellation, or something restricted to past attendees.'
WHERE id = '5aa9bec6-4c6c-49e1-a4e1-0e17d38e63af';

UPDATE public.questions SET
  prompt_text = 'What does the passage suggest about the company''s overall approach to this trial?',
  options = to_jsonb(ARRAY[
    'Cautious and data-driven -- expanding only if performance holds, and monitoring closely before committing further',
    'Fully committed regardless of the trial''s outcome',
    'Reluctant and likely to cancel the trial immediately',
    'Indifferent to whether the trial succeeds or fails'
  ]::text[]),
  correct_answer = 'Cautious and data-driven -- expanding only if performance holds, and monitoring closely before committing further',
  explanation = 'Extension is conditional ("provided that productivity levels remain stable"), the trial can be "paused and reviewed" if output falls, and monthly surveys will "directly shape whether this becomes a permanent policy" -- together these show a cautious, evidence-based rollout, not blind commitment, reluctance, or indifference.'
WHERE id = 'c7f47cc4-3a9c-408b-bdaa-19bb7cfe2ac2';
