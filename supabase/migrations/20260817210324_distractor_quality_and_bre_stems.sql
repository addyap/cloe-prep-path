-- CLOE pedagogy audit — distractor quality + residual BrE in question stems
--
-- PART 1: 35 grammar_vocab items whose distractors were so weak the item tested
-- nothing. Four kinds, all confirmed genuine by the repair pass:
--   ARTICLE TELL   'I work in an _____' -> office/kitchen/garden/forest.
--                  Only the key begins with a vowel, so the item is answerable
--                  with ZERO English vocabulary. 2 items; both repaired, and a
--                  corpus-wide sweep confirms these were the only two in 288.
--   RHYME FILLERS  'dividend' against sediment/condiment/ligament;
--                  'insolvency' against benevolence/adolescence/turbulence.
--   ABSURD NOUNS   'Keep the _____ in case you need to return the item'
--                  against ladder/balloon/pillow.
--   SYNONYM PAIRS  'send the report _____ Friday' offering BOTH until and till —
--                  being equivalent, neither can be right, so both die at once
--                  and a 4-way item collapses to a 2-way one.
--
-- Replacements are errors a French-speaking learner would actually make: faux amis
-- (delai -> 'delay' for deadline), near-miss collocations, and right-domain
-- wrong-meaning words. correct_answer is UNCHANGED on every item — only wrong
-- answers were touched, and that invariant was machine-enforced.
--
-- A CRITICAL DEFECT WAS FOUND WHILE DOING THIS, previously unflagged: in fafc5510
-- the distractor 'holiday' made 'I need to finish this before the holiday on
-- Friday' a fully correct sentence — a genuine second answer, not a weak option.
--
-- The repair pass also REJECTED several of the reviewer's own proposals for
-- creating second answers: 'procure' (arguably buying a division), 'arbitration'
-- and 'administration' (both real creditor routes), 'packaging'/'warranty'/
-- 'invoice' (all genuinely sound return advice), and 'honorary' (which would have
-- created a NEW article tell against 'a _____ duty').
--
-- PART 2: 9 question stems still carrying American forms (toward, Mr./Ms./Mrs.).
-- Audio coupling was checked per item rather than assumed: 7 are reading or
-- grammar_vocab (no audio) or passage-linked listening (the stem is not spoken);
-- 1 sits outside the quoted span; and the single spoken case is 'Mr.' -> 'Mr',
-- a homophone, so no recording changes. NO AUDIO REGENERATION REQUIRED.

begin;

-- 016a3e39 B2  Distractors are drawn from unrelated semantic fields and are never plaus
update public.questions set options = '["logistics", "payroll", "compliance", "recruitment"]'::jsonb where id = '016a3e39-bbc5-4cf1-aae6-bdc20f2aaaeb';

-- 037f0b1b A2  Distractors not office equipment.
update public.questions set options = '["printer", "projector", "whiteboard", "laptop"]'::jsonb where id = '037f0b1b-9e99-4735-91b3-1508319c0aa1';

-- 08634e93 A1  Distractors are unrelated concrete nouns.
update public.questions set options = '["receipt", "change", "basket", "trolley"]'::jsonb where id = '08634e93-28d3-499e-85da-0388e8c7387a';

-- 087aac8b B1  Two options are exact synonyms, both eliminable at once.
update public.questions set options = '["by", "until", "at", "since"]'::jsonb where id = '087aac8b-1292-4320-b316-c8c23ab0406f';

-- 09052fdc B2  Distractors are absurd for a business context, so the item tests nothing
update public.questions set options = '["headquarters", "revenue", "forecast", "agenda"]'::jsonb where id = '09052fdc-9bdf-4759-b0fc-0025dee58dec';

-- 14bf6dff A2  Distractors absurd in workplace context.
update public.questions set options = '["department", "sector", "direction", "warehouse"]'::jsonb where id = '14bf6dff-4000-4502-9eef-91297936cb9d';

-- 1b0771a7 A1  Distractor is not well-formed slang; models no real error.
update public.questions set options = '["I would like to request a day off.", "Gimme a day off.", "Can I get a day off, dude?", "I want you to give me a day off."]'::jsonb where id = '1b0771a7-aa81-4d13-8450-a21d4ecbce21';

-- 21c2c17c B1  Distractors unrelated professions.
update public.questions set options = '["vendor", "auditor", "recruiter", "tenant"]'::jsonb where id = '21c2c17c-e8ce-41d9-92f3-9c520db3a9ac';

-- 221b2b3f B1  Distractors absurd at B1.
update public.questions set options = '["quota", "agenda", "invoice", "budget"]'::jsonb where id = '221b2b3f-0803-4815-bbb2-c6a17a89857c';

-- 2402c07a C2  Rhyme-filler distractors make the item trivial.
update public.questions set options = '["dividend", "levy", "tariff", "overhead"]'::jsonb where id = '2402c07a-6573-40cf-8a99-c4cbdb646e19';

-- 2529ac6e A1  Article 'an' gives the answer away; distractors absurd. (+ stem reworded to kill the article tell)
update public.questions set options = '["office", "desk", "kitchen", "garage"]'::jsonb, prompt_text = 'I work in a small _____ with two other people and three computers.' where id = '2529ac6e-99bd-436a-b8d0-1c32d43a921b';

-- 2d94b437 C1  Distractors are absurd, so the C1 item does not test the collocation 'co
update public.questions set options = '["advantage", "pressure", "tender", "quota"]'::jsonb where id = '2d94b437-cc6f-4233-a924-d957a8537510';

-- 3c71aa1c C2  Distractors are rhyme-based and never plausible with 'duty'.
update public.questions set options = '["fiduciary", "provisional", "nominal", "voluntary"]'::jsonb where id = '3c71aa1c-7d67-4221-ab6e-749cf5261330';

-- 41bbe66b B1  Distractors unrelated objects.
update public.questions set options = '["invoice", "agenda", "receipt", "forecast"]'::jsonb where id = '41bbe66b-997f-47f1-bf82-fa5fd446813a';

-- 57dda03e C1  Distractors are semantically absurd at C1.
update public.questions set options = '["restructure", "forecast", "negotiate", "depreciate"]'::jsonb where id = '57dda03e-8209-4824-b820-f2e0e00c491e';

-- 63b24806 A2  Time preposition used as filler in a place item.
update public.questions set options = '["in", "on", "at", "into"]'::jsonb where id = '63b24806-5ee2-4a92-a3de-4af423c26bf3';

-- 6a52b7d2 C2  Distractors are absurd, and the bare stem would admit many real finance 
update public.questions set options = '["solvency", "inflation", "publicity", "seniority"]'::jsonb where id = '6a52b7d2-6ffb-41cf-b6df-7c344daeb516';

-- 7046c2a3 C1  Rhyme-filler distractors ('ceremony', 'testimony', 'matrimony') are neve
update public.questions set options = '["contingency", "pension", "dividend", "overhead"]'::jsonb where id = '7046c2a3-2573-4984-8202-34793b1e6014';

-- 8117310a C1  Distractors are absurd and give the answer away.
update public.questions set options = '["leverage", "liquidate", "underwrite", "outsource"]'::jsonb where id = '8117310a-73b5-44a5-8baf-e5ac245e7819';

-- 88d77c2c C1  Distractors 'decorate' and 'celebrate' are never plausible with 'risk', 
update public.questions set options = '["mitigate", "aggravate", "tolerate", "conceal"]'::jsonb where id = '88d77c2c-6692-4a36-b8aa-590ee231d528';

-- 8b15e7e8 B1  Abstract nouns from unrelated domains.
update public.questions set options = '["inventory", "turnover", "expenditure", "payroll"]'::jsonb where id = '8b15e7e8-78c9-42b8-9ca7-6c6dda0d147e';

-- 901cd7d3 A1  Distractors unrelated everyday objects.
update public.questions set options = '["folder", "stapler", "keyboard", "monitor"]'::jsonb where id = '901cd7d3-a410-4cd2-a4b9-344830745508';

-- 989151b7 A1  'Since' is time-only filler in a place item.
update public.questions set options = '["at", "in", "on", "to"]'::jsonb where id = '989151b7-295f-4976-81d9-66d0fe1761ad';

-- 9dcbe32d B2  Distractors are semantically absurd, making a B2 item answerable without
update public.questions set options = '["strategy", "turnover", "invoice", "deficit"]'::jsonb where id = '9dcbe32d-12f2-4581-b8aa-19bd20669ec4';

-- ade68361 A2  Distractors unrelated buildings.
update public.questions set options = '["warehouse", "reception", "canteen", "corridor"]'::jsonb where id = 'ade68361-4875-47f8-bb76-0318cbd2a578';

-- b4d675ae C2  Distractors are absurd for a C2 business-vocabulary item.
update public.questions set options = '["capture", "monitor", "allocate", "forecast"]'::jsonb where id = 'b4d675ae-d729-4aa6-8d3c-edc94f9488b1';

-- ba191e99 C2  Rhyme-filler distractors give the answer away.
update public.questions set options = '["insolvency", "expansion", "profitability", "recruitment"]'::jsonb where id = 'ba191e99-424c-41b1-97dc-32dd8fcf0dae';

-- cbfe921b B1  Two distractors are non-words no learner would produce.
update public.questions set options = '["has finished", "have finished", "is finished", "finishes"]'::jsonb where id = 'cbfe921b-90f2-4b4b-a53c-03eaa70562f4';

-- cdbb9858 C1  Distractors are chosen for rhyme rather than meaning, so no real vocabul
update public.questions set options = '["synergy", "overlap", "backlog", "bottleneck"]'::jsonb where id = 'cdbb9858-aae3-4d50-97d8-f491347f9f28';

-- d83733c3 A1  Distractors not office furniture.
update public.questions set options = '["desk", "office", "drawer", "folder"]'::jsonb where id = 'd83733c3-f727-493d-8109-fabc7deca835';

-- e8b949d4 A2  Distractors unrelated to workplace.
update public.questions set options = '["email", "calendar", "payslip", "contract"]'::jsonb where id = 'e8b949d4-16ff-41bc-b307-bec489c58ecf';

-- f168e0b5 B2  Rhyme-based nonsense distractors make the item trivially easy.
update public.questions set options = '["subsidiary", "turnover", "overhead", "merger"]'::jsonb where id = 'f168e0b5-ee40-4ec4-aef7-5137cdb7115a';

-- f2cbae74 A2  Distractors unrelated professions.
update public.questions set options = '["supervisor", "patron", "chief", "trainee"]'::jsonb where id = 'f2cbae74-cde6-4456-83fc-fb6bbd1664b1';

-- f3d5cc54 A2  Article 'an' cues the answer.
update public.questions set options = '["appointment", "invoice", "agenda", "estimate"]'::jsonb where id = 'f3d5cc54-7cb6-4516-bc6c-b47733809442';

-- fafc5510 B1  Distractors unrelated everyday nouns.
update public.questions set options = '["deadline", "delay", "agenda", "invoice"]'::jsonb where id = 'fafc5510-0d18-4272-afe1-459594cf3ba5';

-- ---- residual BrE in stems (audio-safe, verified per item) ----
-- d8be6132 reading  Mr. -> BrE   [SAFE — no audio]
update public.questions set prompt_text = 'What must Mr Lee send to the company?' where id = 'd8be6132-1c6f-4812-ae6b-c5bafbc0b29e';

-- ba191e99 grammar_vocab  toward -> BrE   [SAFE — no audio]
update public.questions set prompt_text = 'Rising debts pushed the small firm towards _____ within two years.' where id = 'ba191e99-424c-41b1-97dc-32dd8fcf0dae';

-- f7f2fabc listening  toward -> BrE   [SAFE — passage-linked, stem not spoken]
update public.questions set prompt_text = 'What can you infer about the representative''s true feelings towards a long-term contract?' where id = 'f7f2fabc-3d47-4048-9434-cf99785beaa6';

-- cf7410fa listening  Mr. -> BrE   [SAFE — passage-linked, stem not spoken]
update public.questions set prompt_text = 'What caused the delay in Mr Tanaka''s shipment?' where id = 'cf7410fa-e5d8-444b-91d7-b753e37d7db6';

-- 6920837d listening  toward -> BrE   [SAFE — passage-linked, stem not spoken]
update public.questions set prompt_text = 'What is the speaker''s attitude towards the "third path" that has been informally suggested?' where id = '6920837d-bcec-48c0-9134-5e01eaba69ab';

-- a1936232 listening  toward -> BrE   [SAFE — passage-linked, stem not spoken]
update public.questions set prompt_text = 'What is the speaker''s attitude towards the option of immediately terminating the supplier contracts?' where id = 'a1936232-0561-43a7-ba2b-778480fafe07';

-- df8e3c94 listening  toward -> BrE   [SAFE — outside quoted span]
update public.questions set prompt_text = 'You hear: "Look, I''m not going to pretend the numbers are perfect, but let''s not throw the baby out with the bathwater — the project''s worth funding, even if we trim a few corners here and there." What is the speaker''s overall attitude towards the project?' where id = 'df8e3c94-dd88-4b9f-8a97-0ba664c3a2e1';

-- 14248bf1 listening  Mr. -> BrE   [SPOKEN — homophone, audio unaffected]
update public.questions set prompt_text = 'You hear: "I''m sorry, Mr Dubois is in a meeting until three, but he asked me to let you know that he''ll call you as soon as he''s free." When will Mr Dubois likely call back?' where id = '14248bf1-4917-4155-a179-398db946375a';

-- f5a65bda reading  Mr. -> BrE   [SAFE — no audio]
update public.questions set prompt_text = 'Will Mr Lee pay to return the item?' where id = 'f5a65bda-8be5-44f6-960a-622a478fc8da';

commit;

-- verify (all must return 0):
--   select count(*) from public.questions where type='mcq' and not (options ? correct_answer);
--   select count(*) from public.questions where prompt_text ~ '(\mtoward\M|Mr\.|Ms\.|Mrs\.)';