-- CLOE pedagogy audit — new reading items: inference, text-organisation, vocabulary-in-context
--
-- GAP BEING CLOSED. An audit classified the cognitive skill of all 252 reading
-- items and found the bank tested almost nothing but literal detail retrieval:
--   B1 was 42/42 literal (100%) — identical to A1 and A2, so B1 offered a
--   learner NO cognitive step up, only harder vocabulary.
--   text-organisation:     0 of 252 items, at every level
--   vocabulary-in-context: 1 of 252 items
-- Both absent families are standard components of a business-English reading exam.
--
-- ADDS 47 items:  gist 4, inference 13, purpose 5, text-organisation 12, tone 1, vocabulary-in-context 12
-- levels: B1 23, B2 8, C1 8, C2 8
--
-- Every item was authored against an explicit entailment test: the passage must
-- make the key TRUE and every distractor FALSE OR UNSUPPORTED. The characteristic
-- failure of an inference item is a key that is merely plausible rather than
-- entailed — worse than the literal item it replaces, because it teaches guessing.
-- Machine-verified before insert: key byte-identical to one of exactly 4 distinct
-- options; the quoted entailment span occurs literally in the passage; the key does
-- NOT occur verbatim in the passage (which would make it a literal item in disguise);
-- key never leads the next-longest option by >5 chars (the bank's documented length
-- exploit); BrE; level and context_tag inherited from the passage.
--
-- Reading passages carry no audio, so this is audio-safe. Existing items are
-- untouched; ordinals 4-5 place the new items after the original three.

begin;

-- B1 inference  passage 05359b0a ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What does the notice suggest about an employee who was ill and could not take leave?',
  '["They may keep more than five days.", "They will be paid for the extra days.", "They lose every day above five.", "They need no request on the portal."]'::jsonb,
  'They may keep more than five days.',
  'The rule that extra days are lost is followed by ''unless ... illness'', so illness switches the rule off and the days can survive. ''They lose every day above five'' is tempting because that is the normal rule, but it ignores the exception that the same sentence adds.',
  '05359b0a-4598-45ef-b1a0-a6a209f4df60', 4);

-- B1 purpose  passage 05359b0a ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'Why does the notice mention cash in the last sentence?',
  '["To support the advice to book leave", "To explain how overtime is paid", "To describe a new payment option", "To warn staff about pay mistakes"]'::jsonb,
  'To support the advice to book leave',
  'The word ''since'' links the cash point back to the recommendation before it, so the sentence works as a reason for acting now. Readers who see the word ''paid'' may pick a payment topic, but the notice is not describing any payment; it is ruling one out to make its advice stronger.',
  '05359b0a-4598-45ef-b1a0-a6a209f4df60', 5);

-- B1 inference  passage 0995b603 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What does the text suggest about the dress code before the change?',
  '["Smart casual was for Fridays only.", "Business formal was never needed.", "Line managers chose each outfit.", "Jeans were banned completely."]'::jsonb,
  'Smart casual was for Fridays only.',
  'The phrase ''not just Fridays'' only makes sense if Friday was previously the single day for smart casual, so the old rule can be worked out from the new one. ''Jeans were banned completely'' is tempting because jeans now come with a condition, but the text never says what the old jeans rule was.',
  '0995b603-8226-418c-9a40-cf85b9e5f6ea', 4);

-- B1 purpose  passage 0995b603 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'Why does the text mention the warehouse areas?',
  '["To explain why shorts are banned", "To limit the rules to one area", "To warn about a new safety check", "To name where clients are met"]'::jsonb,
  'To explain why shorts are banned',
  'The word ''This'' points back to the sentence before it, so the warehouse remark works as the reason behind that ban. The idea that the ban applies only in the warehouse is the trap: ''never allowed'' leaves no room for a place-by-place rule.',
  '0995b603-8226-418c-9a40-cf85b9e5f6ea', 5);

-- B1 gist  passage 21867e3c ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What is this text mainly about?',
  '["Changes to leave rules for new parents", "Rules on working hours for all staff", "How HR arranges cover for absences", "Advice on choosing childcare options"]'::jsonb,
  'Changes to leave rules for new parents',
  'Every paragraph covers a different part of the same subject: how much leave new mothers, fathers and adopting parents get, and what they must do around it. ''Rules on working hours for all staff'' is tempting because flexible hours appear at the end, but that is one small point offered only to people coming back from this leave.',
  '21867e3c-81d2-474a-8233-530ec64ed97f', 4);

-- B1 inference  passage 21867e3c ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'A father''s child was born seven months ago. What does the policy suggest?',
  '["He can no longer take paid paternity leave", "He can take four weeks of leave at any time", "He may request flexible hours instead", "He can take the same leave as a mother"]'::jsonb,
  'He can no longer take paid paternity leave',
  'The rule sets a window of six months from the birth, so a reader must compare that window with the seven months in the question to see that it has closed. ''He can take four weeks of leave at any time'' repeats the correct number of weeks but ignores the time limit attached to it.',
  '21867e3c-81d2-474a-8233-530ec64ed97f', 5);

-- B1 inference  passage 36544c76 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'What does the email suggest about where the finance team works now?',
  '["They are on the ground floor now", "They are on the second floor now", "They have no desks at the moment", "They share a floor with IT staff"]'::jsonb,
  'They are on the ground floor now',
  'The move is explained as a way of making space on the ground floor, and a team can only free up space it is already using, so finance must be there today. ''On the second floor'' fails because that is where they are going, not where they are.',
  '36544c76-e190-473d-830b-a90eba061c7b', 4);

-- B1 purpose  passage 36544c76 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'Why does the writer mention what IT will do the night before?',
  '["To reassure staff about lost work", "To ask staff to help IT that night", "To explain why boxes are needed", "To warn staff of a long delay"]'::jsonb,
  'To reassure staff about lost work',
  'The sentence links IT''s early set-up to its result with ''so'', and that result is that nothing is lost, which is comfort rather than instruction. ''Ask staff to help'' fails because the sentence gives staff nothing to do; the tasks for staff come in the next sentence.',
  '36544c76-e190-473d-830b-a90eba061c7b', 5);

-- B1 inference  passage 3a1e351d ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'An employee follows the policy and does not ask for approval. How many of their office days do they choose themselves?',
  '["At least one day each week", "Exactly two days each week", "All of their office days each week", "No days at all each week"]'::jsonb,
  'At least one day each week',
  'Tuesday and Thursday are fixed for the whole team, so those two are never the employee''s choice. Because staff must be in the office at least three days, there is always at least one day left over for them to pick, which is why the text calls it ''the other office day''. ''Exactly two days each week'' is tempting because the text names two days, but those are the fixed ones, not the free ones. ''All of their office days each week'' forgets the two core days, and ''No days at all each week'' is ruled out by the words ''can be chosen freely''.',
  '3a1e351d-f602-4195-be14-d12ba4f1af81', 4);

-- B1 gist  passage 3a1e351d ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What is this text mainly about?',
  '["New rules for office days and desks", "Advice on working from home well", "Reasons for moving to a new office", "A summary of a staff survey"]'::jsonb,
  'New rules for office days and desks',
  'Look at what every part of the text does: it sets required days, fixed days, approval and desk booking. That makes it a set of rules, not guidance. The home-working option fails because working from home is only the gap left by the rules, and no advice about it is given.',
  '3a1e351d-f602-4195-be14-d12ba4f1af81', 5);

-- B1 inference  passage 3b85868d ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'What does the email suggest about lunch at these meetings?',
  '["Lunch is normally provided at meetings", "Lunch has never been provided before", "Coffee has replaced lunch permanently", "The team usually meets over lunch"]'::jsonb,
  'Lunch is normally provided at meetings',
  'The writer says lunch will not be there ''this week'' and gives a reason for the change, which only makes sense if lunch is the normal arrangement. ''Coffee has replaced lunch permanently'' is tempting because coffee is mentioned, but the email limits the change to this week and says nothing about a permanent replacement.',
  '3b85868d-8ff8-4064-b4af-6deeb2db593b', 4);

-- B1 purpose  passage 3b85868d ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'Why does the writer mention Priya?',
  '["To give staff unable to attend an option", "To name the person leading the meeting", "To explain who booked Meeting Room B", "To say who will collect the reports"]'::jsonb,
  'To give staff unable to attend an option',
  'Priya appears inside a sentence beginning ''If Thursday does not work for you'', so her name answers the question ''what do I do if I cannot come?''. ''To name the person leading the meeting'' is tempting because a named person in a meeting email often runs it, but the email gives Priya no role at the meeting at all.',
  '3b85868d-8ff8-4064-b4af-6deeb2db593b', 5);

-- B1 gist  passage 3b8bdfe3 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What is this text mainly about?',
  '["How to move to another department", "How to prepare for a job interview", "How the panel picks new managers", "How to write a CV for a new job"]'::jsonb,
  'How to move to another department',
  'Every sentence describes one stage of the same process, from the first talk with a manager to the wait before applying again, so the process itself is the topic. The CV option comes from a single phrase inside step two, which is a detail rather than the subject.',
  '3b8bdfe3-456e-47d1-94b9-7e7e99f73070', 4);

-- B1 inference  passage 3b8bdfe3 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'Two applications are successful: one for a general role and one for a specialist role. What does the text suggest?',
  '["The specialist may wait longer.", "Both must wait exactly six weeks.", "Neither can start within six weeks.", "The specialist starts sooner."]'::jsonb,
  'The specialist may wait longer.',
  'The six-week figure is given as what ''usually'' happens, and the clause after it names specialist posts as the case that can take more time, so the two applicants need not start together. ''Both must wait exactly six weeks'' reads the number as a fixed rule, which the words ''usually'' and ''can be longer'' both contradict.',
  '3b8bdfe3-456e-47d1-94b9-7e7e99f73070', 5);

-- B1 inference  passage 45452622 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'What can we understand about the two companies so far?',
  '["No goods have been ordered so far", "The first delivery has already arrived", "The supply agreement is still not settled", "Payment has already been sent to him"]'::jsonb,
  'No goods have been ordered so far',
  'The writer speaks of conditions that must be met ''before'' a ''first order'', which places the whole relationship at a stage earlier than any order. ''The supply agreement is still not settled'' is tempting because documents are outstanding, but the writer thanks the supplier for agreeing to supply, so the agreement itself is done.',
  '45452622-86a6-49d0-b7af-83eb39e92d94', 4);

-- B1 inference  passage 4efe94d2 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'How many feedback forms will Daniela complete at the very least?',
  '["At least six forms in total", "About twelve forms in total", "One form at the end only", "No forms unless asked"]'::jsonb,
  'At least six forms in total',
  'The email never gives a number of forms, so the reader must join two facts: meetings happen at least monthly for six months, and a form follows each meeting. ''About twelve forms in total'' would only be right if they met twice a month, which the email does not say.',
  '4efe94d2-f54b-49bb-978d-b7b4cf30309e', 4);

-- B1 inference  passage 6b9e08f9 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'What happens to a member of staff who uses the volunteering day?',
  '["Their holiday days stay the same.", "They lose one holiday day.", "They must work an extra day.", "They are unpaid for that day."]'::jsonb,
  'Their holiday days stay the same.',
  'The day is described as coming ''in addition to'' the normal holiday allowance, which means it is counted separately and nothing is taken away from it. ''They lose one holiday day'' is the natural guess about any day off, but ''in addition to'' rules exactly that out.',
  '6b9e08f9-e9e9-4fb1-8294-176f1bb18076', 4);

-- B1 gist  passage 6b9e08f9 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'What is this email mainly about?',
  '["A new paid day for charity work", "A change to the holiday allowance", "A guide to choosing local charities", "A new rule on travel expenses"]'::jsonb,
  'A new paid day for charity work',
  'The opening sentence announces the scheme and every later sentence explains how to use it, so the whole text serves that one topic. Travel costs are tempting because they get a full sentence, but that sentence is a detail inside the scheme, not the subject of the email.',
  '6b9e08f9-e9e9-4fb1-8294-176f1bb18076', 5);

-- B1 inference  passage 6bf4fa66 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What can the reader work out about when the training sessions take place?',
  '["Training ends before paper forms stop being accepted", "Training starts after paper forms stop being accepted", "Training lasts as long as both systems run together", "Training ends before the app becomes available"]'::jsonb,
  'Training ends before paper forms stop being accepted',
  'Put two dates side by side: training fills the first two weeks of next month, but paper forms stay valid for the full four-week transition, so training is over while paper is still allowed. The ''lasts as long as both systems run'' option is tempting, but two weeks of training cannot cover a four-week transition.',
  '6bf4fa66-42aa-464b-8dfa-e156898d1c5b', 4);

-- B1 purpose  passage 6bf4fa66 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'Why does the writer mention the five working days?',
  '["To show staff a benefit of the change", "To warn staff about a possible delay", "To explain how to submit a claim", "To give the date of the first payment"]'::jsonb,
  'To show staff a benefit of the change',
  'The figure is given together with ''instead of the current two weeks'', so the writer is comparing old and new and pointing out an improvement, not simply stating a rule. ''Warn about a delay'' fails because the comparison goes the other way: the new time is shorter, not longer.',
  '6bf4fa66-42aa-464b-8dfa-e156898d1c5b', 5);

-- B1 tone  passage e4a5f301 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'How does the company sound in this notice?',
  '["Serious but calm and helpful", "Sorry but not very clear", "Worried and quite frightening", "Friendly but not at all urgent"]'::jsonb,
  'Serious but calm and helpful',
  'Weigh the parts of the notice against each other. ''Please stop using it immediately'' shows the company takes the danger seriously, while the refund, the free replacement part and the apology keep it polite and practical. ''Worried and quite frightening'' picks up only the urgent instruction and misses how calmly the rest is written. ''Friendly but not at all urgent'' takes the apology and the thanks as the whole tone and ignores that word ''immediately''. ''Sorry but not very clear'' is tempting because the company does apologise, but every step the customer has to take is spelled out.',
  'e4a5f301-80be-4d5c-b197-f98457df0505', 4);

-- B1 inference  passage e8f1211a ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'email',
  'An employee asks for a desk that costs 200 euros. What does the email suggest?',
  '["Part of the cost is not covered.", "The whole desk will be paid for.", "The desk becomes their property.", "The request will be refused."]'::jsonb,
  'Part of the cost is not covered.',
  '''Up to 150 euros'' is a limit, so a price above it cannot be met in full, whatever else happens to the request. ''The request will be refused'' feels logical, but the email never says that expensive items are turned down; it only sets a ceiling on what is paid.',
  'e8f1211a-f03d-4d51-81d5-4e16c7b9cb90', 4);

-- B1 inference  passage ea30889c ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B1', 'general',
  'What does the survey suggest about larger departments?',
  '["Their staff are less happy with updates", "Their staff get more frequent updates", "Their staff have the largest workloads", "Their staff were not in the survey"]'::jsonb,
  'Their staff are less happy with updates',
  'The text compares two groups and says the smaller ones scored higher on communication; if one side of a comparison is higher, the other side must be lower. ''More frequent updates'' is tempting because the text mentions frequent updates, but that is offered as a possible cure, not as something large departments already have.',
  'ea30889c-93c6-4b27-8366-0bb0e9d1950a', 4);

-- B2 text-organisation  passage 27d1da86 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'general',
  'What does the sentence beginning "However, several people have raised a specific complaint" do at that point in the text?',
  '["It qualifies the positive results just reported", "It repeats the positive results in other words", "It explains why the old spreadsheet failed", "It summarises the whole report''s findings"]'::jsonb,
  'It qualifies the positive results just reported',
  'The linking word "However" marks a turn: the writer has just listed benefits (easier app, fewer double-bookings) and now sets a drawback against them. Naming this move — a qualification of the preceding claim — is what the question tests, not the content of the complaint.',
  '27d1da86-70a5-4160-904a-b723d9e0503c', 4);

-- B2 vocabulary-in-context  passage 27d1da86 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'general',
  'In "rooms are sometimes held for meetings that were cancelled informally and never released", what does "released" mean?',
  '["made available for others to book", "issued publicly as an announcement", "let go of after being gripped", "freed from a legal obligation"]'::jsonb,
  'made available for others to book',
  '"Released" has several everyday senses; here the object is a booked room, and the following sentence explains an "automatic release feature" for unused rooms, so the sense operating is that of returning the room to the pool of bookable rooms.',
  '27d1da86-70a5-4160-904a-b723d9e0503c', 5);

-- B2 text-organisation  passage 50d55d09 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'general',
  'What does "though" do in "should not exceed 150 euros per night in most cities, though exceptions apply in higher-cost locations"?',
  '["It limits the rule just stated", "It gives a reason for the rule", "It repeats the rule more simply", "It withdraws the rule entirely"]'::jsonb,
  'It limits the rule just stated',
  '"Though" introduces a concession: the main rule stands, but its scope is narrowed for named cases. Spotting that the second half restricts rather than replaces the first is the structural point.',
  '50d55d09-7c95-4f73-a9c3-c7ff21ff8c30', 4);

-- B2 vocabulary-in-context  passage 50d55d09 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'general',
  'In "claims submitted later than this may be delayed or, in some cases, rejected entirely", what does "claims" mean?',
  '["requests for repayment of costs", "statements asserted to be true", "legal rights to a property", "demands on a person''s time"]'::jsonb,
  'requests for repayment of costs',
  '''Claims'' most often means assertions put forward as true, but here the noun is the subject of ''submitted'', ''delayed'' and ''rejected'' inside a rule about receipts and reimbursement, which selects the sense of a formal request for money back. The legal-title and demands-on-time senses are real but have no referent in an expenses policy.',
  '50d55d09-7c95-4f73-a9c3-c7ff21ff8c30', 5);

-- B2 text-organisation  passage c416ad6d ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'email',
  'What does the reminder about what IT will never do by email, placed immediately after the description of how the fake emails work, do in the argument?',
  '["It recalls a rule that exposes fakes", "It announces a new IT security policy", "It apologises for an earlier warning", "It reports how many staff replied"]'::jsonb,
  'It recalls a rule that exposes fakes',
  'The reminder is introduced as something the reader already knows, and it is placed immediately after the description of emails that trick staff into handing over login details, so structurally it supplies the test by which such emails can be recognised. It does not announce anything new, apologise, or report a result.',
  'c416ad6d-7d34-4692-8c82-5b7646fc5708', 4);

-- B2 vocabulary-in-context  passage c416ad6d ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'email',
  'In "hover over it to check the actual web address", what does "hover" mean?',
  '["rest the pointer on the link", "float above it in the air", "wait nearby without deciding", "lean over someone''s shoulder"]'::jsonb,
  'rest the pointer on the link',
  '"Hover" normally describes staying in the air or lingering; here the object is a link and the purpose is to reveal the address behind it, which fixes the computing sense of holding the mouse pointer over something without clicking.',
  'c416ad6d-7d34-4692-8c82-5b7646fc5708', 5);

-- B2 text-organisation  passage cd88fbd7 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'email',
  'What is the function of the clause "but it will only be issued to delegates who attend both days in full"?',
  '["It attaches a condition to the offer just made", "It repeats the offer in more formal wording", "It explains why the certificate is free", "It gives an example of the offer just made"]'::jsonb,
  'It attaches a condition to the offer just made',
  'The writer first grants something (a certificate may be requested), then uses "but" to restrict it. Recognising this concession-then-restriction pattern is a structural move: the clause narrows the entitlement rather than adding new information about it.',
  'cd88fbd7-5099-43ce-96fd-22bf281dbb56', 4);

-- B2 vocabulary-in-context  passage cd88fbd7 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'B2', 'email',
  'In "available for collection from the registration desk", what does "collection" mean?',
  '["being picked up in person", "a set of gathered objects", "money raised for charity", "a season''s clothing range"]'::jsonb,
  'being picked up in person',
  '"Collection" can name a group of things, a charitable gathering of money or a fashion range; here it follows "available for" and is tied to a place and a time, which selects the action sense — delegates go and fetch their badge.',
  'cd88fbd7-5099-43ce-96fd-22bf281dbb56', 5);

-- C1 text-organisation  passage 00b32699 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'email',
  'In the sentence beginning "We recognise that meaningful change takes sustained effort...", what does the clause introduced by "which is why" do?',
  '["It offers the survey as the upshot of that point", "It gives an example of the bias training in practice", "It contrasts the survey with the annual review", "It restates the opening announcement in other words"]'::jsonb,
  'It offers the survey as the upshot of that point',
  '"Which is why" signals consequence: the admission that change needs sustained effort is the premise, and annual measurement is presented as what follows from it. Naming the connector''s job, rather than the content it links, is what identifies the move.',
  '00b32699-cf6f-43f0-accf-c59297d51fc9', 4);

-- C1 vocabulary-in-context  passage 00b32699 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'email',
  'In "a mentorship strand specifically for employees from underrepresented backgrounds", what does "strand" mean here?',
  '["a distinct part of a wider scheme", "a thin thread twisted into rope", "a stretch of shore beside the sea", "a loose lock of someone''s hair"]'::jsonb,
  'a distinct part of a wider scheme',
  '"Strand" is polysemous; here it is followed by "separate from our existing general mentorship programme", which frames it as one component of a larger programme rather than anything physical.',
  '00b32699-cf6f-43f0-accf-c59297d51fc9', 5);

-- C1 text-organisation  passage 5d7e7cbb ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'What does "Conversely" signal about the finance division sentence that follows it?',
  '["the opposite licensing problem", "a consequence of the last point", "an example of the last point", "a solution to the last point"]'::jsonb,
  'the opposite licensing problem',
  '"Conversely" marks an inversion: the previous case had more users than licences, this one has more licences than users. Reading the connective correctly means seeing that the two departments illustrate mirror-image faults, not the same fault twice.',
  '5d7e7cbb-2639-461c-a5b2-2c4fde622b1f', 4);

-- C1 vocabulary-in-context  passage 5d7e7cbb ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'In "running 34 active seats of a specialist editing suite", what does "seats" mean?',
  '["user places in the software", "chairs in a meeting room", "places won in parliament", "a firm''s main office site"]'::jsonb,
  'user places in the software',
  '"Seats" here is the licensing sense: each seat is one person''s place in the software, which is why 34 active seats against 22 purchased licences creates a compliance gap.',
  '5d7e7cbb-2639-461c-a5b2-2c4fde622b1f', 5);

-- C1 text-organisation  passage 63fa7033 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'What is the function of the sentence beginning "Instead, HR will prepare a holding message..."?',
  '["It sets out the course chosen in place of the rejected one", "It gives the reason Legal advised against a broad alert", "It restates the vendor''s initial report in simpler terms", "It concedes that the rejected option was the better one"]'::jsonb,
  'It sets out the course chosen in place of the rejected one',
  '"Instead" signals substitution: the previous sentence rules an option out, and this sentence supplies the replacement. The clue is the connector plus the position of the sentence, not the detail of the message itself.',
  '63fa7033-3efc-4e74-b2b3-1f533233ed29', 4);

-- C1 vocabulary-in-context  passage 63fa7033 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'In "a holding message for all staff", the word "holding" describes a message that is:',
  '["issued as a temporary stopgap", "owned as a stake in a business", "rented as a plot of farmland", "gripped firmly and kept in place"]'::jsonb,
  'issued as a temporary stopgap',
  'Context selects the sense: the message deliberately omits specifics and is followed by a fuller, targeted notification once the facts are confirmed, so ''holding'' marks it as an interim communication rather than a financial, agricultural or physical one.',
  '63fa7033-3efc-4e74-b2b3-1f533233ed29', 5);

-- C1 text-organisation  passage dbad6b24 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'What does the sentence beginning "Notably, employee satisfaction rose in nearly all departments studied" contribute to the argument?',
  '["an upside offsetting the drawbacks", "a cause explaining the slowdown", "a restatement of the first finding", "a method used to collect the data"]'::jsonb,
  'an upside offsetting the drawbacks',
  'After a benefit and a drawback have been reported, this sentence adds a further benefit that cuts across both team types and is explicitly framed as something to place on the other side of the balance. The move is one of weighing, not of explaining, repeating or describing method.',
  'dbad6b24-9a82-42d5-b37e-c48749ff087f', 4);

-- C1 vocabulary-in-context  passage dbad6b24 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C1', 'general',
  'In "drawing firm conclusions from a two-year window", what does "window" mean?',
  '["a limited span of time", "an opening in a wall", "a chance to act quickly", "a panel on a screen"]'::jsonb,
  'a limited span of time',
  '"Window" is used figuratively here: modified by "two-year" and named as the source of the conclusions, it refers to the stretch of time the study covered, which is why the authors call for longer research.',
  'dbad6b24-9a82-42d5-b37e-c48749ff087f', 5);

-- C2 text-organisation  passage 125faee1 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'customer_service',
  'What is the role of the final sentence, beginning "We recommend the billing team review statement design..."?',
  '["It turns two earlier findings into actions", "It qualifies the response-rate figure given earlier", "It introduces a third finding not discussed above", "It restates the overall satisfaction score in full"]'::jsonb,
  'It turns two earlier findings into actions',
  'The closing sentence pairs each of the report''s two substantive findings — the new billing-clarity theme and the weaker scores from repeat contacts — with a corresponding instruction, so its function is to convert analysis into recommendation rather than to add or qualify data.',
  '125faee1-3ecf-4964-a7c5-ab0c8314d03f', 4);

-- C2 vocabulary-in-context  passage 125faee1 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'customer_service',
  'In "an area that had barely registered as an issue before", "registered" means the area had barely:',
  '["been noticed by anyone", "been recorded by a gauge", "been entered in an official list", "been sent by recorded post"]'::jsonb,
  'been noticed by anyone',
  '''Register'' has several senses; here the subject is a theme in free-text comments, set against concerns that dominated earlier feedback, so the operative sense is being noticed at all rather than being measured by an instrument, entered on a list or posted.',
  '125faee1-3ecf-4964-a7c5-ab0c8314d03f', 5);

-- C2 text-organisation  passage 43d076ab ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'general',
  'What does the clause "fully aware that she was arguing for caution based on an absence rather than a presence" do at that point in the account?',
  '["It concedes her case''s weakness before others raise it", "It states the panel''s formal objection to her proposal", "It explains why the reference avoided the question", "It withdraws the concern she has just described"]'::jsonb,
  'It concedes her case''s weakness before others raise it',
  'The clause is a pre-emptive concession: Priya names the flaw in her own argument, and the very next sentence has a panel member pressing that same flaw. Recognising a move as anticipating an objection depends on what comes after it, not on the words themselves.',
  '43d076ab-7707-46f0-a1af-70f16b17a32d', 4);

-- C2 vocabulary-in-context  passage 43d076ab ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'general',
  'In "a genuine pattern would likely surface twice", what does "surface" mean?',
  '["show itself openly", "rise to the top of water", "be given a new road covering", "form the outer face of something"]'::jsonb,
  'show itself openly',
  '''Surface'' as a verb usually describes something rising out of water, and as a noun it names an outer face or a road covering; here the subject is a pattern in a reference''s answers and the point is whether it would appear again in a second conversation, which selects the sense of becoming apparent.',
  '43d076ab-7707-46f0-a1af-70f16b17a32d', 5);

-- C2 text-organisation  passage 7fccfb34 ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'customer_service',
  'What does the clause "though it would be premature to dismiss it entirely, since prolonged billing confusion can itself erode trust if left unresolved" do to the statement it is attached to?',
  '["It limits the reassuring conclusion just drawn", "It gives evidence for the 18 percent rise", "It repeats the recommendation made later on", "It rejects the reading offered in that sentence"]'::jsonb,
  'It limits the reassuring conclusion just drawn',
  '"Though" attaches a concession: the main clause plays the complaint rise down as transitional, and the added clause fences that reassurance in without withdrawing it. Distinguishing a qualification from a reversal is the point of the item.',
  '7fccfb34-1c39-486b-9895-ceaefc4b7f28', 4);

-- C2 vocabulary-in-context  passage 7fccfb34 ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'customer_service',
  'In "Once billing-related complaints are set aside", what does "set aside" mean here?',
  '["left out of the reckoning", "saved up for later use", "overturned by a court", "placed on a nearby surface"]'::jsonb,
  'left out of the reckoning',
  'The clause introduces what remains once one category is excluded from the analysis, so "set aside" carries its analytical sense of discounting; the legal, financial and physical senses all require referents the passage does not supply.',
  '7fccfb34-1c39-486b-9895-ceaefc4b7f28', 5);

-- C2 text-organisation  passage ce97719f ordinal 4
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'general',
  'What does the opening phrase "Rather than abandon the model or roll it out universally" do for the sentence that follows it?',
  '["It sets the proposal against two rejected extremes", "It gives the reason returning users prefer flexibility", "It restates the finance lead''s stated objection", "It reports the outcome of the control group"]'::jsonb,
  'It sets the proposal against two rejected extremes',
  '"Rather than X or Y" first clears away two rival courses, so that the proposal arriving in the main clause is framed as the middle way between them. The move is one of positioning, not of evidence.',
  'ce97719f-5048-4e5d-9303-2eae443c0de5', 4);

-- C2 vocabulary-in-context  passage ce97719f ordinal 5
insert into public.questions (skill, type, cefr_level, context_tag, prompt_text, options, correct_answer, explanation, passage_id, ordinal) values (
  'reading', 'mcq', 'C2', 'general',
  'In "The product lead''s read is that...", what does the noun "read" mean here?',
  '["an interpretation of the data", "a session spent reading text", "a book that is enjoyable", "a value shown by a gauge"]'::jsonb,
  'an interpretation of the data',
  'The noun is followed by a that-clause offering a judgement about why the segments differ, which selects the sense of "read" as someone''s assessment of evidence rather than an act of reading or a measurement.',
  'ce97719f-5048-4e5d-9303-2eae443c0de5', 5);

commit;

-- verify (expect 0 rows):
-- select id from public.questions where type='mcq' and not (options ? correct_answer);