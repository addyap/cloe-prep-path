-- CLOE pedagogy audit — C1/C2 MCQ option-length levelling
--
-- DEFECT: the correct answer was the uniquely longest option in 157 of 194
-- C1/C2 listening+reading items (up to 90% at C1 reading), so a learner who
-- understood nothing could beat chance by always choosing the longest option.
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

-- 00925d86-d467-4482-bde5-eb73882f166c  reading C2  key 61->43 chars, rank 4
update public.questions set options = '["Discipline across procurement and logistics", "A single major strategic decision by the board", "The successful launch of the Nordic expansion", "Reduced spending across the communications budget"]'::jsonb, correct_answer = 'Discipline across procurement and logistics' where id = '00925d86-d467-4482-bde5-eb73882f166c';

-- 017fcce7-9854-486b-9080-56b62a305edd  reading C2  key 30->30 chars, rank 4
update public.questions set options = '["Anyone beyond department heads", "Regional managers in the three offices", "The suppliers involved in the renewals", "The internal audit team that wrote it"]'::jsonb, correct_answer = 'Anyone beyond department heads' where id = '017fcce7-9854-486b-9080-56b62a305edd';

-- 0a0f60de-d7ae-4289-ace3-19e826a0f26f  listening C2  key 128->48 chars, rank 4
update public.questions set options = '["Both are acting in bad faith and should be removed from the discussion", "Both weigh only the short term, not the long run", "Both are too emotional to make rational business decisions", "Both have conflicts of interest that disqualify them from the discussion"]'::jsonb, correct_answer = 'Both weigh only the short term, not the long run' where id = '0a0f60de-d7ae-4289-ace3-19e826a0f26f';

-- 0a825f5a-ad65-4eb7-a2df-ce0b26670309  reading C1  key 66->54 chars, rank 3
update public.questions set options = '["The company is not taking the vendor''s report on trust", "The company doubts that a breach happened at all", "The company plans to terminate the vendor contract immediately", "The vendor has refused to cooperate with the investigation"]'::jsonb, correct_answer = 'The company is not taking the vendor''s report on trust' where id = '0a825f5a-ad65-4eb7-a2df-ce0b26670309';

-- 0cde8bd9-0315-42ba-9ed2-3e674d9e9ecb  reading C2  key 46->46 chars, rank 3
update public.questions set options = '["Invoice formatting from the new billing system", "A meaningful decline in overall service quality", "Late deliveries reported during the quarter", "Price increases introduced alongside the new system"]'::jsonb, correct_answer = 'Invoice formatting from the new billing system' where id = '0cde8bd9-0315-42ba-9ed2-3e674d9e9ecb';

-- 0d037cc3-21fe-4445-b2b6-1bb746b1adc5  listening C1  key 101->57 chars, rank 4
update public.questions set options = '["To pressure the client into signing a longer contract term", "To show confidence in the fix and make staying less risky", "To comply with a legal requirement in the service agreement", "To shift attention away from the forty-seven-hour resolution times"]'::jsonb, correct_answer = 'To show confidence in the fix and make staying less risky' where id = '0d037cc3-21fe-4445-b2b6-1bb746b1adc5';

-- 0d6510bd-1c2c-460a-a487-76e37c0e20a8  listening C2  key 127->70 chars, rank 2
update public.questions set options = '["To embarrass the other side and force an immediate concession", "To signal an information advantage while reframing towards mutual gain", "To prove that the other company''s patents are based on stolen technology", "To suggest that the other company''s R and D team is incompetent"]'::jsonb, correct_answer = 'To signal an information advantage while reframing towards mutual gain' where id = '0d6510bd-1c2c-460a-a487-76e37c0e20a8';

-- 0e7f29dc-264f-4b06-a840-48e0011ba4f9  listening C2  key 121->53 chars, rank 3
update public.questions set options = '["The media will never learn of the Bangladesh audit findings", "Stakeholders judge ethical substance, not just optics", "The company''s shareholders do not care about ethical sourcing", "Vanguard Apparel''s remediation approach backfired"]'::jsonb, correct_answer = 'Stakeholders judge ethical substance, not just optics' where id = '0e7f29dc-264f-4b06-a840-48e0011ba4f9';

-- 0ed4df1f-c5bf-4574-b401-1d11d6f1e9b6  listening C2  key 120->63 chars, rank 2
update public.questions set options = '["The new CEO will deliberately sabotage the company from within", "The change looks orderly while the new CEO lacks real authority", "Margaret plans to keep controlling the company after stepping down", "The board is appointing a weak successor to keep its own power"]'::jsonb, correct_answer = 'The change looks orderly while the new CEO lacks real authority' where id = '0ed4df1f-c5bf-4574-b401-1d11d6f1e9b6';

-- 0f8af429-da4b-47e8-9676-ea01f1ffb913  listening C2  key 54->47 chars, rank 3
update public.questions set options = '["The evasion itself hints something is under way", "He confirmed outright that no merger is being planned", "He answered the merger question clearly and directly", "The merger has already been announced publicly"]'::jsonb, correct_answer = 'The evasion itself hints something is under way' where id = '0f8af429-da4b-47e8-9676-ea01f1ffb913';

-- 0fee3309-c23b-40b6-b62d-29a2b9b0ae42  reading C1  key 24->33 chars, rank 4
update public.questions set options = '["Incomplete supplier documentation", "Credit checks extending beyond two weeks", "Delays in issuing the unique vendor code", "Poor quality in the trial sample order"]'::jsonb, correct_answer = 'Incomplete supplier documentation' where id = '0fee3309-c23b-40b6-b62d-29a2b9b0ae42';

-- 10239a97-ef28-4fe4-ab80-cb9a628427f6  listening C1  key 49->49 chars, rank 2
update public.questions set options = '["More people now expect an invite than was planned", "The event has been cancelled now that word has got out", "It has been moved to an online-only format", "Nobody in the building wants to attend it now"]'::jsonb, correct_answer = 'More people now expect an invite than was planned' where id = '10239a97-ef28-4fe4-ab80-cb9a628427f6';

-- 1341efee-9e5b-44ea-ae4d-15139c32e44b  reading C2  key 108->69 chars, rank 2
update public.questions set options = '["A flat overall result hid opposite effects in different user segments", "The trial produced no usable data on conversion at all", "The trial proved the new pricing model was a complete failure", "The trial proved the new pricing model should replace the old one for everyone"]'::jsonb, correct_answer = 'A flat overall result hid opposite effects in different user segments' where id = '1341efee-9e5b-44ea-ae4d-15139c32e44b';

-- 15fd189e-7ea5-4208-89ac-c407a1bca72e  reading C1  key 65->48 chars, rank 3
update public.questions set options = '["Submit in-progress claims in the existing system", "Complete the 45-minute mandatory training session", "Download and set up the ExpensePro mobile app", "Request manager approval for every outstanding claim"]'::jsonb, correct_answer = 'Submit in-progress claims in the existing system' where id = '15fd189e-7ea5-4208-89ac-c407a1bca72e';

-- 165a2599-b10d-4796-a93f-b149634e2f40  listening C2  key 56->43 chars, rank 2
update public.questions set options = '["Finish it this week rather than delay again", "Push the deadline back one more time", "Cancel the task rather than finish it", "Leave the decision to someone else on the team"]'::jsonb, correct_answer = 'Finish it this week rather than delay again' where id = '165a2599-b10d-4796-a93f-b149634e2f40';

-- 1755a362-281e-400a-ac8a-1d1d416a724c  reading C1  key 80->60 chars, rank 3
update public.questions set options = '["The steps involved can take a long time, especially overseas", "Onboarding is normally instant and six weeks is excessive caution", "The six-week window applies only to suppliers under framework agreements", "Issuing the unique vendor code alone takes six weeks"]'::jsonb, correct_answer = 'The steps involved can take a long time, especially overseas' where id = '1755a362-281e-400a-ac8a-1d1d416a724c';

-- 18604342-ee55-4d18-ada4-1dfb64cb721c  reading C1  key 76->49 chars, rank 3
update public.questions set options = '["For suppliers on a group-wide framework agreement", "For suppliers based overseas, where checks take longer", "When the credit check clears in under five days", "Never - every new supplier receives a sample order"]'::jsonb, correct_answer = 'For suppliers on a group-wide framework agreement' where id = '18604342-ee55-4d18-ada4-1dfb64cb721c';

-- 1c2a106d-7972-4f05-b5fd-358caa3948e4  listening C1  key 57->53 chars, rank 3
update public.questions set options = '["Management is likely to question the repeat shortages", "The count was accurate this time despite earlier errors", "This is the first shortage of the quarter", "The warehouse is closing down at the end of the quarter"]'::jsonb, correct_answer = 'Management is likely to question the repeat shortages' where id = '1c2a106d-7972-4f05-b5fd-358caa3948e4';

-- 1c5aafce-d7d6-4d22-b613-8e3508ebe1a0  reading C2  key 95->62 chars, rank 2
update public.questions set options = '["Because a prize-draw incentive, not engagement, may explain it", "Because the response rate actually fell from 62% in Q1 to 48%", "Because too few customers responded for the results to be meaningful", "Because the Q2 survey used a different method entirely"]'::jsonb, correct_answer = 'Because a prize-draw incentive, not engagement, may explain it' where id = '1c5aafce-d7d6-4d22-b613-8e3508ebe1a0';

-- 20deae92-0c97-48d8-94ca-b6426e074850  reading C2  key 86->62 chars, rank 2
update public.questions set options = '["Those who left earned above market rate; those who stayed less", "Logistics staff were paid 4% below the market rate for their roles", "No employees mentioned pay in their exit interviews at all", "Pay in the division has not changed since the March shift move"]'::jsonb, correct_answer = 'Those who left earned above market rate; those who stayed less' where id = '20deae92-0c97-48d8-94ca-b6426e074850';

-- 215020bc-d8e0-4b75-b8f1-2abe9ef47a72  listening C1  key 91->66 chars, rank 3
update public.questions set options = '["The email contains confidential details that cannot be shared verbally", "The speaker wants to counter the rumours and explain the reasoning", "The email system is unreliable and messages often go missing", "Company policy requires all announcements to be made in video format"]'::jsonb, correct_answer = 'The speaker wants to counter the rumours and explain the reasoning' where id = '215020bc-d8e0-4b75-b8f1-2abe9ef47a72';

-- 2303aa4c-6541-4448-957d-b89b49ac5f1a  listening C2  key 145->57 chars, rank 4
update public.questions set options = '["He admits the deal is unfair and ought to be rejected outright", "He is warning that the other side must make all the concessions", "He does not grasp the financial details of his own proposal", "He concedes the imbalance to build trust and move forward"]'::jsonb, correct_answer = 'He concedes the imbalance to build trust and move forward' where id = '2303aa4c-6541-4448-957d-b89b49ac5f1a';

-- 24ab8048-47ca-451d-b690-76cd9cb5ce5a  listening C2  key 65->48 chars, rank 2
update public.questions set options = '["The client objected but is still willing to talk", "The client accepted the asking price straight away", "The client broke off the negotiation completely", "The client offered to pay more than was asked"]'::jsonb, correct_answer = 'The client objected but is still willing to talk' where id = '24ab8048-47ca-451d-b690-76cd9cb5ce5a';

-- 253445a3-c35d-4c0f-97f5-cffbb06d4c88  reading C1  key 49->43 chars, rank 4
update public.questions set options = '["Their travel volume makes them the priority", "They asked to be included in the first phase", "They filed the most expense-related complaints", "They are the company''s two largest departments"]'::jsonb, correct_answer = 'Their travel volume makes them the priority' where id = '253445a3-c35d-4c0f-97f5-cffbb06d4c88';

-- 2798e9ed-55a2-4d8a-958b-b467225f1514  reading C1  key 28->28 chars, rank 3
update public.questions set options = '["A payroll processing company", "A cloud data storage provider", "A recruitment and staffing agency", "A corporate insurance broker"]'::jsonb, correct_answer = 'A payroll processing company' where id = '2798e9ed-55a2-4d8a-958b-b467225f1514';

-- 29caf5f4-d9d7-4393-a9c3-48bcd71f3714  reading C2  key 87->56 chars, rank 2
update public.questions set options = '["The newest hires resisted most, not the most experienced", "The longest-serving dispatchers refused the software outright", "No team showed real resistance to the new platform", "Resistance came only from drivers, not dispatchers"]'::jsonb, correct_answer = 'The newest hires resisted most, not the most experienced' where id = '29caf5f4-d9d7-4393-a9c3-48bcd71f3714';

-- 2a64248c-d108-4ad6-a8df-7e603391d9b9  listening C1  key 90->55 chars, rank 3
update public.questions set options = '["To push for better terms while keeping her options open", "To formally announce that the contract will not be renewed", "To ask the supplier to match the competitors'' prices", "To end the business relationship without further discussion"]'::jsonb, correct_answer = 'To push for better terms while keeping her options open', explanation = 'Elena praises the supplier''s past reliability, avoids stating any figures, and raises open tender only as a consequence ''if'' the current terms cannot be revisited — this is leverage, not a decision already taken. That rules out formally announcing non-renewal and ending the relationship, since her hedged conditional language and the agreement to reconvene show she is still negotiating. Asking the supplier to match the competitors'' prices is not stated either: she never discloses figures, so there is nothing specific to match.' where id = '2a64248c-d108-4ad6-a8df-7e603391d9b9';

-- 2a9574a1-8675-46dd-bb3f-3e4ffe133794  listening C2  key 51->40 chars, rank 4
update public.questions set options = '["There may not be time to attend it first", "The ten o''clock session has been cancelled", "The session has been moved to the afternoon", "The keynote will now start earlier than planned"]'::jsonb, correct_answer = 'There may not be time to attend it first' where id = '2a9574a1-8675-46dd-bb3f-3e4ffe133794';

-- 2dd2dbdb-7307-44a9-bf09-cbb799a02edc  listening C2  key 72->45 chars, rank 3
update public.questions set options = '["Finance has approved every pending hiring request", "Requests are being processed without any delay", "Hiring is blocked in practice, not officially", "Finance has issued a written ban on new hires"]'::jsonb, correct_answer = 'Hiring is blocked in practice, not officially' where id = '2dd2dbdb-7307-44a9-bf09-cbb799a02edc';

-- 302415c9-5588-419c-8563-88486dd7af0d  reading C1  key 57->43 chars, rank 2
update public.questions set options = '["Those with mobility needs or poor transport", "Senior managers and their direct reports", "Staff who arrive before 8am each day", "All staff, on a first-come, first-served basis"]'::jsonb, correct_answer = 'Those with mobility needs or poor transport' where id = '302415c9-5588-419c-8563-88486dd7af0d';

-- 3164ea20-2a5a-4668-b063-53eb8bfcf773  reading C2  key 68->50 chars, rank 1
update public.questions set options = '["Feedback said it put some staff off coming forward", "Line managers themselves asked for the removal", "Line managers were too slow to pass reports on", "External legal counsel ruled the practice unlawful"]'::jsonb, correct_answer = 'Feedback said it put some staff off coming forward' where id = '3164ea20-2a5a-4668-b063-53eb8bfcf773';

-- 345d5491-443c-4bac-9e4c-e8a027483577  listening C2  key 61->51 chars, rank 3
update public.questions set options = '["She has already handed in a written resignation letter", "She has been promoted and is moving to another office", "She is probably leaving, though nothing is official", "She is just tidying her desk for the spring clean"]'::jsonb, correct_answer = 'She is probably leaving, though nothing is official' where id = '345d5491-443c-4bac-9e4c-e8a027483577';

-- 35afcc3d-4232-406a-911e-94c62e55d727  reading C2  key 43->38 chars, rank 2
update public.questions set options = '["An understaffed and incompetent team", "A twenty percent drop in ticket volume", "Billing disputes needing finance input", "A faulty rollout of the new ticketing system"]'::jsonb, correct_answer = 'Billing disputes needing finance input' where id = '35afcc3d-4232-406a-911e-94c62e55d727';

-- 37167261-e86f-45c3-ae7e-5a7d3edc245b  reading C2  key 65->43 chars, rank 4
update public.questions set options = '["A compliance officer outside the department", "The employee''s own direct line manager, as before", "The external legal counsel consulted on the policy", "A panel of senior executives from head office"]'::jsonb, correct_answer = 'A compliance officer outside the department' where id = '37167261-e86f-45c3-ae7e-5a7d3edc245b';

-- 3a1b2f59-0a8f-403c-a2e5-1212807b6638  reading C1  key 53->51 chars, rank 2
update public.questions set options = '["Decision-making slowed when key members were absent", "Their overall productivity increased significantly", "Decision quality fell but the speed of decisions did not", "They were entirely unaffected by such absences"]'::jsonb, correct_answer = 'Decision-making slowed when key members were absent' where id = '3a1b2f59-0a8f-403c-a2e5-1212807b6638';

-- 3afca806-53b8-4642-80e0-2627790868d9  listening C1  key 11->21 chars, rank 4
update public.questions set options = '["The speaker''s company", "The client''s own staff", "The venue''s events team", "Nobody, the booking was dropped"]'::jsonb, correct_answer = 'The speaker''s company' where id = '3afca806-53b8-4642-80e0-2627790868d9';

-- 3afd854d-610a-4964-9b03-c300ad0e63c1  listening C2  key 102->47 chars, rank 4
update public.questions set options = '["He accepts each explanation as genuine and unrelated", "He is calling for the finance director''s dismissal", "He agrees the underlying Q3 trend is encouraging", "He hints the one-offs are one recurring problem"]'::jsonb, correct_answer = 'He hints the one-offs are one recurring problem' where id = '3afd854d-610a-4964-9b03-c300ad0e63c1';

-- 3bda217f-6d94-4af9-b705-fdb069b8c022  listening C1  key 42->39 chars, rank 2
update public.questions set options = '["A longer contract could mean a discount", "The renewal has already been discounted", "The manager has already refused a discount", "A one-year contract gets the best price"]'::jsonb, correct_answer = 'A longer contract could mean a discount' where id = '3bda217f-6d94-4af9-b705-fdb069b8c022';

-- 3da3290e-dc49-483c-815f-3b34ace3ed2c  listening C1  key 54->47 chars, rank 2
update public.questions set options = '["It will be hard to finish in the time available", "Her leave request was turned down by the manager", "No handover will be needed before she leaves", "Two weeks is more time than the handover needs"]'::jsonb, correct_answer = 'It will be hard to finish in the time available' where id = '3da3290e-dc49-483c-815f-3b34ace3ed2c';

-- 3ecb2253-2f85-4829-a6e3-1e391d8fd7d5  reading C1  key 63->50 chars, rank 3
update public.questions set options = '["It is advisory and does not alter the final rating", "It automatically determines 50% of the final rating", "It replaces the manager''s own assessment entirely", "It is used only for promotion decisions, not ratings"]'::jsonb, correct_answer = 'It is advisory and does not alter the final rating' where id = '3ecb2253-2f85-4829-a6e3-1e391d8fd7d5';

-- 3f32faa1-72e0-419f-8ff0-b90d3857cad4  reading C2  key 114->58 chars, rank 3
update public.questions set options = '["Only the question on handling disagreement drew no example", "The reference openly criticised the candidate''s performance", "The reference refused to answer most of the questions", "The reference contradicted information on the candidate''s CV"]'::jsonb, correct_answer = 'Only the question on handling disagreement drew no example' where id = '3f32faa1-72e0-419f-8ff0-b90d3857cad4';

-- 40ba03cd-c3ae-4eb2-8386-fd1ec7e1d79a  listening C2  key 124->58 chars, rank 2
update public.questions set options = '["She believes the communications head is acting in bad faith", "She concedes the point but insists legal risk still counts", "She rejects the communications head''s argument entirely", "She is threatening to take the disagreement to the CEO"]'::jsonb, correct_answer = 'She concedes the point but insists legal risk still counts' where id = '40ba03cd-c3ae-4eb2-8386-fd1ec7e1d79a';

-- 4120882b-5422-44c4-9684-abbe51682554  reading C1  key 54->47 chars, rank 2
update public.questions set options = '["That all companies adopt fully remote working", "That hybrid policies be applied uniformly everywhere", "More long-term research before policy overhauls", "Halting the study before the two-year mark"]'::jsonb, correct_answer = 'More long-term research before policy overhauls' where id = '4120882b-5422-44c4-9684-abbe51682554';

-- 420cf225-3cde-4928-834a-667a76d6b78e  listening C1  key 48->38 chars, rank 2
update public.questions set options = '["The client may no longer be interested", "The client has already confirmed the deal", "The client is away on holiday", "The proposal was rejected in writing"]'::jsonb, correct_answer = 'The client may no longer be interested' where id = '420cf225-3cde-4928-834a-667a76d6b78e';

-- 435a4489-e5a7-4c0e-855b-1604e891b8b2  listening C2  key 125->62 chars, rank 3
update public.questions set options = '["The speaker is criticising their own legal team for advising caution", "The speaker is admitting legal liability on behalf of the company", "The speaker is dropping corporate defensiveness to build trust", "The speaker believes a root cause analysis is unnecessary"]'::jsonb, correct_answer = 'The speaker is dropping corporate defensiveness to build trust' where id = '435a4489-e5a7-4c0e-855b-1604e891b8b2';

-- 44ccd5c9-9abf-4c2d-815c-e17a5572efde  reading C1  key 114->68 chars, rank 3
update public.questions set options = '["It used the planned event to build interest without promising access", "Marketing refused to communicate with customers about the delay at all", "The bug had already been fully fixed by the time the webinar was scheduled", "The company decided to launch immediately despite the bug"]'::jsonb, correct_answer = 'It used the planned event to build interest without promising access' where id = '44ccd5c9-9abf-4c2d-815c-e17a5572efde';

-- 453910d7-b32d-4b8a-961a-e6f25d3ba10f  reading C2  key 49->49 chars, rank 2
update public.questions set options = '["Newer hires trained only on the old manual system", "Dispatchers with the longest service at the company", "Senior management at the two regional depots", "Delivery drivers on the affected routes"]'::jsonb, correct_answer = 'Newer hires trained only on the old manual system' where id = '453910d7-b32d-4b8a-961a-e6f25d3ba10f';

-- 45b96713-3aaf-44d1-a0cb-e3d46f45bcbb  listening C1  key 57->45 chars, rank 2
update public.questions set options = '["Waiting for marketing''s input before deciding", "Finalising the roadmap before the deadline", "Cancelling the roadmap and the deadline", "Asking marketing to stay out of the roadmap decision"]'::jsonb, correct_answer = 'Waiting for marketing''s input before deciding' where id = '45b96713-3aaf-44d1-a0cb-e3d46f45bcbb';

-- 470f66b4-ac60-4128-86b5-6c76f720d086  reading C1  key 45->41 chars, rank 4
update public.questions set options = '["More seats active than licences purchased", "Fewer than half its licences have been used", "Licences left unrenewed past the expiry date", "Cloud tools bought outside central procurement"]'::jsonb, correct_answer = 'More seats active than licences purchased' where id = '470f66b4-ac60-4128-86b5-6c76f720d086';

-- 4a93534c-b36d-424a-b824-53f46bc29a66  reading C2  key 86->51 chars, rank 2
update public.questions set options = '["It was paused, then approved for renewed investment", "It has been cancelled permanently by the board", "It was never affected by the supply chain disruptions", "It was completed ahead of the original schedule"]'::jsonb, correct_answer = 'It was paused, then approved for renewed investment' where id = '4a93534c-b36d-424a-b824-53f46bc29a66';

-- 4b3ecf15-2dd0-4dbe-9c72-152e3b194fa7  listening C1  key 86->51 chars, rank 2
update public.questions set options = '["A small per-unit price cut for a five-year contract", "An immediate switch to a lower-quality product line", "A full price match with the competing vendors'' quotes", "A one-year trial period before renegotiating terms"]'::jsonb, correct_answer = 'A small per-unit price cut for a five-year contract' where id = '4b3ecf15-2dd0-4dbe-9c72-152e3b194fa7';

-- 4c1daa6e-d9c8-4812-89f1-8547c2a803a9  reading C1  key 77->48 chars, rank 4
update public.questions set options = '["Because PaySure did not fix the recurring errors", "Because Meridian offered a significantly lower fee", "Because staff had requested the change repeatedly", "Because international payments were being delayed"]'::jsonb, correct_answer = 'Because PaySure did not fix the recurring errors' where id = '4c1daa6e-d9c8-4812-89f1-8547c2a803a9';

-- 4dd42f31-17b4-4277-bdc5-2beda24963e0  reading C1  key 70->53 chars, rank 3
update public.questions set options = '["They value customer trust above the original deadline", "They believe speed of release matters more than reliability", "They think customers will not notice minor bugs", "They regret delaying and wish they had launched anyway"]'::jsonb, correct_answer = 'They value customer trust above the original deadline' where id = '4dd42f31-17b4-4277-bdc5-2beda24963e0';

-- 50c9cd02-8e68-4d58-91f1-4633cec55503  reading C2  key 110->54 chars, rank 3
update public.questions set options = '["The relationship had thinned until only price was left", "Halden''s procurement contact left during the final year", "The invoicing team made repeated errors on Halden''s account", "The competitor''s price was far too low to be matched"]'::jsonb, correct_answer = 'The relationship had thinned until only price was left', explanation = 'This connects several details: check-ins had grown "shorter and more transactional," the contact had "stopped hearing from anyone beyond the invoicing team," and the account lead''s closing point that "stable and forgotten can look identical... until a competitor calls with a lower number." The competitor''s rate was only "marginally lower," and no billing errors or contact departure are mentioned.' where id = '50c9cd02-8e68-4d58-91f1-4633cec55503';

-- 50f72a10-9142-4703-ae92-61f1130920bb  listening C1  key 95->46 chars, rank 4
update public.questions set options = '["That job cuts are possible but not yet decided", "That he has guaranteed no one will lose their job", "That affected staff have already been notified of cuts", "That the merger will not affect staffing at all"]'::jsonb, correct_answer = 'That job cuts are possible but not yet decided' where id = '50f72a10-9142-4703-ae92-61f1130920bb';

-- 52310710-6124-4ad6-a1ec-edd39bb3d92a  listening C1  key 44->39 chars, rank 2
update public.questions set options = '["The CEO''s absence probably means little", "The CEO is planning to resign soon", "The call was cancelled because of the CEO", "The CEO''s absence is a serious problem"]'::jsonb, correct_answer = 'The CEO''s absence probably means little' where id = '52310710-6124-4ad6-a1ec-edd39bb3d92a';

-- 574f0fc5-aa9b-4163-92ff-d6c4c8f7eedc  listening C1  key 99->53 chars, rank 3
update public.questions set options = '["She thinks the account is still at risk until renewal", "Company policy requires a check-in call after every complaint", "She wants to sell the client additional services this quarter", "The client asked for a follow-up during the call"]'::jsonb, correct_answer = 'She thinks the account is still at risk until renewal' where id = '574f0fc5-aa9b-4163-92ff-d6c4c8f7eedc';

-- 58d88969-bb10-4471-915e-50a349baf479  reading C1  key 47->43 chars, rank 2
update public.questions set options = '["Genuine interest, with no experience needed", "Written approval from your line manager", "At least two years'' service in the company", "Completion of the unconscious bias training first"]'::jsonb, correct_answer = 'Genuine interest, with no experience needed' where id = '58d88969-bb10-4471-915e-50a349baf479';

-- 59cbb9e3-1670-4eba-b409-9c3dab4c2efc  listening C2  key 117->67 chars, rank 2
update public.questions set options = '["He is satisfied with the explanation and considers the matter closed", "He is backing the operations lead and warning investors will notice", "He is asking to postpone the Friday variance analysis indefinitely", "He is defending the finance director against the operations lead"]'::jsonb, correct_answer = 'He is backing the operations lead and warning investors will notice' where id = '59cbb9e3-1670-4eba-b409-9c3dab4c2efc';

-- 5b7e81ba-c3db-4b3d-8d6c-31d68ad32b3a  reading C1  key 47->40 chars, rank 2
update public.questions set options = '["Before leaving the office on 27 February", "By the relocation date of 3 March", "After the move to Riverside Business Park", "Any time before the end of March"]'::jsonb, correct_answer = 'Before leaving the office on 27 February' where id = '5b7e81ba-c3db-4b3d-8d6c-31d68ad32b3a';

-- 5ce9d5a0-8276-4bfb-9be2-eb106ebfeaf8  listening C1  key 77->57 chars, rank 4
update public.questions set options = '["To signal that they are prepared to accept the current terms", "To keep the tone constructive while holding firm on terms", "To indicate that the financial points are not actually important", "To pressure the other side into making immediate concessions"]'::jsonb, correct_answer = 'To keep the tone constructive while holding firm on terms' where id = '5ce9d5a0-8276-4bfb-9be2-eb106ebfeaf8';

-- 5db3cb19-3057-41d3-b0a2-cf9a5312d508  reading C2  key 42->42 chars, rank 3
update public.questions set options = '["They have held steady or improved slightly", "They declined sharply across the quarter", "They cannot be separated from billing complaints", "They doubled compared with the previous quarter"]'::jsonb, correct_answer = 'They have held steady or improved slightly' where id = '5db3cb19-3057-41d3-b0a2-cf9a5312d508';

-- 5e093b8a-2d78-4e94-83b3-20c5d81a402a  listening C2  key 41->41 chars, rank 3
update public.questions set options = '["A limited set of customer payment card details", "Internal employee salary and payroll records", "A limited set of customer email addresses", "Portions of the company''s source code"]'::jsonb, correct_answer = 'A limited set of customer email addresses' where id = '5e093b8a-2d78-4e94-83b3-20c5d81a402a';

-- 5e60dad7-0c1e-4225-b09b-06ec5aea4518  reading C2  key 100->63 chars, rank 2
update public.questions set options = '["That an account looking settled doesn''t mean upkeep is unneeded", "That all client relationships should be reviewed weekly instead of quarterly", "That pricing is the only factor worth monitoring going forward", "That the operations director''s view was rejected entirely"]'::jsonb, correct_answer = 'That an account looking settled doesn''t mean upkeep is unneeded' where id = '5e60dad7-0c1e-4225-b09b-06ec5aea4518';

-- 62a5c2f3-1d17-4fcd-a9bd-afb04a690a3e  listening C2  key 103->61 chars, rank 2
update public.questions set options = '["A personal conflict between the lead negotiators on both sides", "A struggle over future market power, not just licensing terms", "Uncertainty over whether the three patent families are valid", "A dispute over which company invented the technology first"]'::jsonb, correct_answer = 'A struggle over future market power, not just licensing terms' where id = '62a5c2f3-1d17-4fcd-a9bd-afb04a690a3e';

-- 6388161b-b453-4044-9f9d-e8e8a5d2597f  listening C2  key 33->33 chars, rank 4
update public.questions set options = '["They have already fallen short of target", "They are guaranteed to hit the target", "They are comfortably ahead of target", "They are close to missing targets"]'::jsonb, correct_answer = 'They are close to missing targets' where id = '6388161b-b453-4044-9f9d-e8e8a5d2597f';

-- 64f190bf-37e1-4053-b724-691a4c72b433  listening C1  key 74->57 chars, rank 4
update public.questions set options = '["Hiring an external consulting firm to manage the entire project", "Setting up a change management office staffed from within", "Delaying the transformation until employee satisfaction improves", "Replacing managers who are resistant to the new technology"]'::jsonb, correct_answer = 'Setting up a change management office staffed from within' where id = '64f190bf-37e1-4053-b724-691a4c72b433';

-- 65116b69-8eed-41c2-a5c8-25771639f0ba  listening C1  key 39->39 chars, rank 2
update public.questions set options = '["Management is keeping the details quiet", "The announcement has been cancelled altogether", "Everyone already knows the details", "It was already announced last week"]'::jsonb, correct_answer = 'Management is keeping the details quiet' where id = '65116b69-8eed-41c2-a5c8-25771639f0ba';

-- 65b224cc-c2bb-4fbc-ac78-9340aae0bde5  reading C2  key 80->57 chars, rank 2
update public.questions set options = '["It prefers candour about shortfalls to a flattering image", "It intends to stop publishing sustainability reports after this year", "It believes none of its remaining targets are achievable", "It wants to avoid ever discussing missed targets again"]'::jsonb, correct_answer = 'It prefers candour about shortfalls to a flattering image' where id = '65b224cc-c2bb-4fbc-ac78-9340aae0bde5';

-- 65fd9830-400c-4a5d-b4be-aab2891166bc  listening C2  key 130->56 chars, rank 3
update public.questions set options = '["The general counsel''s view prevailed and disclosure was delayed", "The company chose not to inform customers about the incident", "Each concern was partly met: prompt notice, legal review", "The communications head''s view prevailed entirely"]'::jsonb, correct_answer = 'Each concern was partly met: prompt notice, legal review' where id = '65fd9830-400c-4a5d-b4be-aab2891166bc';

-- 667f81a6-6f27-44c7-b3f7-06450151c4b3  reading C1  key 61->46 chars, rank 2
update public.questions set options = '["It runs separately from the existing programme", "It replaces the existing programme entirely", "It is identical to the existing programme", "It is open only to managers taking bias training"]'::jsonb, correct_answer = 'It runs separately from the existing programme' where id = '667f81a6-6f27-44c7-b3f7-06450151c4b3';

-- 670895d0-307b-4582-ae85-df67fea785e4  listening C2  key 145->70 chars, rank 3
update public.questions set options = '["Load-bearing elements are written policies while habits are unwritten rules", "There is no real difference; the speaker uses both terms interchangeably", "Load-bearing elements are essential; habits reflect one person''s style", "Load-bearing elements are profitable while habits are costly"]'::jsonb, correct_answer = 'Load-bearing elements are essential; habits reflect one person''s style' where id = '670895d0-307b-4582-ae85-df67fea785e4';

-- 688cd28f-b506-4de7-a608-0cde2ca4c955  listening C1  key 36->36 chars, rank 3
update public.questions set options = '["They kept their real position hidden", "They revealed their lowest acceptable price", "They walked away from the deal", "They agreed to every one of our demands"]'::jsonb, correct_answer = 'They kept their real position hidden' where id = '688cd28f-b506-4de7-a608-0cde2ca4c955';

-- 68d2d15e-f7b7-4990-bba6-d4ba6a7cb093  reading C2  key 66->49 chars, rank 3
update public.questions set options = '["The claim that front-line performance has slipped", "The decision to introduce the new ticketing system", "The proposal to invest in a finance handoff mechanism", "The twenty percent rise in ticket volume"]'::jsonb, correct_answer = 'The claim that front-line performance has slipped' where id = '68d2d15e-f7b7-4990-bba6-d4ba6a7cb093';

-- 6920837d-bcec-48c0-9134-5e01eaba69ab  listening C2  key 108->60 chars, rank 3
update public.questions set options = '["Indifferent, leaving the decision entirely to the executive committee", "Interested but wanting more information before forming an opinion", "Firmly opposed, seeing it as crossing into misrepresentation", "Cautiously supportive if the methodology is disclosed"]'::jsonb, correct_answer = 'Firmly opposed, seeing it as crossing into misrepresentation' where id = '6920837d-bcec-48c0-9134-5e01eaba69ab';

-- 69babc9a-00ef-4667-8bdd-90a43a54ae06  listening C2  key 43->35 chars, rank 4
update public.questions set options = '["The new figure is still a complete non-starter", "The new figure is worse than the last offer", "The new figure is far too high to consider", "The new figure is nearly acceptable"]'::jsonb, correct_answer = 'The new figure is nearly acceptable' where id = '69babc9a-00ef-4667-8bdd-90a43a54ae06';

-- 6c55efda-953e-4c13-84ae-cc19d7b93bb4  reading C1  key 46->40 chars, rank 2
update public.questions set options = '["Yes, several sales roles will be cut", "No, not as a direct result of the change", "Only the regional director''s post will go", "The email does not address eliminations"]'::jsonb, correct_answer = 'No, not as a direct result of the change' where id = '6c55efda-953e-4c13-84ae-cc19d7b93bb4';

-- 7765a062-4a54-445b-9790-45f98abad3fa  reading C1  key 56->39 chars, rank 4
update public.questions set options = '["Her research on supply chain resilience", "Her role as chair of the organising committee", "Her attendance at last November''s summit", "Her large social media following in the sector"]'::jsonb, correct_answer = 'Her research on supply chain resilience' where id = '7765a062-4a54-445b-9790-45f98abad3fa';

-- 77ec1a87-ac89-4691-8e40-97ce7b028f8e  reading C2  key 52->47 chars, rank 3
update public.questions set options = '["As the price of certainty in a softening market", "As an error of judgement that the board pushed for", "As Halden''s final demand in the third round of talks", "As having nothing to do with market conditions"]'::jsonb, correct_answer = 'As the price of certainty in a softening market' where id = '77ec1a87-ac89-4691-8e40-97ce7b028f8e';

-- 783dc8a3-6cfe-421c-b8cd-412bc2b0052f  listening C2  key 58->47 chars, rank 3
update public.questions set options = '["The supplier has confirmed it will end the contract", "The supplier is entirely satisfied with the deal", "The supplier is probably unhappy with the terms", "The supplier''s emails have not changed in tone"]'::jsonb, correct_answer = 'The supplier is probably unhappy with the terms' where id = '783dc8a3-6cfe-421c-b8cd-412bc2b0052f';

-- 788b87ec-1716-4410-85ab-340f5dcc08cf  reading C2  key 68->50 chars, rank 4
update public.questions set options = '["No — the breakdown was procedural, not intentional", "Yes, formal action against all three regional managers", "Yes, but only in the two offices that skipped tender", "The summary does not mention disciplinary action at all"]'::jsonb, correct_answer = 'No — the breakdown was procedural, not intentional' where id = '788b87ec-1716-4410-85ab-340f5dcc08cf';

-- 7bcd9dda-2931-419f-92dc-18392529afeb  listening C2  key 50->50 chars, rank 4
update public.questions set options = '["Honestly, with no exaggeration in either direction", "Painted more brightly than the actual figures warrant", "Painted more bleakly than the actual figures warrant", "Omitted from the report and raised verbally instead"]'::jsonb, correct_answer = 'Honestly, with no exaggeration in either direction' where id = '7bcd9dda-2931-419f-92dc-18392529afeb';

-- 7d411ace-6923-4865-a1ee-7f3bceac8e47  reading C2  key 107->62 chars, rank 3
update public.questions set options = '["Each transaction was within limits; only pooled data showed it", "The suppliers concealed their invoices from the auditors", "The audit team was denied access to two of the three offices'' data", "Regional managers deliberately concealed the renewals from audit"]'::jsonb, correct_answer = 'Each transaction was within limits; only pooled data showed it' where id = '7d411ace-6923-4865-a1ee-7f3bceac8e47';

-- 7e891e98-f1ad-429d-b46b-3a10e9f70e5b  listening C2  key 84->53 chars, rank 3
update public.questions set options = '["It formally apologises for a mistake her own team made", "It cushions the serious concern she is about to raise", "It signals that negotiations are being terminated", "It flatters the seller''s representative before bargaining"]'::jsonb, correct_answer = 'It cushions the serious concern she is about to raise' where id = '7e891e98-f1ad-429d-b46b-3a10e9f70e5b';

-- 7eead99e-457b-4877-820e-155a62794d34  reading C1  key 74->50 chars, rank 3
update public.questions set options = '["More collaborative space, slightly less desk space", "The new office is worse in every respect than the old", "Desk space and collaborative space have both increased", "Everything has improved, with no trade-off at all"]'::jsonb, correct_answer = 'More collaborative space, slightly less desk space' where id = '7eead99e-457b-4877-820e-155a62794d34';

-- 7f51ec09-f7a2-41c8-b0d1-c62be2e7016f  listening C2  key 58->42 chars, rank 3
update public.questions set options = '["It has been cancelled and the room released", "It is more serious than a routine catch-up", "It is open to any staff who wish to attend", "It was arranged weeks ago as a regular fixture"]'::jsonb, correct_answer = 'It is more serious than a routine catch-up' where id = '7f51ec09-f7a2-41c8-b0d1-c62be2e7016f';

-- 7fdebfcf-920e-40fb-bac4-a7da5f0c71e0  listening C1  key 38->38 chars, rank 2
update public.questions set options = '["Get the car fixed and send the receipt", "Pay for the damage in cash immediately", "Report the incident to the insurer first", "Return the car without repairing it"]'::jsonb, correct_answer = 'Get the car fixed and send the receipt' where id = '7fdebfcf-920e-40fb-bac4-a7da5f0c71e0';

-- 85076a16-5792-43a9-8477-ca86cb0c4dc7  listening C2  key 170->51 chars, rank 3
update public.questions set options = '["Preparing a legal case against the company''s directors", "Rehearsing wording for an upcoming investor briefing", "Placing their position on record for later scrutiny", "Displaying their command of precise legal language"]'::jsonb, correct_answer = 'Placing their position on record for later scrutiny', explanation = '"For the record" plus the stated suspicion that the conversation "may be revisited" shows the speaker is documenting their position in case the matter is later investigated or disputed, which matters most for their refusal to endorse the undisclosed-modelling path. They are protecting themselves professionally, not preparing litigation, rehearsing, or showing off.' where id = '85076a16-5792-43a9-8477-ca86cb0c4dc7';

-- 861bb6fb-1b44-46e8-8a8d-0804e1529332  listening C2  key 151->58 chars, rank 2
update public.questions set options = '["Because the escrow holdback has no bearing on the purchase price", "Because it proposes a de facto price cut without saying so", "Because she made an error and is trying to disguise it", "Because the seller''s representative dictated that wording"]'::jsonb, correct_answer = 'Because it proposes a de facto price cut without saying so', explanation = 'She proposes the escrow specifically ''rather than a straightforward reduction in the headline price'', so it achieves a similar financial effect (money withheld pending the litigation''s outcome) while letting both sides avoid the words ''price cut'', which is why he had asked ''somewhat pointedly'' whether renegotiation was under way. That rules out the escrow having no bearing on price; nothing indicates an error, and he did not dictate her wording, he calls the structure ''not his first preference''.' where id = '861bb6fb-1b44-46e8-8a8d-0804e1529332';

-- 87708213-1b6e-47e9-b730-897af97be811  listening C1  key 21->21 chars, rank 2
update public.questions set options = '["The delivery timeline", "The unit price", "The payment method", "The length of the contract"]'::jsonb, correct_answer = 'The delivery timeline' where id = '87708213-1b6e-47e9-b730-897af97be811';

-- 88c73d7e-ed46-44b9-98d1-bc66c6ad95fc  reading C1  key 97->48 chars, rank 3
update public.questions set options = '["Managers relying only on their latest impression", "Employees receiving no feedback under the old model", "Peer feedback previously being compulsory for all", "Bonuses and promotions being decided too often"]'::jsonb, correct_answer = 'Managers relying only on their latest impression' where id = '88c73d7e-ed46-44b9-98d1-bc66c6ad95fc';

-- 892d746d-8678-4645-943a-fa545fc6ea3e  listening C2  key 161->70 chars, rank 3
update public.questions set options = '["To exaggerate the problem and deepen the client''s dependency on his firm", "To show his remedy addresses the regulatory threat, not just the fault", "To frighten the client into accepting the first offer without negotiating", "To blame the FDA for imposing unreasonable audit requirements"]'::jsonb, correct_answer = 'To show his remedy addresses the regulatory threat, not just the fault', explanation = 'Framing the issue as FDA compliance and regulatory standing rather than mere technical malfunction shows awareness of the pharmaceutical context, and positions the proposed remediation, including the audit trail the client can submit to the FDA, as addressing the highest-stakes dimension rather than only the corrupted records. The speaker is not exaggerating, pressuring, or blaming the FDA.' where id = '892d746d-8678-4645-943a-fa545fc6ea3e';

-- 8aa784ee-2019-4dc0-b9c4-5ac7c6340c28  listening C2  key 40->49 chars, rank 2
update public.questions set options = '["It still requires the same data to be entered twice", "It is slower for anything outside the basic tasks", "It has been badly received by all users so far", "No feedback has been collected from users yet"]'::jsonb, correct_answer = 'It is slower for anything outside the basic tasks' where id = '8aa784ee-2019-4dc0-b9c4-5ac7c6340c28';

-- 8ba9ed12-5e5a-4813-acaf-fc155bf113dd  reading C1  key 50->41 chars, rank 3
update public.questions set options = '["Staff paid by international bank transfer", "All staff, regardless of payment method", "Staff who submitted an updated payroll form", "Staff who were previously employed by PaySure Ltd"]'::jsonb, correct_answer = 'Staff paid by international bank transfer' where id = '8ba9ed12-5e5a-4813-acaf-fc155bf113dd';

-- 8c13a6b7-e176-4804-a47b-cb6a63ee4bf3  reading C1  key 105->53 chars, rank 2
update public.questions set options = '["They prefer a small, targeted fix to a wider overhaul", "They plan to scrap the new onboarding process entirely", "They believe the feedback did not merit action", "They will repeat the administrative session daily"]'::jsonb, correct_answer = 'They prefer a small, targeted fix to a wider overhaul' where id = '8c13a6b7-e176-4804-a47b-cb6a63ee4bf3';

-- 8d72e282-76d8-4ac9-8e09-7b01a916438d  reading C2  key 60->57 chars, rank 2
update public.questions set options = '["A failed overnight update corrupting a configuration file", "A power cut at the data centre during the overnight window", "A cyberattack that targeted the staff directory server", "Scheduled maintenance that overran into working hours"]'::jsonb, correct_answer = 'A failed overnight update corrupting a configuration file' where id = '8d72e282-76d8-4ac9-8e09-7b01a916438d';

-- 8e047a4f-0d79-48bd-b58c-5dfeadccde08  reading C1  key 110->54 chars, rank 2
update public.questions set options = '["Spreading themed content over two weeks with check-ins", "Removing manager check-ins from the onboarding process", "Compressing onboarding into a single half-day session", "Replacing all onboarding with self-guided online modules"]'::jsonb, correct_answer = 'Spreading themed content over two weeks with check-ins' where id = '8e047a4f-0d79-48bd-b58c-5dfeadccde08';

-- 90778703-7012-4d8f-bf04-0a0281fe2b03  reading C1  key 84->52 chars, rank 3
update public.questions set options = '["Policy should vary by task type, not apply uniformly", "Hybrid work should be abandoned over collaboration losses", "All teams should switch to fully remote work immediately", "The productivity differences are too small to matter"]'::jsonb, correct_answer = 'Policy should vary by task type, not apply uniformly' where id = '90778703-7012-4d8f-bf04-0a0281fe2b03';

-- 93c72a29-b7ce-4960-8cd0-b04fa0c39031  reading C2  key 48->48 chars, rank 4
update public.questions set options = '["Retain 80% of staff for at least eighteen months", "Retain all current staff permanently, with no time limit", "Cut the workforce by 80% over the next eighteen months", "Make no binding commitment about staff numbers at all"]'::jsonb, correct_answer = 'Retain 80% of staff for at least eighteen months' where id = '93c72a29-b7ce-4960-8cd0-b04fa0c39031';

-- 99018781-52ba-4df6-9685-fc498eb63b2a  listening C1  key 61->47 chars, rank 3
update public.questions set options = '["It contained factual errors about the breach", "It prioritised legal cover over genuine empathy", "It was too informal and lacked necessary legal disclaimers", "It failed to mention the GDPR notification requirements"]'::jsonb, correct_answer = 'It prioritised legal cover over genuine empathy' where id = '99018781-52ba-4df6-9685-fc498eb63b2a';

-- 9a5d351c-5076-4adf-a82e-d75a7e4ee43c  reading C1  key 79->49 chars, rank 3
update public.questions set options = '["It appears tighter, as no speaking fee is offered", "It has grown, funding accommodation for the first time", "It has no bearing on whether speakers receive a fee", "It still covers fees, accommodation and travel"]'::jsonb, correct_answer = 'It appears tighter, as no speaking fee is offered' where id = '9a5d351c-5076-4adf-a82e-d75a7e4ee43c';

-- 9aa89ceb-2e11-417f-bfe9-7cd16165ab37  listening C1  key 39->39 chars, rank 2
update public.questions set options = '["Asked to speak to the director directly", "Cancelled the contract with immediate effect", "Filed a formal complaint in writing", "Asked for a refund of the last invoice"]'::jsonb, correct_answer = 'Asked to speak to the director directly' where id = '9aa89ceb-2e11-417f-bfe9-7cd16165ab37';

-- 9b792bae-e9f8-44d4-9387-8cbaeed44592  reading C1  key 69->44 chars, rank 4
update public.questions set options = '["Some disruption or inconvenience is expected", "Staff will be completely unaffected by the change", "The company expects nobody to notice the switch", "The company is sure there will be no delays at all"]'::jsonb, correct_answer = 'Some disruption or inconvenience is expected' where id = '9b792bae-e9f8-44d4-9387-8cbaeed44592';

-- 9f5dc91d-5f41-47f7-890b-88dd91237ec8  reading C1  key 49->42 chars, rank 3
update public.questions set options = '["Review allocations and request adjustments", "Cancel all software subscriptions immediately", "Attend next month''s leadership meeting", "Purchase 12 additional licences before the audit"]'::jsonb, correct_answer = 'Review allocations and request adjustments' where id = '9f5dc91d-5f41-47f7-890b-88dd91237ec8';

-- 9f69deb1-0f5d-4c6f-baeb-5d56c320e76e  reading C2  key 108->64 chars, rank 2
update public.questions set options = '["It flags a real risk that Priya is over-reading one vague answer", "It confirms that the candidate should be rejected immediately", "It proves the reference was lying throughout the whole call", "It shows the panel member has already decided to hire the candidate"]'::jsonb, correct_answer = 'It flags a real risk that Priya is over-reading one vague answer' where id = '9f69deb1-0f5d-4c6f-baeb-5d56c320e76e';

-- a0068f8e-d58a-4f57-91c4-9572b61950bd  listening C1  key 49->42 chars, rank 4
update public.questions set options = '["It has not yet been identified by the security team", "It is patched, but a wider audit continues", "It is being actively exploited by the attackers", "It will be patched within seventy-two hours"]'::jsonb, correct_answer = 'It is patched, but a wider audit continues' where id = 'a0068f8e-d58a-4f57-91c4-9572b61950bd';

-- a1936232-0561-43a7-ba2b-778480fafe07  listening C2  key 90->58 chars, rank 3
update public.questions set options = '["Fully supportive, since it best protects the company''s reputation", "Supportive in principle but worried about the legal exposure", "Dismissive, seeing it as an easy but irresponsible way out", "Neutral, presenting it as equal in merit to remediation"]'::jsonb, correct_answer = 'Dismissive, seeing it as an easy but irresponsible way out' where id = 'a1936232-0561-43a7-ba2b-778480fafe07';

-- a3546e0a-7ac5-4919-849d-c17de1ea9e35  listening C1  key 165->69 chars, rank 3
update public.questions set options = '["Elena lacks unilateral authority, so the supplier can still hold firm", "Elena outranks the supplier''s representative and is merely being polite", "The supplier''s representative must also consult his own superiors", "Elena is stalling because she has already decided to reject the compromise"]'::jsonb, correct_answer = 'Elena lacks unilateral authority, so the supplier can still hold firm' where id = 'a3546e0a-7ac5-4919-849d-c17de1ea9e35';

-- a911585f-a447-4cd3-a085-1b2b6c026c68  listening C1  key 95->68 chars, rank 3
update public.questions set options = '["The expansion budget has not yet been approved by the board", "Proper due diligence, hiring and licensing cannot fit that timeframe", "The competitor in Thailand has announced a major product launch in Q2", "The legal team has recommended waiting until new regulations take effect"]'::jsonb, correct_answer = 'Proper due diligence, hiring and licensing cannot fit that timeframe' where id = 'a911585f-a447-4cd3-a085-1b2b6c026c68';

-- aad68e76-c484-4b94-bfec-01c2a8637def  listening C1  key 44->43 chars, rank 3
update public.questions set options = '["Fit in a call with the client before Friday", "Cancel the scheduled call with the client altogether", "Wait until after Friday to contact the client", "Reschedule the call for early next month"]'::jsonb, correct_answer = 'Fit in a call with the client before Friday' where id = 'aad68e76-c484-4b94-bfec-01c2a8637def';

-- ac39de78-4d1d-46e2-9fff-3b8aad10dee5  listening C2  key 78->53 chars, rank 2
update public.questions set options = '["She is being maximally precise and technically accurate", "She is using euphemism to blunt the force of bad news", "She is fully endorsing the chief executive''s reading", "She has misunderstood the underlying financial data"]'::jsonb, correct_answer = 'She is using euphemism to blunt the force of bad news' where id = 'ac39de78-4d1d-46e2-9fff-3b8aad10dee5';

-- aeddfc89-8874-479f-b8a2-bed39e8654ca  listening C2  key 30->30 chars, rank 3
update public.questions set options = '["Refuse to take the matter any further", "Fix the underlying problem instantly", "Send a replacement by tomorrow", "Do nothing beyond apologising"]'::jsonb, correct_answer = 'Send a replacement by tomorrow' where id = 'aeddfc89-8874-479f-b8a2-bed39e8654ca';

-- b03c2ac0-d402-4ea0-9c92-a531e6c092f9  listening C2  key 94->46 chars, rank 4
update public.questions set options = '["To argue that competitors are overtaking them in every area", "To suggest they should acquire Vanguard Apparel outright", "To criticise Vanguard Apparel''s own ethical record", "To cite a precedent where remediation paid off"]'::jsonb, correct_answer = 'To cite a precedent where remediation paid off' where id = 'b03c2ac0-d402-4ea0-9c92-a531e6c092f9';

-- b2bf0401-df03-49d5-a867-81e468ce1906  reading C1  key 75->50 chars, rank 3
update public.questions set options = '["The writer anticipates anxiety and reassures staff", "The writer dismisses staff concerns as unfounded", "The writer is unaware that changes might worry staff", "The writer resents having to make this announcement"]'::jsonb, correct_answer = 'The writer anticipates anxiety and reassures staff' where id = 'b2bf0401-df03-49d5-a867-81e468ce1906';

-- b301e98b-5fce-4053-a290-43dfd6274727  reading C1  key 49->46 chars, rank 2
update public.questions set options = '["Claims over £500 still need a manual signature", "The mobile app cannot scan receipts at all", "The support channel is not available on the intranet", "The 45-minute training sessions are too short"]'::jsonb, correct_answer = 'Claims over £500 still need a manual signature' where id = 'b301e98b-5fce-4053-a290-43dfd6274727';

-- b538a39d-f06e-44a7-a2b6-5277e94fc069  reading C2  key 95->64 chars, rank 2
update public.questions set options = '["The alerting system had a real blind spot, caught only by chance", "Finance is formally responsible for monitoring server infrastructure", "The on-call engineer received the alert and ignored it", "IT deliberately disabled monitoring during the overnight update"]'::jsonb, correct_answer = 'The alerting system had a real blind spot, caught only by chance' where id = 'b538a39d-f06e-44a7-a2b6-5277e94fc069';

-- b790da58-0980-48b3-adc7-2ac37662bbf6  listening C2  key 131->64 chars, rank 1
update public.questions set options = '["Margaret''s opinion no longer matters, since she is stepping back", "Margaret''s presence may bias the board towards a continuity hire", "Margaret should be excluded from all future board meetings", "Margaret should have sole authority over the selection"]'::jsonb, correct_answer = 'Margaret''s presence may bias the board towards a continuity hire' where id = 'b790da58-0980-48b3-adc7-2ac37662bbf6';

-- bd49e056-729d-4d53-8e4b-30e4189afee3  listening C2  key 78->55 chars, rank 2
update public.questions set options = '["A company restructuring was officially announced this week", "Something significant may be under way, but unconfirmed", "All three meetings were cancelled at short notice", "The top floor is being renovated for new offices"]'::jsonb, correct_answer = 'Something significant may be under way, but unconfirmed' where id = 'bd49e056-729d-4d53-8e4b-30e4189afee3';

-- bdb58297-98af-4809-96b2-173917179d8f  reading C2  key 76->53 chars, rank 2
update public.questions set options = '["Client communication plus a temporary layout rollback", "Immediate cancellation of the new billing system entirely", "No action until the follow-up review next quarter", "A full refund to every client who lodged a complaint"]'::jsonb, correct_answer = 'Client communication plus a temporary layout rollback' where id = 'bdb58297-98af-4809-96b2-173917179d8f';

-- be4e40a1-b6c9-4cd1-9b91-5f4d09be652f  listening C2  key 51->41 chars, rank 2
update public.questions set options = '["The client demanded a different account manager", "It has stalled and needs a fresh approach", "The account has been closed down entirely", "Dan asked to be taken off the account"]'::jsonb, correct_answer = 'It has stalled and needs a fresh approach' where id = 'be4e40a1-b6c9-4cd1-9b91-5f4d09be652f';

-- c148dbe7-bd53-40a0-9ce4-172bf4907d9c  listening C1  key 72->58 chars, rank 3
update public.questions set options = '["Complaints from senior management about remote working arrangements", "Weaker collaboration and poorer integration of new joiners", "A significant drop in individual employee productivity", "Industry benchmarks showing competitors returning to offices"]'::jsonb, correct_answer = 'Weaker collaboration and poorer integration of new joiners' where id = 'c148dbe7-bd53-40a0-9ce4-172bf4907d9c';

-- c2f563c0-54bb-411a-aa50-eee5a9d35cd6  listening C1  key 55->45 chars, rank 3
update public.questions set options = '["So New York colleagues avoid a pre-dawn start", "Because the speaker is away on holiday that day", "Because the client has cancelled the original call", "Because of a system outage that morning"]'::jsonb, correct_answer = 'So New York colleagues avoid a pre-dawn start' where id = 'c2f563c0-54bb-411a-aa50-eee5a9d35cd6';

-- c4b3573b-c2d3-4c2e-8e29-79fecffc9561  listening C1  key 32->32 chars, rank 4
update public.questions set options = '["Giving the issue higher priority", "Fixing the problem before the end of the day", "Refusing to take the matter further", "Transferring the call to another team"]'::jsonb, correct_answer = 'Giving the issue higher priority' where id = 'c4b3573b-c2d3-4c2e-8e29-79fecffc9561';

-- c6b15e53-6887-4b4d-869e-501e709401b3  listening C1  key 52->45 chars, rank 2
update public.questions set options = '["It was twelve hours over the contractual SLA", "It was nearly double the twenty-four-hour SLA", "It was roughly triple the contractual SLA", "It exceeded the SLA by exactly forty-seven hours"]'::jsonb, correct_answer = 'It was nearly double the twenty-four-hour SLA' where id = 'c6b15e53-6887-4b4d-869e-501e709401b3';

-- cc9306db-2c6c-4220-9190-d6bc8520337f  reading C2  key 36->36 chars, rank 4
update public.questions set options = '["A move from fixed to rotating shifts", "A pay review for all Logistics division staff", "A reduction in warehouse opening hours", "A new exit interview process for leavers"]'::jsonb, correct_answer = 'A move from fixed to rotating shifts' where id = 'cc9306db-2c6c-4220-9190-d6bc8520337f';

-- cdec41cd-c29f-45ef-98b4-b602b07cd4ab  listening C1  key 77->55 chars, rank 3
update public.questions set options = '["It is fair compensation for their local marketing investment", "It would leave them unprofitable for nearly three years", "It is the sole remaining obstacle to signing the deal", "It was more generous in the previous version of the terms"]'::jsonb, correct_answer = 'It would leave them unprofitable for nearly three years' where id = 'cdec41cd-c29f-45ef-98b4-b602b07cd4ab';

-- cea48450-5e83-431d-ae80-0d58ac55b94e  listening C1  key 110->54 chars, rank 4
update public.questions set options = '["He finds logistics easier to discuss than job security", "He was poorly prepared and grew confident only by chance", "He disagrees with the merger and signals it through tone", "He thinks staffing matters less than the ticketing systems"]'::jsonb, correct_answer = 'He finds logistics easier to discuss than job security' where id = 'cea48450-5e83-431d-ae80-0d58ac55b94e';

-- d112c646-1265-4bb3-bdfe-6a1ebb722741  reading C1  key 94->48 chars, rank 2
update public.questions set options = '["Annual reviews felt cut off from day-to-day work", "Managers asked for more detailed paperwork", "Bonuses and promotions were awarded too often", "Staff voted to make peer feedback compulsory in reviews"]'::jsonb, correct_answer = 'Annual reviews felt cut off from day-to-day work' where id = 'd112c646-1265-4bb3-bdfe-6a1ebb722741';

-- d3b8aafd-1777-4992-a3ba-e95cc2ee518a  listening C2  key 57->46 chars, rank 2
update public.questions set options = '["Results this quarter are excellent across the board", "Weak results, though a new contract could help", "Nothing can rescue the quarter''s results now", "The new contract has already fallen through"]'::jsonb, correct_answer = 'Weak results, though a new contract could help' where id = 'd3b8aafd-1777-4992-a3ba-e95cc2ee518a';

-- d48f2a41-7475-4f98-b19c-56e776eda3a2  reading C1  key 115->54 chars, rank 2
update public.questions set options = '["It balances early openness with caution over the facts", "It aims to delay telling anyone for as long as possible", "It shows the company distrusts its own security team", "It means only senior staff will be informed at all"]'::jsonb, correct_answer = 'It balances early openness with caution over the facts' where id = 'd48f2a41-7475-4f98-b19c-56e776eda3a2';

-- d6172414-7182-4cc6-ae42-8c542c5e6005  reading C1  key 44->38 chars, rank 3
update public.questions set options = '["Personal use, even if reimbursed later", "Using the finance app to upload receipts", "Requesting a card from the finance team", "Moving to a role with minimal travel"]'::jsonb, correct_answer = 'Personal use, even if reimbursed later' where id = 'd6172414-7182-4cc6-ae42-8c542c5e6005';

-- d7fe4d4d-eac6-4b18-8e87-d9b6863764c5  listening C1  key 84->67 chars, rank 3
update public.questions set options = '["The speaker does not actually know what caused the repeated ticket delays", "The speaker believes excuses would cost credibility with the client", "The speaker thinks the client would not grasp the technical explanation", "The speaker is shifting the blame onto another colleague"]'::jsonb, correct_answer = 'The speaker believes excuses would cost credibility with the client' where id = 'd7fe4d4d-eac6-4b18-8e87-d9b6863764c5';

-- d9d54b5c-e6fd-45f0-a3f8-1d81ff26d928  listening C2  key 57->45 chars, rank 2
update public.questions set options = '["The client rejected the offer outright on the call", "The client probably won''t reply unless chased", "The client agreed to the deal on the spot", "The client will ring back within the hour"]'::jsonb, correct_answer = 'The client probably won''t reply unless chased' where id = 'd9d54b5c-e6fd-45f0-a3f8-1d81ff26d928';

-- db833deb-7bd7-43d0-b9ca-6690fdedddf4  listening C2  key 47->39 chars, rank 3
update public.questions set options = '["The client has already signed the contract", "The client rejected the proposal outright", "The client was somewhat receptive to it", "The client gave no reaction whatsoever"]'::jsonb, correct_answer = 'The client was somewhat receptive to it' where id = 'db833deb-7bd7-43d0-b9ca-6690fdedddf4';

-- de689d12-b59c-4556-a1de-d2857c76de44  listening C2  key 118->54 chars, rank 2
update public.questions set options = '["He welcomes the escrow structure as his preferred outcome", "He accepts it grudgingly, provided the terms are clear", "He rejects the proposal outright and ends the call", "He demands the litigation be dropped from the deal"]'::jsonb, correct_answer = 'He accepts it grudgingly, provided the terms are clear', explanation = 'He states the arrangement is ''not his first preference'' yet something his board ''could live with'', and attaches a condition (''provided the release conditions were clearly defined''), the language of grudging, qualified acceptance rather than enthusiasm or refusal; the call in fact ends warmly with draft terms to follow. No demand to drop the litigation issue appears anywhere.' where id = 'de689d12-b59c-4556-a1de-d2857c76de44';

-- df846091-bd81-4a9a-a445-03ccfd681b16  reading C1  key 67->46 chars, rank 3
update public.questions set options = '["Making sure the card is used only for business", "Reducing the number of employees who travel for work", "Replacing the finance app with a new system", "Encouraging employees to make more personal purchases"]'::jsonb, correct_answer = 'Making sure the card is used only for business' where id = 'df846091-bd81-4a9a-a445-03ccfd681b16';

-- df8e3c94-dd88-4b9f-8a97-0ba664c3a2e1  listening C2  key 58->45 chars, rank 2
update public.questions set options = '["It should be cancelled before more money is lost", "Its numbers are accurate and need no trimming", "It deserves funding despite imperfect numbers", "Its budget should be doubled before approval"]'::jsonb, correct_answer = 'It deserves funding despite imperfect numbers' where id = 'df8e3c94-dd88-4b9f-8a97-0ba664c3a2e1';

-- dfdf8654-126a-4a9a-9b2a-608395d99fcd  reading C2  key 129->57 chars, rank 3
update public.questions set options = '["Lower satisfaction, hinting at trouble with complex cases", "They were the most satisfied group in the entire survey", "They were excluded from the satisfaction figures this quarter", "Their satisfaction was indistinguishable from first-time contacts"]'::jsonb, correct_answer = 'Lower satisfaction, hinting at trouble with complex cases' where id = 'dfdf8654-126a-4a9a-9b2a-608395d99fcd';

-- e051b817-eeb5-4422-89eb-7183c7276ea4  listening C1  key 112->56 chars, rank 2
update public.questions set options = '["The speaker does not believe the renovations will happen", "The speaker expects scepticism until the upgrades appear", "The speaker is criticising employees for distrusting management", "The speaker is admitting the policy change is unpopular"]'::jsonb, correct_answer = 'The speaker expects scepticism until the upgrades appear' where id = 'e051b817-eeb5-4422-89eb-7183c7276ea4';

-- e0a95cab-630b-4fea-a9d5-bd856d26da19  reading C2  key 61->55 chars, rank 2
update public.questions set options = '["Halden might reconsider the deal amid its restructuring", "Legal required a signed term sheet by this Friday", "The board demanded a resolution before next quarter", "The eighteen-month workforce guarantee would lapse first"]'::jsonb, correct_answer = 'Halden might reconsider the deal amid its restructuring' where id = 'e0a95cab-630b-4fea-a9d5-bd856d26da19';

-- e389d843-b822-421e-b446-68abc6054b96  listening C1  key 95->64 chars, rank 2
update public.questions set options = '["A strong business case is irrelevant to transformation success", "Leaders relying on logic alone underestimate the human dimension", "The speaker believes business cases should not be shared with employees", "The phrase is used to criticise a specific colleague''s approach"]'::jsonb, correct_answer = 'Leaders relying on logic alone underestimate the human dimension' where id = 'e389d843-b822-421e-b446-68abc6054b96';

-- e6a5c5ca-8fd6-4195-9d54-6d1fddd0984b  listening C2  key 109->58 chars, rank 2
update public.questions set options = '["The speaker is offering Richard a personal financial incentive", "The fund''s stakeholders demanded an electric vehicle pivot", "The fund can sell the pivot to investors as a growth story", "The fund must mislead its stakeholders about the plant"]'::jsonb, correct_answer = 'The fund can sell the pivot to investors as a growth story' where id = 'e6a5c5ca-8fd6-4195-9d54-6d1fddd0984b';

-- ec2bab87-184c-4097-a60e-4598e0c6ba42  reading C2  key 171->70 chars, rank 2
update public.questions set options = '["Returning users carry a frustration with rigid terms first-timers lack", "First-time subscribers are not told that a new pricing model exists", "Returning users are offered a lower price than first-time subscribers", "The new model was only technically available to returning users in the trial"]'::jsonb, correct_answer = 'Returning users carry a frustration with rigid terms first-timers lack' where id = 'ec2bab87-184c-4097-a60e-4598e0c6ba42';

-- ed2713b4-51e8-4b24-aa38-81699257535d  reading C2  key 78->49 chars, rank 4
update public.questions set options = '["The supplier had no suitable alternatives in time", "Staff at a third of sites refused to give up plastic cutlery", "Compostable cutlery proved too expensive for the budget", "The target was never treated as a company priority"]'::jsonb, correct_answer = 'The supplier had no suitable alternatives in time' where id = 'ed2713b4-51e8-4b24-aa38-81699257535d';

-- eff83650-d5f4-4a62-b1e5-7cbe4bc59ce1  reading C2  key 109->65 chars, rank 3
update public.questions set options = '["It fairly counters that some cooling on stable accounts is normal", "It blames the account lead personally for losing Halden''s business", "It proves that pricing was the only real factor in the loss", "It recommends immediately increasing check-in frequency on every account"]'::jsonb, correct_answer = 'It fairly counters that some cooling on stable accounts is normal' where id = 'eff83650-d5f4-4a62-b1e5-7cbe4bc59ce1';

-- f0c7ea45-51d7-423d-96ef-203d0b0cbcbf  listening C1  key 80->57 chars, rank 4
update public.questions set options = '["To show off their knowledge of complex distribution agreements", "To frame the clause as unreasonable by industry standards", "To argue that the clause is illegal under current regulations", "To explain why their legal team has not reviewed the contract yet"]'::jsonb, correct_answer = 'To frame the clause as unreasonable by industry standards' where id = 'f0c7ea45-51d7-423d-96ef-203d0b0cbcbf';

-- f1d2004d-b269-4b6c-a952-d17d66d80b22  listening C2  key 100->67 chars, rank 2
update public.questions set options = '["Appealing to emotion by describing the suffering of Grafton''s workers", "Presenting it as the only option left after refuting both positions", "Threatening both parties with legal consequences if they refuse", "Using technical jargon to confuse the participants into agreement"]'::jsonb, correct_answer = 'Presenting it as the only option left after refuting both positions' where id = 'f1d2004d-b269-4b6c-a952-d17d66d80b22';

-- f37e557e-3854-4b7e-80db-cdb3e56a9882  listening C2  key 115->61 chars, rank 3
update public.questions set options = '["Litigation would be too expensive for Dr Hartmann''s company to pursue", "The legal claim has no merit and would be dismissed", "Litigation would leave the data problem unresolved far longer", "The speaker is threatening to countersue if litigation proceeds"]'::jsonb, correct_answer = 'Litigation would leave the data problem unresolved far longer' where id = 'f37e557e-3854-4b7e-80db-cdb3e56a9882';

-- f780f5be-788d-4fec-b0a3-92480b088764  reading C2  key 138->70 chars, rank 2
update public.questions set options = '["Qualified acceptance: complexity noted, but the data fits segmentation", "Outright rejection of the segmented approach in favour of a universal rollout", "Enthusiastic support for the new model over the old one in general", "A demand for a second six-month trial before any decision is made"]'::jsonb, correct_answer = 'Qualified acceptance: complexity noted, but the data fits segmentation' where id = 'f780f5be-788d-4fec-b0a3-92480b088764';

-- f7daa637-113f-4be6-ac74-11e066f23bbf  reading C1  key 61->50 chars, rank 2
update public.questions set options = '["It intends to report setbacks as well as successes", "It expects the initiative to fail completely", "It plans to hide any negative results from staff", "It has already identified major failures before starting"]'::jsonb, correct_answer = 'It intends to report setbacks as well as successes' where id = 'f7daa637-113f-4be6-ac74-11e066f23bbf';

-- f8464106-d437-4c00-8cdb-e8dcb9205284  reading C2  key 108->66 chars, rank 3
update public.questions set options = '["She is testing whether the concern is a pattern or a one-off quirk", "She has already decided not to hire the candidate regardless of a second call", "She believes the first reference lied about the candidate", "She wants to replace the entire reference-checking process going forward"]'::jsonb, correct_answer = 'She is testing whether the concern is a pattern or a one-off quirk' where id = 'f8464106-d437-4c00-8cdb-e8dcb9205284';

-- f9dc1cbc-c536-4d45-8515-e3dc9459b604  listening C2  key 58->55 chars, rank 2
update public.questions set options = '["Any further delay is legal''s fault, not the successor''s", "Whoever takes over has already mishandled the renewal", "Legal approved the Kowalski renewal after the second chase", "The speaker never got round to chasing legal about it"]'::jsonb, correct_answer = 'Any further delay is legal''s fault, not the successor''s', explanation = 'The speaker states that if the contract is still sitting with legal, "that''s on them, not on whoever picks this up," meaning legal, not the person taking over, would be responsible.' where id = 'f9dc1cbc-c536-4d45-8515-e3dc9459b604';

-- fa0ad061-49ce-459b-b79f-d848cd075b6f  reading C2  key 91->63 chars, rank 2
update public.questions set options = '["The issue likely existed before, overshadowed by response times", "Billing statements were redesigned in January and genuinely worsened", "Billing complaints have always dominated the free-text feedback", "The billing team caused the earlier rise in response times"]'::jsonb, correct_answer = 'The issue likely existed before, overshadowed by response times' where id = 'fa0ad061-49ce-459b-b79f-d848cd075b6f';

-- fa201728-b0a6-4f10-a53b-b49e7b134f61  listening C1  key 99->68 chars, rank 2
update public.questions set options = '["Passive resistance is illegal under most employment law", "Open objection is easier to spot and address than passive resistance", "Passive resistance leads to immediate project cancellation", "Open objection usually comes from senior leaders who have more influence"]'::jsonb, correct_answer = 'Open objection is easier to spot and address than passive resistance' where id = 'fa201728-b0a6-4f10-a53b-b49e7b134f61';

-- fe78cb94-52c2-4c6d-ba4a-1ddc9985ecd8  reading C2  key 36->36 chars, rank 4
update public.questions set options = '["The shift in decision-making culture", "The routing algorithm''s efficiency on its own", "A reduction in dispatch staff numbers", "Lower fuel costs from shorter delivery routes"]'::jsonb, correct_answer = 'The shift in decision-making culture' where id = 'fe78cb94-52c2-4c6d-ba4a-1ddc9985ecd8';

-- ff42236e-24d1-43a2-ae11-be126c8e6fe7  reading C1  key 53->45 chars, rank 2
update public.questions set options = '["A bug that displayed stock counts incorrectly", "Marketing could not deliver the campaign in time", "The engineering team ran out of budget", "A key member of the product team resigned"]'::jsonb, correct_answer = 'A bug that displayed stock counts incorrectly' where id = 'ff42236e-24d1-43a2-ae11-be126c8e6fe7';

-- ff5d4325-d43e-4b86-9211-6c6dba9af480  reading C1  key 78->51 chars, rank 3
update public.questions set options = '["Cautious and diplomatic, urging correction early on", "Openly hostile towards the vendor''s compliance team", "Indifferent about whether licensing issues are resolved", "Boastful about the company''s spotless compliance record"]'::jsonb, correct_answer = 'Cautious and diplomatic, urging correction early on' where id = 'ff5d4325-d43e-4b86-9211-6c6dba9af480';

commit;

-- verification (expect roughly chance, ~25%, not 81%):
-- select count(*) filter (where longest) * 100.0 / count(*) as pct_key_longest from (
--   select (length(correct_answer) > (select max(length(v)) from jsonb_array_elements_text(options) v
--            where v <> correct_answer)) as longest
--   from public.questions where type='mcq' and skill in ('listening','reading')
--     and cefr_level in ('C1','C2')) t;