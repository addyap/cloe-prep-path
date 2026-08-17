-- CLOE pedagogy audit — A1-B2 MCQ option-length levelling (round 2)
--
-- DEFECT: in 82 A1-B2 listening+reading items the correct answer was
-- PERCEPTIBLY the longest option (leading the next by >5 chars). Measured
-- properly: where an item had a VISIBLY longest option (>10 chars clear),
-- that option was the answer 94% of the time at B2 and 76% at A1-B1.
-- Options are Fisher-Yates shuffled at load (src/lib/utils.ts:24), which defeats
-- a POSITION tell but leaves a LENGTH tell completely intact.
--
-- REPAIR: keys compressed to the distractor length band, preserving full
-- propositional content and passage support. Distractors were lengthened only
-- where compression could not close the gap, and never by adding hedging.
-- Every rewrite passed an independent refutation pass plus machine invariants:
--   correct_answer byte-identical to an option; key never uniquely longest;
--   no duplicate options; option count preserved; BrE; explanation consistent.
--
-- AUDIO-SAFE: touches only options / correct_answer / explanation.
-- No prompt_text and no passage body is modified, so no audio regeneration
-- is required and no sibling item's evidence is disturbed.

begin;

-- 0af434bf-d174-400c-b7f7-bbbf4642a04c  reading B1  key 30->24 chars, rank 1
update public.questions set options = '["Complete a feedback form", "Send Marcus a gift", "Report to her manager", "Write a full report"]'::jsonb, correct_answer = 'Complete a feedback form', explanation = 'The passage says "Please complete a short feedback form after each meeting."' where id = '0af434bf-d174-400c-b7f7-bbbf4642a04c';

-- 0d4a4c65-004b-4d2d-a749-7ddf7bc43efb  reading A1  key 26->21 chars, rank 1
update public.questions set options = '["By the coffee machine", "In the meeting room", "Near the front door", "In the car park"]'::jsonb, correct_answer = 'By the coffee machine' where id = '0d4a4c65-004b-4d2d-a749-7ddf7bc43efb';

-- 0d65b9eb-5074-42a0-8288-af6678cb97f6  reading B2  key 23->23 chars, rank 2
update public.questions set options = '["Within the next two days", "From 10 July onwards", "By the end of the month", "Not until next year"]'::jsonb, correct_answer = 'By the end of the month' where id = '0d65b9eb-5074-42a0-8288-af6678cb97f6';

-- 0e6023c8-2ea2-4b42-9e59-0c2731a33bad  reading A2  key 35->26 chars, rank 1
update public.questions set options = '["A doctor''s note in the app", "A phone call to HR", "A meeting with the manager", "No extra documents"]'::jsonb, correct_answer = 'A doctor''s note in the app' where id = '0e6023c8-2ea2-4b42-9e59-0c2731a33bad';

-- 105812ba-ab74-4f51-926f-7887d21b4d26  reading B2  key 94->57 chars, rank 2
update public.questions set options = '["To stop problems building up unnoticed as they did before", "To give staff extra work responsibilities", "To reduce the number of cleaning visits further", "To transfer complaints to HR instead of the office manager"]'::jsonb, correct_answer = 'To stop problems building up unnoticed as they did before' where id = '105812ba-ab74-4f51-926f-7887d21b4d26';

-- 14248bf1-4917-4155-a179-398db946375a  listening B2  key 28->19 chars, rank 2
update public.questions set options = '["After three o''clock", "Before three o''clock", "Tomorrow", "He won''t call back"]'::jsonb, correct_answer = 'After three o''clock' where id = '14248bf1-4917-4155-a179-398db946375a';

-- 1a18c79a-4359-408b-b884-006853b55c17  reading B1  key 38->33 chars, rank 1
update public.questions set options = '["Submit a request on the HR portal", "Email their manager directly", "Call the HR department", "Wait for automatic approval"]'::jsonb, correct_answer = 'Submit a request on the HR portal' where id = '1a18c79a-4359-408b-b884-006853b55c17';

-- 1f1265a2-34ec-499d-896f-f458754fb828  reading A1  key 32->12 chars, rank 3
update public.questions set options = '["The car park", "The lift", "The lunch room", "The front desk"]'::jsonb, correct_answer = 'The car park' where id = '1f1265a2-34ec-499d-896f-f458754fb828';

-- 26355860-7b36-46d4-82f2-63750bd29b5b  listening B2  key 45->33 chars, rank 1
update public.questions set options = '["Because two managers can''t attend", "Because the budget wasn''t ready", "Because of a venue problem", "Because it was cancelled"]'::jsonb, correct_answer = 'Because two managers can''t attend' where id = '26355860-7b36-46d4-82f2-63750bd29b5b';

-- 28b08a9f-61e1-43f1-99ce-4733ddb378ee  listening B2  key 61->42 chars, rank 3
update public.questions set options = '["A refund on the first month''s licence fee", "A screen-sharing session with a specialist", "An upgraded licence with additional features", "A dedicated support agent for the first ninety days"]'::jsonb, correct_answer = 'A screen-sharing session with a specialist' where id = '28b08a9f-61e1-43f1-99ce-4733ddb378ee';

-- 2d4a2995-3143-4c27-b6fe-e00e780a517d  listening A2  key 30->30 chars, rank 1
update public.questions set options = '["The truck has broken down", "The driver is off sick today", "The driver is stuck in traffic", "The warehouse is closed today"]'::jsonb, correct_answer = 'The driver is stuck in traffic' where id = '2d4a2995-3143-4c27-b6fe-e00e780a517d';

-- 2f410c4e-f21c-4874-9a0f-a97053679772  listening B1  key 42->28 chars, rank 1
update public.questions set options = '["A few became available again", "They were all refunded", "The conference was cancelled", "More tickets were printed"]'::jsonb, correct_answer = 'A few became available again' where id = '2f410c4e-f21c-4874-9a0f-a97053679772';

-- 2f872cd1-11c5-41a6-85a8-a55a2c6220da  listening B1  key 56->39 chars, rank 3
update public.questions set options = '["To decide the marketing campaign budget", "To review employee performance for the quarter", "To plan the conference travel arrangements", "To hire a new marketing manager"]'::jsonb, correct_answer = 'To decide the marketing campaign budget' where id = '2f872cd1-11c5-41a6-85a8-a55a2c6220da';

-- 31c2c633-83c0-4e13-92fc-506520d639bb  listening B1  key 89->59 chars, rank 1
update public.questions set options = '["She needs a record to update the schedule and tell her team", "She does not trust the supplier''s spoken promises at all", "Company policy forbids phone agreements of any kind", "She plans to complain to the supplier''s manager later"]'::jsonb, correct_answer = 'She needs a record to update the schedule and tell her team' where id = '31c2c633-83c0-4e13-92fc-506520d639bb';

-- 3229bd34-9cf8-4985-8517-f0df2300d38d  reading B2  key 97->66 chars, rank 1
update public.questions set options = '["To push the recipient into acting fast without checking the sender", "To give the recipient more time to check the sender''s identity", "To comply with IT department policy on email formatting", "To make the email look more professional"]'::jsonb, correct_answer = 'To push the recipient into acting fast without checking the sender', explanation = 'The passage describes these emails as "typically creat[ing] a sense of urgency, asking you to click a link or transfer money immediately" -- urgency is a pressure tactic to provoke a fast, unverified reaction, the opposite of giving more time to check, and unrelated to IT formatting rules or a professional appearance.' where id = '3229bd34-9cf8-4985-8517-f0df2300d38d';

-- 33dc19aa-7bd6-4c6a-b06d-37e4d6dcd15d  listening B1  key 50->32 chars, rank 2
update public.questions set options = '["She tested it on a different network", "Her manager confirmed the issue", "Three users had the same problem", "The IT team already investigated"]'::jsonb, correct_answer = 'Three users had the same problem' where id = '33dc19aa-7bd6-4c6a-b06d-37e4d6dcd15d';

-- 35af839d-e1d5-44b6-9120-bbcafe62abbc  listening B2  key 30->27 chars, rank 1
update public.questions set options = '["No incident report was sent", "The signature is missing", "The claim date is wrong", "The claim is too old"]'::jsonb, correct_answer = 'No incident report was sent', explanation = 'The speaker says the claim "is missing the incident report," which is blocking processing.' where id = '35af839d-e1d5-44b6-9120-bbcafe62abbc';

-- 37b0d27f-a124-43f0-ad9f-679e287db2e8  listening B2  key 42->29 chars, rank 2
update public.questions set options = '["Matching the price in writing", "Delivering on time", "Offering free next-day shipping", "Extending the contract"]'::jsonb, correct_answer = 'Matching the price in writing', explanation = 'The vendor said only that they''d try to match the price, and could not guarantee it in writing. Delivery, shipping and contract terms are not mentioned.' where id = '37b0d27f-a124-43f0-ad9f-679e287db2e8';

-- 3abf1225-5aa5-4a7d-b049-792a117e7689  reading B2  key 71->55 chars, rank 1
update public.questions set options = '["No refund, but a substitute delegate may attend instead", "A full refund is given automatically", "A partial refund of 50% is given", "The delegate loses their place but still gets a refund"]'::jsonb, correct_answer = 'No refund, but a substitute delegate may attend instead' where id = '3abf1225-5aa5-4a7d-b049-792a117e7689';

-- 3fd55a65-3c42-4560-80d6-f2a529a46c9e  listening B2  key 23->23 chars, rank 2
update public.questions set options = '["By the end of this week", "Immediately", "By the end of next month", "On Monday"]'::jsonb, correct_answer = 'By the end of this week' where id = '3fd55a65-3c42-4560-80d6-f2a529a46c9e';

-- 4240a643-4932-44a3-bb15-2c4c86809426  reading B2  key 48->48 chars, rank 2
update public.questions set options = '["Complete their usual weekly hours over four days", "Work extra hours beyond their normal weekly total", "Reduce their total weekly hours", "Skip the monthly feedback survey"]'::jsonb, correct_answer = 'Complete their usual weekly hours over four days' where id = '4240a643-4932-44a3-bb15-2c4c86809426';

-- 502e0a40-dd1e-476d-aa8e-128abf604aa5  listening B2  key 54->46 chars, rank 1
update public.questions set options = '["A two-year contract with a price increase", "A twelve-month contract with quarterly reviews", "No agreement was reached", "A six-month trial contract"]'::jsonb, correct_answer = 'A twelve-month contract with quarterly reviews' where id = '502e0a40-dd1e-476d-aa8e-128abf604aa5';

-- 529a3a71-c72d-45d0-b81c-e44111b68c06  reading A2  key 30->30 chars, rank 2
update public.questions set options = '["Near the printer on each floor", "In the car park outside", "Next to the reception desk", "In the kitchen with the food bins"]'::jsonb, correct_answer = 'Near the printer on each floor' where id = '529a3a71-c72d-45d0-b81c-e44111b68c06';

-- 56481f66-8cc7-4967-a889-7927fd8118d1  listening A2  key 44->25 chars, rank 2
update public.questions set options = '["In Marc''s office", "In the small meeting room", "At a client''s office in town", "In the kitchen upstairs"]'::jsonb, correct_answer = 'In the small meeting room', explanation = 'Sophie suggests meeting in the small meeting room on the third floor, and Marc agrees to this plan.' where id = '56481f66-8cc7-4967-a889-7927fd8118d1';

-- 5648239e-c579-484d-931c-9a42c81f791b  reading A2  key 27->15 chars, rank 2
update public.questions set options = '["Report it to IT", "Pay a repair fee", "Return it early", "Tell reception"]'::jsonb, correct_answer = 'Report it to IT' where id = '5648239e-c579-484d-931c-9a42c81f791b';

-- 59e24da6-6b45-4b23-9822-504533a07687  listening B2  key 43->37 chars, rank 1
update public.questions set options = '["Because no replacement has been hired", "Because Priya declined the role", "Because HR rejected it", "Because the budget wasn''t approved"]'::jsonb, correct_answer = 'Because no replacement has been hired' where id = '59e24da6-6b45-4b23-9822-504533a07687';

-- 5aa9bec6-4c6c-49e1-a4e1-0e17d38e63af  reading B2  key 103->67 chars, rank 1
update public.questions set options = '["It offers flexibility instead of a refund, so the place is not lost", "It penalises the original delegate further by charging a new fee", "It cancels the whole booking automatically", "It only applies to delegates who attended the previous year"]'::jsonb, correct_answer = 'It offers flexibility instead of a refund, so the place is not lost' where id = '5aa9bec6-4c6c-49e1-a4e1-0e17d38e63af';

-- 65a8db19-9daa-4a4d-83e0-fac7b1389672  listening A1  key 29->17 chars, rank 1
update public.questions set options = '["He is on holiday", "He has a headache", "His car is broken", "He has a meeting"]'::jsonb, correct_answer = 'He has a headache', explanation = 'Tom says, ''I am sick today. I have a headache,'' which is the reason he stays home, not a holiday, car trouble, or a meeting.' where id = '65a8db19-9daa-4a4d-83e0-fac7b1389672';

-- 664bf1b2-05f3-43f0-92a3-99bafea1dfbc  listening B1  key 48->27 chars, rank 2
update public.questions set options = '["Free shipping on every order", "A longer contract period", "A dedicated account manager", "A money-back guarantee"]'::jsonb, correct_answer = 'A dedicated account manager' where id = '664bf1b2-05f3-43f0-92a3-99bafea1dfbc';

-- 6936fe5f-3c72-4e75-91fa-fbfbf514148e  reading B1  key 18->18 chars, rank 1
update public.questions set options = '["Their line manager", "The HR department", "Their clients", "Another colleague"]'::jsonb, correct_answer = 'Their line manager' where id = '6936fe5f-3c72-4e75-91fa-fbfbf514148e';

-- 69b2930b-10ef-4f0c-95da-a92763c3254d  reading B2  key 34->30 chars, rank 2
update public.questions set options = '["Nearby colleagues'' phone calls", "Printers and photocopiers", "General conversation in the office", "The air conditioning system"]'::jsonb, correct_answer = 'Nearby colleagues'' phone calls' where id = '69b2930b-10ef-4f0c-95da-a92763c3254d';

-- 6a5b3177-89a5-4b53-b5d8-216e2f1df8ec  listening B2  key 55->42 chars, rank 2
update public.questions set options = '["He completed the project ahead of schedule", "He kept the client informed at every stage", "He negotiated a better contract price", "He resolved a major conflict with the client"]'::jsonb, correct_answer = 'He kept the client informed at every stage', explanation = 'The manager says "your client reported that you kept them informed at every stage, which is exactly the kind of communication we value." There is no mention of early completion, pricing negotiations or conflict resolution on the Henderson account.' where id = '6a5b3177-89a5-4b53-b5d8-216e2f1df8ec';

-- 6ea205d0-b02b-4ffc-bbdb-fb33aa39c638  listening B2  key 61->42 chars, rank 2
update public.questions set options = '["Avoid taking on risky projects", "Delegate more tasks to his team", "Flag problems early instead of hiding them", "Focus more on engagement metrics than deadlines"]'::jsonb, correct_answer = 'Flag problems early instead of hiding them', explanation = 'Elena says she''d "rather hear about problems early, even if it meant an uncomfortable conversation, than discover them once it was too late to adjust," which matches this option and none of the others.' where id = '6ea205d0-b02b-4ffc-bbdb-fb33aa39c638';

-- 726e3657-077e-44c9-af96-f406a6375134  reading B1  key 24->24 chars, rank 3
update public.questions set options = '["Within five working days", "Within two calendar weeks", "Within one calendar month", "On the same working day"]'::jsonb, correct_answer = 'Within five working days' where id = '726e3657-077e-44c9-af96-f406a6375134';

-- 74434dce-0dfb-45ab-8229-8c3b220604ad  reading B2  key 88->61 chars, rank 3
update public.questions set options = '["Coping strategies for noise may differ with length of service", "Headphones are banned for employees who have worked there over ten years", "Younger employees are less bothered by noise than longer-serving staff", "All employees use headphones equally regardless of tenure"]'::jsonb, correct_answer = 'Coping strategies for noise may differ with length of service' where id = '74434dce-0dfb-45ab-8229-8c3b220604ad';

-- 75478f68-77c9-4b51-97a5-8f3597aea8be  reading B2  key 70->55 chars, rank 1
update public.questions set options = '["It is a compulsory part of the new wellness programme", "It is encouraged but not a formal part of the programme", "It is a replacement for the weekly yoga sessions", "It is offered only to managers, not to their teams"]'::jsonb, correct_answer = 'It is encouraged but not a formal part of the programme' where id = '75478f68-77c9-4b51-97a5-8f3597aea8be';

-- 86a61666-4471-4ae2-b7da-e23ad4232b7b  listening B1  key 52->28 chars, rank 2
update public.questions set options = '["Email a written confirmation", "Cancel the express courier", "Call the production team directly", "Refund part of the order"]'::jsonb, correct_answer = 'Email a written confirmation' where id = '86a61666-4471-4ae2-b7da-e23ad4232b7b';

-- 877a1408-c475-443a-bde9-d7bae93ea49e  reading B2  key 71->55 chars, rank 2
update public.questions set options = '["To announce the permanent closure of the distribution centre", "To explain the cause of the delays and ask for patience", "To offer refunds to customers whose orders were delayed", "To recruit extra couriers to help clear the backlog"]'::jsonb, correct_answer = 'To explain the cause of the delays and ask for patience' where id = '877a1408-c475-443a-bde9-d7bae93ea49e';

-- 91e445ac-1ed7-49b9-95b7-bba8170135db  reading B2  key 94->59 chars, rank 1
update public.questions set options = '["It plans to withdraw the premium range from sale soon", "It is cutting prices across its entire product range", "It wants to protect its relationship with long-term clients", "It expects premium clients to absorb the largest increase"]'::jsonb, correct_answer = 'It wants to protect its relationship with long-term clients', explanation = 'The letter freezes premium pricing explicitly "as part of our commitment to long-term partners like yourselves" -- a relationship-preserving move, not a withdrawal of the range, a general price cut, or a larger increase for premium buyers.' where id = '91e445ac-1ed7-49b9-95b7-bba8170135db';

-- 951eb3cb-1f3e-46c3-8a56-502f69bac7aa  listening A1  key 23->11 chars, rank 2
update public.questions set options = '["His doctor", "His manager", "His colleague", "His wife"]'::jsonb, correct_answer = 'His manager' where id = '951eb3cb-1f3e-46c3-8a56-502f69bac7aa';

-- 9737c137-792f-4919-8c1b-dfeb344538ce  reading B2  key 77->60 chars, rank 2
update public.questions set options = '["The sender believes the client is trying to avoid paying at all", "The sender wants to end the partnership with the client", "The sender recognises the client may have cash-flow concerns", "The sender is unwilling to negotiate on payment terms"]'::jsonb, correct_answer = 'The sender recognises the client may have cash-flow concerns' where id = '9737c137-792f-4919-8c1b-dfeb344538ce';

-- 99de3df0-eb8c-4cda-a27f-53c36982118e  reading B2  key 101->58 chars, rank 3
update public.questions set options = '["All departments will lose the higher limit after one quarter", "The limit can be lowered for one department but not others", "Only finance can have its own approval limit changed", "The limit will rise further for departments that spend the most"]'::jsonb, correct_answer = 'The limit can be lowered for one department but not others' where id = '99de3df0-eb8c-4cda-a27f-53c36982118e';

-- 9bc1911e-62d6-4494-83f0-8a7005c57891  reading A2  key 26->11 chars, rank 3
update public.questions set options = '["Nine thirty", "Eight o''clock", "Ten o''clock", "Twelve o''clock"]'::jsonb, correct_answer = 'Nine thirty' where id = '9bc1911e-62d6-4494-83f0-8a7005c57891';

-- 9bca627f-2b42-49ea-b49f-55e5f6883cab  listening B2  key 62->39 chars, rank 1
update public.questions set options = '["He was dismissive about a previous team", "He was late to the interview", "He asked no questions about the role", "He had no relevant experience"]'::jsonb, correct_answer = 'He was dismissive about a previous team' where id = '9bca627f-2b42-49ea-b49f-55e5f6883cab';

-- 9ebacfb8-48a8-4190-9ea0-fe499defaa5f  listening B2  key 42->36 chars, rank 1
update public.questions set options = '["If the client accepts the new budget", "If the team works overtime", "If the client pays in advance", "If the project is reduced in scope"]'::jsonb, correct_answer = 'If the client accepts the new budget' where id = '9ebacfb8-48a8-4190-9ea0-fe499defaa5f';

-- 9fe9abf6-14cc-4d8c-bf18-8a5f3598ca65  reading B1  key 37->29 chars, rank 1
update public.questions set options = '["Discuss it with their manager", "Submit a form to HR", "Wait six weeks", "Talk to the new department"]'::jsonb, correct_answer = 'Discuss it with their manager' where id = '9fe9abf6-14cc-4d8c-bf18-8a5f3598ca65';

-- a1ad493c-34e8-4724-9ca8-e888659986e1  reading B2  key 76->57 chars, rank 1
update public.questions set options = '["To reduce the risk of losing receipts before the deadline", "To comply with an insurance rule unrelated to expenses", "To phase out paper receipts, which are no longer accepted", "To qualify for the app''s discount on travel meals"]'::jsonb, correct_answer = 'To reduce the risk of losing receipts before the deadline' where id = 'a1ad493c-34e8-4724-9ca8-e888659986e1';

-- a5879dde-d632-4c0e-9c7f-361e68ebfa75  reading B2  key 127->69 chars, rank 1
update public.questions set options = '["They have already decided the software update is unnecessary", "They plan to drop the new system and return to the old spreadsheet", "They want to see if the manual fix works before updating the software", "They think the unused-room problem is not worth investigating"]'::jsonb, correct_answer = 'They want to see if the manual fix works before updating the software' where id = 'a5879dde-d632-4c0e-9c7f-361e68ebfa75';

-- a59d4378-fc4d-4a64-bda5-ffc94757aa1c  listening B1  key 99->56 chars, rank 1
update public.questions set options = '["Her marketing figures are useful for the budget decision", "She is the most senior person on the finance team", "She originally proposed the autumn marketing campaign", "The team leader wants her to replace the absent managers"]'::jsonb, correct_answer = 'Her marketing figures are useful for the budget decision' where id = 'a59d4378-fc4d-4a64-bda5-ffc94757aa1c';

-- a5a9e9df-0e3d-45fc-9b05-0882ffb170e7  listening B1  key 49->39 chars, rank 1
update public.questions set options = '["Entering incorrect passwords", "Generating reports dated before January", "Opening more than one window at a time", "Printing large documents"]'::jsonb, correct_answer = 'Generating reports dated before January' where id = 'a5a9e9df-0e3d-45fc-9b05-0882ffb170e7';

-- a65e7123-d53e-4042-948d-ccc9c1040e9e  listening B2  key 43->39 chars, rank 1
update public.questions set options = '["The client wants to meet the sales team", "The factory is closed for maintenance", "The hotel cancelled the transport", "The client requested a later date"]'::jsonb, correct_answer = 'The client wants to meet the sales team' where id = 'a65e7123-d53e-4042-948d-ccc9c1040e9e';

-- aaf3ad44-3c58-48bf-b5f2-7d63049bb046  listening B2  key 26->26 chars, rank 2
update public.questions set options = '["Burnt toast in the kitchen", "A real fire in the building", "A test drill", "An electrical fault"]'::jsonb, correct_answer = 'Burnt toast in the kitchen' where id = 'aaf3ad44-3c58-48bf-b5f2-7d63049bb046';

-- af2c1ef1-222f-4e82-ae4e-d28fe82904cf  listening B2  key 35->31 chars, rank 2
update public.questions set options = '["People who missed the first one", "Any staff member who wants a place", "Managers only", "New starters only"]'::jsonb, correct_answer = 'People who missed the first one' where id = 'af2c1ef1-222f-4e82-ae4e-d28fe82904cf';

-- b24949ca-36a0-48d4-a3ee-8c21541db7d5  listening A2  key 20->20 chars, rank 3
update public.questions set options = '["A permanent contract", "A promotion to manager", "A longer probation period", "A new office desk"]'::jsonb, correct_answer = 'A permanent contract', explanation = 'The script states Tom "got a permanent contract" after passing his review; no promotion, longer probation, or new desk is mentioned.' where id = 'b24949ca-36a0-48d4-a3ee-8c21541db7d5';

-- b8950e4f-9196-4114-b306-a6af8749b831  listening B2  key 75->67 chars, rank 1
update public.questions set options = '["The marketing team made mistakes in their original calculations", "The digital campaign needed more funding after strong early results", "The operations team borrowed from the marketing budget", "The regional director approved additional spending"]'::jsonb, correct_answer = 'The digital campaign needed more funding after strong early results' where id = 'b8950e4f-9196-4114-b306-a6af8749b831';

-- b9ab2be3-3485-48b4-b85c-563dc9f42f8b  listening B2  key 113->72 chars, rank 1
update public.questions set options = '["A difficult hire in the past is pushing her to value attitude over skill", "She personally dislikes the first candidate for unrelated reasons", "Company policy requires hiring the less experienced candidate", "She was pressured by her colleague to agree against her own judgment"]'::jsonb, correct_answer = 'A difficult hire in the past is pushing her to value attitude over skill' where id = 'b9ab2be3-3485-48b4-b85c-563dc9f42f8b';

-- bcda039a-553b-44f1-b32a-fc153b9f11b4  reading A2  key 31->31 chars, rank 1
update public.questions set options = '["To make entry safer and quicker", "To save money on printing", "To follow new government rules", "To reduce staff numbers"]'::jsonb, correct_answer = 'To make entry safer and quicker' where id = 'bcda039a-553b-44f1-b32a-fc153b9f11b4';

-- c3fc3de1-8848-4391-a31c-534d5173ca5f  listening B2  key 77->67 chars, rank 2
update public.questions set options = '["He gives her time but ties the decision to a fixed pricing deadline", "He gives her time to review and leaves the deadline entirely open", "He asks for a decision before the technical questions are settled", "He defers the pricing question until after the implementation meeting"]'::jsonb, correct_answer = 'He gives her time but ties the decision to a fixed pricing deadline' where id = 'c3fc3de1-8848-4391-a31c-534d5173ca5f';

-- c6f9015f-a662-4cf1-bda8-f6ca5fc3f832  listening B1  key 43->39 chars, rank 2
update public.questions set options = '["Because her background check isn''t done", "Because she asked for a later start date", "Because the office is full", "Because of a public holiday"]'::jsonb, correct_answer = 'Because her background check isn''t done' where id = 'c6f9015f-a662-4cf1-bda8-f6ca5fc3f832';

-- c7f47cc4-3a9c-408b-bdaa-19bb7cfe2ac2  reading B2  key 113->56 chars, rank 2
update public.questions set options = '["Fully committed to the September rollout whatever happens", "Cautious and data-driven, expanding only if output holds", "Reluctant, and likely to end the trial in September", "Indifferent to whether the trial succeeds or fails"]'::jsonb, correct_answer = 'Cautious and data-driven, expanding only if output holds' where id = 'c7f47cc4-3a9c-408b-bdaa-19bb7cfe2ac2';

-- ca7c3a8e-2f09-40c2-b74f-d0508d6444fb  listening B1  key 33->33 chars, rank 1
update public.questions set options = '["Because the manager is travelling", "Because the room is booked", "Because it''s a public holiday", "Because of a client visit"]'::jsonb, correct_answer = 'Because the manager is travelling' where id = 'ca7c3a8e-2f09-40c2-b74f-d0508d6444fb';

-- cabbbfe0-79c7-4409-936f-2b9f8833329e  reading B2  key 24->24 chars, rank 3
update public.questions set options = '["Contacting the support team", "Paying by card online", "Placing duplicate orders", "Requesting priority dispatch"]'::jsonb, correct_answer = 'Placing duplicate orders' where id = 'cabbbfe0-79c7-4409-936f-2b9f8833329e';

-- cc9c340f-d4d7-4188-bb9e-2ea6c6c65b35  listening B2  key 25->25 chars, rank 1
update public.questions set options = '["The whistleblower hotline", "The new overtime policy", "The office dress code", "The safety training day"]'::jsonb, correct_answer = 'The whistleblower hotline', explanation = 'The script says HR''s reminder was specifically about "the whistleblower hotline", not overtime, the dress code, or training.' where id = 'cc9c340f-d4d7-4188-bb9e-2ea6c6c65b35';

-- cecc1794-7fa4-4afa-a285-5dff633ceb7d  listening B2  key 46->42 chars, rank 1
update public.questions set options = '["Whether their earlier meeting ends on time", "Whether the client confirms the agenda", "Whether the call is rescheduled to later", "Whether they finish their report today"]'::jsonb, correct_answer = 'Whether their earlier meeting ends on time' where id = 'cecc1794-7fa4-4afa-a285-5dff633ceb7d';

-- d3099f43-3709-42b8-a110-90c5fac5ac94  listening B2  key 43->36 chars, rank 2
update public.questions set options = '["A shortage of marketing budget", "A late change in design requirements", "The sales team''s unavailability", "A problem with the engagement metrics"]'::jsonb, correct_answer = 'A late change in design requirements' where id = 'd3099f43-3709-42b8-a110-90c5fac5ac94';

-- d39318b4-1465-4921-a2d5-f91a7345700f  reading B1  key 84->56 chars, rank 1
update public.questions set options = '["Because the scheme should be easy to use, not a struggle", "Because the charity needs an urgent answer", "Because HR will reject late approvals", "Because the day off is optional for managers to allow"]'::jsonb, correct_answer = 'Because the scheme should be easy to use, not a struggle', explanation = 'The email states this directly: "the scheme is designed to be easy to use rather than something staff have to fight for."' where id = 'd39318b4-1465-4921-a2d5-f91a7345700f';

-- dbf8e499-e10b-481a-8fd7-fc4d3f0fb915  listening B2  key 69->59 chars, rank 1
update public.questions set options = '["He must complete the advanced business writing workshop", "He must show real progress in delegation and report writing", "He must successfully manage three new client accounts", "He must receive positive feedback from all team members"]'::jsonb, correct_answer = 'He must show real progress in delegation and report writing' where id = 'dbf8e499-e10b-481a-8fd7-fc4d3f0fb915';

-- dde4e154-bdca-4cde-88bf-dee10c4f208c  listening B1  key 54->39 chars, rank 1
update public.questions set options = '["They were charged for one item too many", "They cancelled their order", "The item arrived damaged", "The price was reduced after purchase"]'::jsonb, correct_answer = 'They were charged for one item too many' where id = 'dde4e154-bdca-4cde-88bf-dee10c4f208c';

-- e0fba171-d388-4bd3-b8c1-24f9a76b9d22  reading B1  key 39->32 chars, rank 1
update public.questions set options = '["Managers are on holiday", "Two managers are at a conference", "The meeting room was booked", "Staff requested a later time"]'::jsonb, correct_answer = 'Two managers are at a conference' where id = 'e0fba171-d388-4bd3-b8c1-24f9a76b9d22';

-- e3f2c519-ca51-4840-bd6a-ce74916e708b  listening B2  key 80->71 chars, rank 1
update public.questions set options = '["Priority handling is free but slower; express costs extra and is faster", "Both options are free but have different delivery timelines", "Priority handling requires manager approval; express delivery does not", "Express delivery includes insurance; priority handling does not"]'::jsonb, correct_answer = 'Priority handling is free but slower; express costs extra and is faster' where id = 'e3f2c519-ca51-4840-bd6a-ce74916e708b';

-- e4a41300-ff6a-4af2-9baf-c55ead4b4037  reading B2  key 92->62 chars, rank 2
update public.questions set options = '["It considers breaks less important than the yoga and gym offers", "It sees breaks as helpful but keeps them outside the programme", "It requires all staff to take breaks at set times", "It plans to remove breaks entirely from company policy"]'::jsonb, correct_answer = 'It sees breaks as helpful but keeps them outside the programme' where id = 'e4a41300-ff6a-4af2-9baf-c55ead4b4037';

-- e7dbfd3a-4d86-4c4a-85b4-0ae23f06f32f  reading B2  key 79->54 chars, rank 1
update public.questions set options = '["Places may already have been taken by earlier bookings", "Places are guaranteed regardless of registration date", "Extra workshop sessions will be added automatically", "Delegates will be assigned workshops at random"]'::jsonb, correct_answer = 'Places may already have been taken by earlier bookings' where id = 'e7dbfd3a-4d86-4c4a-85b4-0ae23f06f32f';

-- e9e3ebdf-b3f4-4739-80ab-5bea87fae520  listening B1  key 49->38 chars, rank 1
update public.questions set options = '["It has been jamming since last weekend", "It stopped turning on completely", "It prints in the wrong colours", "It makes a loud noise when printing"]'::jsonb, correct_answer = 'It has been jamming since last weekend' where id = 'e9e3ebdf-b3f4-4739-80ab-5bea87fae520';

-- ec2aab04-8885-48b1-b88c-cd8e0bdc9158  listening B2  key 50->42 chars, rank 2
update public.questions set options = '["If marketing cuts spending in another area", "If the finance director resigns", "If the increase is postponed to next quarter", "If marketing submits a new proposal"]'::jsonb, correct_answer = 'If marketing cuts spending in another area' where id = 'ec2aab04-8885-48b1-b88c-cd8e0bdc9158';

-- ed7a45f7-89dc-43e5-a653-0c70f0659eb9  reading B1  key 42->37 chars, rank 1
update public.questions set options = '["By booking a desk in the app each day", "By keeping their assigned desk", "By asking their manager each day", "By arriving early to claim a desk"]'::jsonb, correct_answer = 'By booking a desk in the app each day' where id = 'ed7a45f7-89dc-43e5-a653-0c70f0659eb9';

-- ed7b109e-8702-4845-88db-7885372d6bbd  reading A1  key 21->21 chars, rank 1
update public.questions set options = '["A children''s hospital", "The office team", "Sara and her friends", "A local school"]'::jsonb, correct_answer = 'A children''s hospital' where id = 'ed7b109e-8702-4845-88db-7885372d6bbd';

-- f083b550-e336-4b7e-85fd-3d846a1ef221  reading B2  key 89->64 chars, rank 2
update public.questions set options = '["To warn customers that late registration cancels all future points", "To address a likely worry about losing credit for past purchases", "To explain that points are only earned after a full year", "To announce that early points will be doubled this month"]'::jsonb, correct_answer = 'To address a likely worry about losing credit for past purchases' where id = 'f083b550-e336-4b7e-85fd-3d846a1ef221';

-- f44e48b7-b331-479a-be26-cb253dcd71f6  reading B2  key 83->55 chars, rank 2
update public.questions set options = '["They believe the new routine is not worth the switch", "They think staff exaggerated the cleaning complaints", "They accept a small inconvenience to fix the complaints", "They plan to drop the desk-clearing requirement before long"]'::jsonb, correct_answer = 'They accept a small inconvenience to fix the complaints' where id = 'f44e48b7-b331-479a-be26-cb253dcd71f6';

-- f5a65bda-8be5-44f6-960a-622a478fc8da  reading A2  key 27->18 chars, rank 2
update public.questions set options = '["Yes, a small fee", "Yes, the full price", "No, nothing to pay", "Only if it is late"]'::jsonb, correct_answer = 'No, nothing to pay' where id = 'f5a65bda-8be5-44f6-960a-622a478fc8da';

-- f6dab89f-82ed-451d-b069-159c2f748494  reading B2  key 99->63 chars, rank 1
update public.questions set options = '["Because spending is still reviewed and the limit can be lowered", "Because department heads no longer need to justify any expenses", "Because finance has stopped monitoring spending altogether", "Because the €2,000 limit applies only to software purchases"]'::jsonb, correct_answer = 'Because spending is still reviewed and the limit can be lowered' where id = 'f6dab89f-82ed-451d-b069-159c2f748494';

-- f82aaa1d-e606-4680-8a1c-0a5848c5d811  reading B1  key 30->22 chars, rank 2
update public.questions set options = '["Return it to any store", "Call the factory", "Send the kettle by post", "Visit the website"]'::jsonb, correct_answer = 'Return it to any store' where id = 'f82aaa1d-e606-4680-8a1c-0a5848c5d811';

-- ff72c6af-2154-4113-a916-d28deaa4cb28  listening A1  key 31->12 chars, rank 1
update public.questions set options = '["Every week", "Once a month", "Every Friday", "Twice a year"]'::jsonb, correct_answer = 'Once a month', explanation = 'The speaker says the safety meeting is ''every first Monday of the month'', so it happens once a month. The other frequencies are not mentioned.' where id = 'ff72c6af-2154-4113-a916-d28deaa4cb28';

commit;

-- verification (expect roughly chance, ~25%, not 81%):
-- select count(*) filter (where longest) * 100.0 / count(*) as pct_key_longest from (
--   select (length(correct_answer) > (select max(length(v)) from jsonb_array_elements_text(options) v
--            where v <> correct_answer)) as longest
--   from public.questions where type='mcq' and skill in ('listening','reading')
--     and cefr_level in ('C1','C2')) t;