-- CLOE pedagogy audit 2026-08-16 — verified repairs (stage 1: audio-safe)
--
-- Every statement below comes from a finding that survived an independent
-- adversarial verification pass. Refuted and downgraded-to-no-change findings
-- are NOT in this file. Fixes coupled to pre-rendered listening audio are held
-- in a separate stage-2 migration so text and audio never desynchronise.
--
-- 126 column updates across 88 rows.

begin;


-- ---------- CRITICAL · grammar_vocab / mcq ----------
-- 363e7188-c7f7-41cb-bdab-26f4c3eaedf6  [prompt_text]  'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturall
update public.questions set prompt_text = 'Our _____ increased by 15% this quarter, meaning we earned more money from sales.' where id = '363e7188-c7f7-41cb-bdab-26f4c3eaedf6';
-- 363e7188-c7f7-41cb-bdab-26f4c3eaedf6  [explanation]  'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturall
update public.questions set explanation = '''Revenue'' is the money a business earns from sales, so a 15% rise in revenue means it earned more. ''Expenditure'' is money spent, ''headcount'' is the number of employees, and ''downtime'' is time when systems are not working — an increase in any of those does not mean more money was earned.' where id = '363e7188-c7f7-41cb-bdab-26f4c3eaedf6';
-- 363e7188-c7f7-41cb-bdab-26f4c3eaedf6  [options]  'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturall
update public.questions set options = '["revenue", "expenditure", "headcount", "downtime"]'::jsonb where id = '363e7188-c7f7-41cb-bdab-26f4c3eaedf6';
-- 55d57a5c-c44e-4cd6-9972-63bb9edde156  [prompt_text]  Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British for
update public.questions set prompt_text = 'The new office is located _____ 25 Main Street.' where id = '55d57a5c-c44e-4cd6-9972-63bb9edde156';
-- 55d57a5c-c44e-4cd6-9972-63bb9edde156  [explanation]  Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British for
update public.questions set explanation = 'When an address includes the building number, English uses ''at'': ''at 25 Main Street''. (Without a number, British English says ''in Main Street'' and American English says ''on Main Street'', so a bare street name has no single right answer.) ''Since'' is only used for time, not place.' where id = '55d57a5c-c44e-4cd6-9972-63bb9edde156';
-- 55d57a5c-c44e-4cd6-9972-63bb9edde156  [options]  Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British for
update public.questions set options = '["at", "on", "in", "since"]'::jsonb where id = '55d57a5c-c44e-4cd6-9972-63bb9edde156';
-- 55d57a5c-c44e-4cd6-9972-63bb9edde156  [correct_answer]  Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British for
update public.questions set correct_answer = 'at' where id = '55d57a5c-c44e-4cd6-9972-63bb9edde156';
-- 69ac63c4-01f1-4eb4-9a86-036cc08c47e7  [prompt_text]  Backshift is optional, not obligatory, when the reported situation still holds — Swan and the Cambridge Grammar both treat 'She asked me where I live'
update public.questions set prompt_text = 'She asked me, ''Where do you live?'' I have since moved to another city. Report her question: She asked me _____.' where id = '69ac63c4-01f1-4eb4-9a86-036cc08c47e7';
-- 69ac63c4-01f1-4eb4-9a86-036cc08c47e7  [explanation]  Backshift is optional, not obligatory, when the reported situation still holds — Swan and the Cambridge Grammar both treat 'She asked me where I live'
update public.questions set explanation = 'Reported questions use statement word order with no inversion, so ''do you live'' cannot stay as ''do I live'' or become ''did I live''. Backshift (''live'' to ''lived'') is optional when the situation is still true, but obligatory here because the speaker has since moved away.' where id = '69ac63c4-01f1-4eb4-9a86-036cc08c47e7';
-- 8294f46d-837a-44c9-b7d1-b31e8e6e4df7  [explanation]  Both halves check out. 'Previous to' is recorded as a preposition meaning 'before' in the OED and Merriam-Webster and is attested in formal writing, s
update public.questions set explanation = '''Prior to'' is the standard formal preposition meaning ''before''. ''Prior of'', ''prior than'' and ''previous of'' do not exist in English. (Note that ''previous to'' is a genuine, though much rarer, alternative to ''prior to''.)' where id = '8294f46d-837a-44c9-b7d1-b31e8e6e4df7';
-- 8294f46d-837a-44c9-b7d1-b31e8e6e4df7  [options]  Both halves check out. 'Previous to' is recorded as a preposition meaning 'before' in the OED and Merriam-Webster and is attested in formal writing, s
update public.questions set options = '["prior to", "prior of", "previous of", "prior than"]'::jsonb where id = '8294f46d-837a-44c9-b7d1-b31e8e6e4df7';
-- e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be  [prompt_text]  'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 
update public.questions set prompt_text = 'By the time the CEO finally arrived, the team _____ for over three hours and were visibly exhausted.' where id = 'e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be';
-- e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be  [explanation]  'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 
update public.questions set explanation = 'The past perfect continuous (had been + -ing) describes an action that continued for a period up to a point in the past. ''By the time the CEO arrived'' fixes that point and ''for over three hours'' gives the duration, so ''had been negotiating'' is required. The past simple ''negotiated'' cannot express duration running up to that moment, and the two present perfect forms cannot appear in a narrative set wholly in the past.' where id = 'e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be';
-- e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be  [options]  'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 
update public.questions set options = '["had been negotiating", "negotiated", "has negotiated", "have been negotiating"]'::jsonb where id = 'e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be';

-- ---------- MAJOR · grammar_vocab / gap_fill ----------
-- 0215289d-f812-4fbe-b08f-e42cff937b3b  [prompt_text]  Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_voc
update public.questions set prompt_text = 'In formal written English, ''insist that'' can be followed by the mandative subjunctive — the base form of the verb, with no ''should'' and no tense ending: ''The auditor insisted that the manager _____ all receipts before month-end.''' where id = '0215289d-f812-4fbe-b08f-e42cff937b3b';
-- 0215289d-f812-4fbe-b08f-e42cff937b3b  [explanation]  Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_voc
update public.questions set explanation = 'After verbs of demanding or requiring — ''insist'', ''demand'', ''require'', ''recommend'', ''propose'' — a ''that'' clause can take the mandative subjunctive: the base form of the verb, unchanged for person or tense, so ''that the manager submit'', never ''submits''. British English also allows ''that the manager should submit'' and, in ordinary use, the plain indicative ''that the manager submitted''; both of those are correct English too. This item practises the subjunctive form itself, which is why the prompt asks specifically for the base form.' where id = '0215289d-f812-4fbe-b08f-e42cff937b3b';
-- 0215289d-f812-4fbe-b08f-e42cff937b3b  [options]  Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_voc
update public.questions set options = '["submit"]'::jsonb where id = '0215289d-f812-4fbe-b08f-e42cff937b3b';
-- 0f924792-4c64-41c4-b41e-43a5057aa689  [options]  '-ize' is not an Americanism: Oxford spelling prefers 'finalize' and it is fully standard British English, so accepting 'finalise' while rejecting 'fi
update public.questions set options = '["sign", "finalise", "finalize"]'::jsonb where id = '0f924792-4c64-41c4-b41e-43a5057aa689';
-- 1da354d4-81cb-4595-9d9a-e88f8ab469bd  [options]  Tag is 'tenses', so the target is past-simple form, not lexis; 'got' is itself an irregular past simple (get→got) and 'the team got a new printer' is 
update public.questions set options = '["bought", "purchased", "got"]'::jsonb where id = '1da354d4-81cb-4595-9d9a-e88f8ab469bd';
-- 2476b08e-136c-4d15-a4c2-9bd4a9ec7bb7  [options]  'Was taking a phone call' is fully natural BrE and is the same past-continuous structure the item drills. 'Was on a phone call' is also current standa
update public.questions set options = '["was making", "was having", "was taking", "was on"]'::jsonb where id = '2476b08e-136c-4d15-a4c2-9bd4a9ec7bb7';
-- 3189e813-1eb4-4001-8ca3-53fc878dee90  [options]  'Bring in' is a phrasal verb that fits and preserves the drill, so it is added; but 'introduce' and 'implement' are plain verbs on a phrasal-only acce
update public.questions set options = '["phase in", "roll out", "bring in"]'::jsonb where id = '3189e813-1eb4-4001-8ca3-53fc878dee90';
-- 436a4f94-e822-47a1-bf81-40ebd7bbdaa8  [options]  Unlike the other phrasal items, this accept-list already contains the plain verb 'prepare', so the phrasal-only teaching point has already been conced
update public.questions set options = '["put together", "prepare", "throw together", "pull together", "create"]'::jsonb where id = '436a4f94-e822-47a1-bf81-40ebd7bbdaa8';
-- 467914d0-1884-4ff8-a197-3d12a9a4e5ed  [options]  With no cue anywhere in the stem pointing to a low-frequency C2 verb, 'sell off', 'offload' and 'sell' are all correct completions of the sentence as 
update public.questions set options = '["divest", "sell off", "offload", "sell"]'::jsonb where id = '467914d0-1884-4ff8-a197-3d12a9a4e5ed';
-- 50ab01cc-a26e-4cdf-83ba-f4a5ac6d10c0  [options]  The list already accepts 'admitted to', so rejecting the bare transitive 'admitted the mistake' — which is the more idiomatic form before a noun objec
update public.questions set options = '["owned up to", "admitted to", "confessed to", "admitted", "acknowledged", "came clean about"]'::jsonb where id = '50ab01cc-a26e-4cdf-83ba-f4a5ac6d10c0';
-- 5b1f0b8d-736b-46aa-8d4a-f90b395f98ed  [options]  'The merger fell apart at the last minute' is exactly as idiomatic as 'fell through' and the list already accepts the non-phrasal 'collapsed', so ther
update public.questions set options = '["fell through", "collapsed", "fell apart"]'::jsonb where id = '5b1f0b8d-736b-46aa-8d4a-f90b395f98ed';
-- 5db43218-64ea-4e2a-827c-6b1ca79866b5  [options]  'Nonetheless' and the already-accepted 'nevertheless' are interchangeable formal contrastive connectors; accepting one and rejecting the other is arbi
update public.questions set options = '["however", "nevertheless", "nonetheless"]'::jsonb where id = '5db43218-64ea-4e2a-827c-6b1ca79866b5';
-- 5f5f14d2-d5f5-452d-825c-b2deddafbbbd  [options]  'A three-month trial period' is standard BrE employment language, and the item's own explanation glosses probation as 'a trial period' — rejecting the
update public.questions set options = '["probation", "probationary", "trial"]'::jsonb where id = '5f5f14d2-d5f5-452d-825c-b2deddafbbbd';
-- 628d273d-1c13-4d5a-bec4-37d96d54afb4  [options]  The stem genuinely under-determines the answer — phone, mobile, tablet, PC and desktop all write emails and check a schedule — and the explanation's c
update public.questions set options = '["computer", "laptop", "pc", "desktop", "desktop computer"]'::jsonb where id = '628d273d-1c13-4d5a-bec4-37d96d54afb4';
-- 74142bb5-9081-4ecc-ab90-f61f8cd2ff47  [options]  'Brush up' is listed transitively without 'on' in both Cambridge and Oxford ('brush up your Spanish'), so the current single-entry list marks standard
update public.questions set options = '["brush up on", "brush up", "polish up"]'::jsonb where id = '74142bb5-9081-4ecc-ab90-f61f8cd2ff47';
-- 8f1a6d53-e431-4917-8825-848c3b4912bf  [options]  'Set up a bank account' is a fully standard BrE collocation, so rejecting it marks correct English wrong. 'Open up a bank account' is colloquial and A
update public.questions set options = '["open", "set up"]'::jsonb where id = '8f1a6d53-e431-4917-8825-848c3b4912bf';
-- 96af1248-67e2-4448-8f0e-9efd1cc99a22  [options]  The item tests the past-perfect half of a mixed conditional, and 'had completed', 'had undergone' and 'had received' are all correct past perfects tha
update public.questions set options = '["had taken", "had done", "had completed", "had undergone", "had received"]'::jsonb where id = '96af1248-67e2-4448-8f0e-9efd1cc99a22';
-- af1ea971-854c-4310-b08e-e8364e5eead7  [options]  'Resulted in' is a direct equivalent of the already-accepted 'led to', so the list is internally inconsistent; 'the reforms resulted in significant ch
update public.questions set options = '["brought about", "led to", "resulted in"]'::jsonb where id = 'af1ea971-854c-4310-b08e-e8364e5eead7';
-- af8d6dd7-9495-45d9-bcf3-3a5e62ddfcd2  [options]  'According to company policy' explicitly licenses an obligation reading, so 'must/should be processed' and 'are to be processed' are correct and remai
update public.questions set options = '["are processed", "must be processed", "should be processed", "are to be processed", "are paid", "must be paid"]'::jsonb where id = 'af8d6dd7-9495-45d9-bcf3-3a5e62ddfcd2';
-- c5db7144-5dbb-453d-a4a9-cc1b66d1b4d8  [options]  The accept-list already includes the non-phrasal 'draft', so the phrasal-only rationale does not apply here and 'prepare a new contract' is plainly co
update public.questions set options = '["draw up", "draft", "prepare", "put together", "write up"]'::jsonb where id = 'c5db7144-5dbb-453d-a4a9-cc1b66d1b4d8';
-- c9336b13-7e6c-4189-8cab-560ecf6a9123  [options]  'Could you kindly send me the report?' is standard formal BrE and satisfies exactly what the stem asks for — a politeness marker replacing the bare im
update public.questions set options = '["please", "kindly"]'::jsonb where id = 'c9336b13-7e6c-4189-8cab-560ecf6a9123';
-- f0f44c23-698c-41d1-b713-c84ebb07b453  [options]  'Has set up three new offices since 2015' is natural BrE and is the same present-perfect structure the item drills, so it neither changes the target n
update public.questions set options = '["has opened", "has established", "has launched", "has set up"]'::jsonb where id = 'f0f44c23-698c-41d1-b713-c84ebb07b453';
-- fe054509-34b0-4ae1-8c0b-ab775d4de069  [options]  The stem asks for the standard formal-request formula and there is more than one: 'I would appreciate it if…' and the distinctively British 'I should 
update public.questions set options = '["would be grateful", "would be most grateful", "would be very grateful", "should be grateful", "should be most grateful", "should be very grateful", "would appreciate it"]'::jsonb where id = 'fe054509-34b0-4ae1-8c0b-ab775d4de069';

-- ---------- MAJOR · grammar_vocab / mcq ----------
-- 0de85b5d-f568-48f7-88ab-ab34c60a5e52  [explanation]  Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the America
update public.questions set explanation = 'The fixed collocation is ''harbour doubts'' — to hold doubts privately without expressing them. Note the British spelling ''harbour'' (''harbor'' is American). ''Carry'', ''keep'' and ''do'' are not used with ''doubts'' in this way.' where id = '0de85b5d-f568-48f7-88ab-ab34c60a5e52';
-- 0de85b5d-f568-48f7-88ab-ab34c60a5e52  [options]  Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the America
update public.questions set options = '["harbour", "carry", "keep", "do"]'::jsonb where id = '0de85b5d-f568-48f7-88ab-ab34c60a5e52';
-- 0de85b5d-f568-48f7-88ab-ab34c60a5e52  [correct_answer]  Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the America
update public.questions set correct_answer = 'harbour' where id = '0de85b5d-f568-48f7-88ab-ab34c60a5e52';
-- 1286cb32-56ac-4773-9ba3-9197f026087b  [explanation]  Kind 2, verified. 'Find a balance' is fully standard English and extremely common in exactly this policy register ('find a balance between work and fa
update public.questions set explanation = '''Strike a balance'' is the idiomatic collocation for reaching a satisfactory middle point between two competing things. ''Make a balance'', ''hold a balance'' and ''take a balance'' are not used in this sense. (''Find a balance'' is also correct English, but it is not one of the options here.)' where id = '1286cb32-56ac-4773-9ba3-9197f026087b';
-- 1a6442e2-3747-49fb-b900-88a153be1542  [prompt_text]  Read the full stem: it fixes when the words were spoken ('on Monday') but never when they are being reported. Deictic shift depends entirely on the re
update public.questions set prompt_text = 'He told me on Monday, ''I''ll finish the report tomorrow.'' Reporting his words the following week, you say: He said he would finish the report _____.' where id = '1a6442e2-3747-49fb-b900-88a153be1542';
-- 1a6442e2-3747-49fb-b900-88a153be1542  [explanation]  Read the full stem: it fixes when the words were spoken ('on Monday') but never when they are being reported. Deictic shift depends entirely on the re
update public.questions set explanation = 'Time words that depend on the moment of speaking shift when you report at a distant later time: ''tomorrow'' becomes ''the next day'' (the day after he spoke — Tuesday). ''Tomorrow'' would only be correct if you were reporting on Monday itself. ''Yesterday'' and ''the previous day'' point backwards from the wrong moment and give the wrong day.' where id = '1a6442e2-3747-49fb-b900-88a153be1542';
-- 2f079dd9-3940-4ea4-ab47-05ecd73ebd4a  [explanation]  Kind 2, and the false rule is verified: 'take a decision' is standard formal British English (Collins and OED both record it; it is routine in UK inst
update public.questions set explanation = '''Make a decision'' is the standard collocation in both British and American English. (''Take a decision'' also exists in formal British English, though it is not offered here.) ''Do a decision'' and ''have a decision'' are not used at all, and ''give a decision'' works only of a judge or referee announcing a verdict, not of choosing what to do.' where id = '2f079dd9-3940-4ea4-ab47-05ecd73ebd4a';
-- 38a1dace-de82-44c5-8d4f-529ab047eff0  [explanation]  'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard
update public.questions set explanation = '''Get around to (something)'' means to finally find the time to do it after a delay. British English uses ''got'' as the past participle of ''get'', so it is ''I haven''t got around to it yet'' (''gotten'' is American). The other three are separable phrasal verbs that would need the object in the middle — ''ironed it out'', ''phased it out'', ''rolled it out'' — and none of them means to find time for something.' where id = '38a1dace-de82-44c5-8d4f-529ab047eff0';
-- 38a1dace-de82-44c5-8d4f-529ab047eff0  [options]  'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard
update public.questions set options = '["got around to", "ironed out", "phased out", "rolled out"]'::jsonb where id = '38a1dace-de82-44c5-8d4f-529ab047eff0';
-- 38a1dace-de82-44c5-8d4f-529ab047eff0  [correct_answer]  'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard
update public.questions set correct_answer = 'got around to' where id = '38a1dace-de82-44c5-8d4f-529ab047eff0';
-- 3eff3c84-4d17-46de-99ab-627a21e87043  [explanation]  'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve o
update public.questions set explanation = 'A company-wide email needs full, professional wording: ''Congratulations'' written out, a complete sentence, and no slang. ''Nice one'', ''Congrats'' and ''Heard you got...'' are casual spoken forms suited to a message between friends; the last one is also inaccurate, since a promotion is not a new job.' where id = '3eff3c84-4d17-46de-99ab-627a21e87043';
-- 3eff3c84-4d17-46de-99ab-627a21e87043  [options]  'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve o
update public.questions set options = '["Congratulations on your promotion; it is thoroughly well deserved after all your hard work.", "Nice one, well done!", "Congrats, you really earned this!", "Heard you got a new job, nice."]'::jsonb where id = '3eff3c84-4d17-46de-99ab-627a21e87043';
-- 3eff3c84-4d17-46de-99ab-627a21e87043  [correct_answer]  'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve o
update public.questions set correct_answer = 'Congratulations on your promotion; it is thoroughly well deserved after all your hard work.' where id = '3eff3c84-4d17-46de-99ab-627a21e87043';
-- 516c146c-9f6a-4054-9216-aecc89678866  [explanation]  Re-read the full stem: 'I _____ that report yesterday.' There is no aspect marker, no subordinator and no completion adverbial — nothing excludes past
update public.questions set explanation = '''Yesterday'' is a finished past time, so English uses the past simple: ''wrote''. The present perfect (''have written'') and present perfect continuous (''have been writing'') cannot be combined with a finished past time expression, and the present simple ''write'' cannot describe a completed past event.' where id = '516c146c-9f6a-4054-9216-aecc89678866';
-- 516c146c-9f6a-4054-9216-aecc89678866  [options]  Re-read the full stem: 'I _____ that report yesterday.' There is no aspect marker, no subordinator and no completion adverbial — nothing excludes past
update public.questions set options = '["wrote", "have written", "have been writing", "write"]'::jsonb where id = '516c146c-9f6a-4054-9216-aecc89678866';
-- 607882d8-50bd-4c47-a04f-a1d8240a1ebd  [explanation]  Kind 2, verified, and structurally identical to 1286cb32. 'Take the opportunity to do something' is standard English of the most ordinary kind, and 't
update public.questions set explanation = '''Seize an opportunity'' means to take quick, decisive advantage of a chance. ''Make an opportunity'' means creating one that did not exist, which does not fit an opportunity that is already there, and ''hold/catch an opportunity'' are not English collocations. (''Take the opportunity to do something'' is also correct English, but it is not offered here.)' where id = '607882d8-50bd-4c47-a04f-a1d8240a1ebd';
-- a277e24b-87ae-4159-a33e-cae3d3712aa1  [prompt_text]  Both halves confirmed. Non-backshift after a past reporting verb is permitted when the reported situation still holds, so 'She told me she has already
update public.questions set prompt_text = 'She told me last month, ''I''ve already sent the invoice.'' The invoice never arrived. She told me she _____ already sent the invoice.' where id = 'a277e24b-87ae-4159-a33e-cae3d3712aa1';
-- a277e24b-87ae-4159-a33e-cae3d3712aa1  [explanation]  Both halves confirmed. Non-backshift after a past reporting verb is permitted when the reported situation still holds, so 'She told me she has already
update public.questions set explanation = 'After a past reporting verb, the present perfect ''have sent'' normally backshifts to the past perfect ''had sent''. Keeping the present perfect (''has sent'') is possible only when the speaker treats the reported statement as still true, which is impossible here because the invoice never arrived. ''Have'' does not agree with ''she'', and ''was sent'' would turn the clause passive and change the meaning.' where id = 'a277e24b-87ae-4159-a33e-cae3d3712aa1';
-- b93baa9e-08fc-4b9c-aa1d-cf912acd23fb  [explanation]  Kind 2, verified. 'Win a deal' is common, unremarkable business English (win a deal, win the deal, deal wins) — the explanation's flat assertion that 
update public.questions set explanation = '''Strike a deal'' is the fixed collocation for two sides reaching an agreement together. ''Win a deal'' does exist in business English, but it means beating rivals to secure business for yourself, so it cannot describe two sides jointly agreeing after negotiation. ''Hit a deal'' is not English at all, and ''beat a deal'' would mean offering better terms than an existing deal, not making one.' where id = 'b93baa9e-08fc-4b9c-aa1d-cf912acd23fb';
-- cbfe921b-90f2-4b4b-a53c-03eaa70562f4  [explanation]  Kind 2, verified false. 'Already' does not require the present perfect in any variety: 'I already knew that', 'She already left' (AmE past simple), 'A
update public.questions set explanation = 'Here ''already'' marks an action completed before now whose result still matters, so English uses the present perfect: has/have + past participle. ''She'' is third person singular, so the auxiliary is ''has''. ''Have finished'' would need I/you/we/they. ''Since'' cannot be used in these options because it introduces the starting point of a period (''since Monday''), not a completed action.' where id = 'cbfe921b-90f2-4b4b-a53c-03eaa70562f4';

-- ---------- MAJOR · grammar_vocab / word_bank ----------
-- 1aec4974-ba5c-4650-9e3c-96a9e41111d7  [explanation]  Confirmed on all points; I could not refute any part. The blank-5 explanation asserts that "'regain' would wrongly imply the talks previously had mome
update public.questions set explanation = '''Gain traction'' is the fixed business collocation for a process starting to make real progress; the adverbial ''once more'' carries the sense of resumption, so the verb itself stays ''gain''. No other word in the pool collocates with ''traction''.' where id = '1aec4974-ba5c-4650-9e3c-96a9e41111d7';
-- 51650db1-4fab-4c9a-bea9-d0877fd90ff3  [body]  Confirmed. 'The report has been reviewed carefully by the panel, and, despite having several minor c
update public.passages set body = 'Dear Ms. Owusu, I am writing {{1}} your request for feedback on the quarterly performance review. The report has been reviewed carefully by the panel, and, {{2}} several minor concerns raised during that review, your overall contribution was judged to be highly satisfactory. {{3}} to the meeting, please review the attached figures so that you are fully prepared to discuss them. Furthermore, you are expected to {{4}} to improve turnaround times on client deliverables over the coming quarter. {{5}}, your collaborative approach with the marketing team has been particularly commendable and should be maintained. Should any queries arise, do not hesitate to contact HR, who will {{6}} respond within two working days.' where id = '51650db1-4fab-4c9a-bea9-d0877fd90ff3';
-- 9579187e-0725-45c9-a9f6-b69ef02fdc58  [body]  Split verdict. The cross-substitution half is REFUTED: 'would' is the answer to blank 3, whose inver
update public.passages set body = 'No sooner had the breach been detected than the incident-response team {{1}} into action, activating protocols that had been rehearsed only weeks earlier. By the time the regulator''s inquiry landed on the general counsel''s desk, the company {{2}} already notified every affected client, a fact that would later prove pivotal in mitigating reputational damage. Had the communications director not insisted on transparency from the outset, the narrative {{3}} have spiralled out of control within hours. Since the crisis broke, the firm {{4}} worked around the clock, and morale, remarkably, has held. By this time next week, the taskforce {{5}} have compiled a full forensic report for the board''s review. While the technical team was still patching the vulnerability, the general counsel {{6}} already drafting contingency statements for every conceivable media scenario. It is often said that a crisis reveals character; never before {{7}} the firm''s leadership face a test of this magnitude. Looking back, few would deny that the response, though imperfect, {{8}} the company''s reputation from far graver harm.' where id = '9579187e-0725-45c9-a9f6-b69ef02fdc58';
-- b812664a-6dde-4807-af6a-952bd4215850  [body]  Survives every refutation test. Pool is ['with','into','in','under','at','on','of']; answers are in/
update public.passages set body = 'Tom always keeps the shop''s spare keys {{1}} a small locked box behind the counter, and he opens it every morning to take them out. He starts work {{2}} nine o''clock every morning. He writes today''s specials {{3}} a small whiteboard by the door. Customers can pay {{4}} a credit card.' where id = 'b812664a-6dde-4807-af6a-952bd4215850';
-- fa5b4452-a5bb-4162-b6fb-bbd971d36a50  [body]  Genuine correctness defect, and not a cross-substitution at all. 'Get through to someone' is telic —; Confirmed, and it is one half of a real two-way 
update public.passages set body = 'When I arrived at work this morning, I learned that a major client had complained about a late delivery. I immediately decided to {{1}} why the delivery had been delayed, before responding to the client. Not long after, I rang the client''s lawyer three times before I could finally {{2}} him and explain what had happened. Because we were short-staffed, I also had to {{3}} a tall stack of shipping receipts line by line, reading every entry to find the mistake. When a colleague fell ill, I offered to {{4}} the morning shift at reception for the rest of the day. I also managed to {{5}} the confusing mess of duplicate delivery addresses that had caused the whole problem, so the customer database is now clean and correct. By the end of the day, I had finally managed to {{6}} with my manager about the whole situation.' where id = 'fa5b4452-a5bb-4162-b6fb-bbd971d36a50';

-- ---------- MAJOR · listening ----------
-- 06b4748e-b0c2-4c10-b311-bc1ec02df2f9  [prompt_text]  I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent
update public.questions set prompt_text = 'What does Elena''s response to James''s admission show about her priorities?' where id = '06b4748e-b0c2-4c10-b311-bc1ec02df2f9';
-- 06b4748e-b0c2-4c10-b311-bc1ec02df2f9  [options]  I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent
update public.questions set options = '["She values early warning of problems more than a flawless record", "She values keeping the sales team''s workload steady above all", "She values creative campaigns more than delivery dates", "She values formal escalation channels over informal conversations"]'::jsonb where id = '06b4748e-b0c2-4c10-b311-bc1ec02df2f9';
-- 06b4748e-b0c2-4c10-b311-bc1ec02df2f9  [correct_answer]  I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent
update public.questions set correct_answer = 'She values early warning of problems more than a flawless record' where id = '06b4748e-b0c2-4c10-b311-bc1ec02df2f9';
-- 6a35310f-9a49-44b6-a00c-d87b25220327  [prompt_text]  Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften fr
update public.questions set prompt_text = 'What reason does Karen give for offering the fifteen percent discount?' where id = '6a35310f-9a49-44b6-a00c-d87b25220327';
-- 6a35310f-9a49-44b6-a00c-d87b25220327  [options]  Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften fr
update public.questions set options = '["The delay was caused by her own company''s error", "Mr Tanaka has complained about a previous shipment", "The express courier option was unavailable", "The shipment cannot be traced in the system"]'::jsonb where id = '6a35310f-9a49-44b6-a00c-d87b25220327';
-- 6a35310f-9a49-44b6-a00c-d87b25220327  [correct_answer]  Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften fr
update public.questions set correct_answer = 'The delay was caused by her own company''s error' where id = '6a35310f-9a49-44b6-a00c-d87b25220327';
-- 782e2afc-c789-4a36-811e-14e205bb2d43  [prompt_text]  Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three ab
update public.questions set prompt_text = 'What does the manager say about the effect of James''s approach to teamwork?' where id = '782e2afc-c789-4a36-811e-14e205bb2d43';
-- 782e2afc-c789-4a36-811e-14e205bb2d43  [options]  Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three ab
update public.questions set options = '["He absorbs work himself, which holds up the rest of the team", "He distributes work quickly but checks it too closely", "He waits for instructions before starting shared tasks", "He takes on only the tasks that match his strongest skills"]'::jsonb where id = '782e2afc-c789-4a36-811e-14e205bb2d43';
-- 782e2afc-c789-4a36-811e-14e205bb2d43  [correct_answer]  Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three ab
update public.questions set correct_answer = 'He absorbs work himself, which holds up the rest of the team' where id = '782e2afc-c789-4a36-811e-14e205bb2d43';
-- c3fc3de1-8848-4391-a31c-534d5173ca5f  [prompt_text]  Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: '
update public.questions set prompt_text = 'How does Michael handle the timing of Patricia''s decision?' where id = 'c3fc3de1-8848-4391-a31c-534d5173ca5f';
-- c3fc3de1-8848-4391-a31c-534d5173ca5f  [options]  Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: '
update public.questions set options = '["He gives her time to review but ties the decision to a fixed pricing deadline", "He gives her time to review and leaves the deadline entirely open", "He asks for a decision before the technical questions are settled", "He defers the pricing question until after the implementation meeting"]'::jsonb where id = 'c3fc3de1-8848-4391-a31c-534d5173ca5f';
-- c3fc3de1-8848-4391-a31c-534d5173ca5f  [correct_answer]  Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: '
update public.questions set correct_answer = 'He gives her time to review but ties the decision to a fixed pricing deadline' where id = 'c3fc3de1-8848-4391-a31c-534d5173ca5f';
-- d9fb72b4-ce81-4420-8b44-873ba20283cb  [prompt_text]  Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', a
update public.questions set prompt_text = 'You hear: "Honestly, swapping the caterer this close to the retreat is cutting it fine, but they promised the new menu by Friday." What does the speaker suggest about the timing of the change?' where id = 'd9fb72b4-ce81-4420-8b44-873ba20283cb';
-- d9fb72b4-ce81-4420-8b44-873ba20283cb  [options]  Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', a
update public.questions set options = '["There is barely enough time before the retreat", "There is plenty of time in hand before the retreat", "The retreat has been pushed back to allow more time", "The new menu will not arrive until after the retreat"]'::jsonb where id = 'd9fb72b4-ce81-4420-8b44-873ba20283cb';
-- d9fb72b4-ce81-4420-8b44-873ba20283cb  [correct_answer]  Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', a
update public.questions set correct_answer = 'There is barely enough time before the retreat' where id = 'd9fb72b4-ce81-4420-8b44-873ba20283cb';
-- f56ceff7-4a1d-48e8-a48a-824f3fcfbb63  [prompt_text]  Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 an
update public.questions set prompt_text = 'What drawback does the speaker identify with Option one?' where id = 'f56ceff7-4a1d-48e8-a48a-824f3fcfbb63';
-- f56ceff7-4a1d-48e8-a48a-824f3fcfbb63  [options]  Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 an
update public.questions set options = '["It is legal, but the estimates will look evasive beside rivals'' measured data", "It is illegal and will attract a regulatory fine", "It requires sharing proprietary supply chain data with competitors", "It satisfies regulators but breaches the sustainability-linked bond covenants"]'::jsonb where id = 'f56ceff7-4a1d-48e8-a48a-824f3fcfbb63';
-- f56ceff7-4a1d-48e8-a48a-824f3fcfbb63  [correct_answer]  Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 an
update public.questions set correct_answer = 'It is legal, but the estimates will look evasive beside rivals'' measured data' where id = 'f56ceff7-4a1d-48e8-a48a-824f3fcfbb63';
-- ffabeaed-80c6-4a26-b888-1ad0b4926059  [prompt_text]  Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market co
update public.questions set prompt_text = 'What figure does the speaker use to justify asking for a lower rate?' where id = 'ffabeaed-80c6-4a26-b888-1ad0b4926059';
-- ffabeaed-80c6-4a26-b888-1ad0b4926059  [options]  Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market co
update public.questions set options = '["Comparable spaces in the district are about ten percent cheaper per square metre", "Comparable spaces in the district are about ten percent dearer per square metre", "Their current rent is about ten percent below the asking rate", "Fit-out costs add about ten percent to the total"]'::jsonb where id = 'ffabeaed-80c6-4a26-b888-1ad0b4926059';
-- ffabeaed-80c6-4a26-b888-1ad0b4926059  [correct_answer]  Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market co
update public.questions set correct_answer = 'Comparable spaces in the district are about ten percent cheaper per square metre' where id = 'ffabeaed-80c6-4a26-b888-1ad0b4926059';

-- ---------- MODERATE · speaking ----------
-- 995eb9e8-8ca5-4d74-ad3f-fc38c554fb87  [prompt_text]  Survives the elaboration objection. The decisive evidence is not 'it only needs one sentence' but that it is the sole single-move item in its own pool
update public.questions set prompt_text = 'Your colleague cannot find their umbrella and it is raining outside. You saw it in the meeting room this morning, but that room is closed until 3 p.m. Tell your colleague where the umbrella is, explain why they cannot get it now, and suggest what they can do.' where id = '995eb9e8-8ca5-4d74-ad3f-fc38c554fb87';

-- ---------- MINOR · grammar_vocab / gap_fill ----------
-- 58096f76-316e-4410-8f6b-0fb0cd2dcb32  [options]  'Conduct business with your company' is genuinely correct and formal, and accepting it does not weaken the item's actual point (that it is 'do', not '
update public.questions set options = '["do", "conduct"]'::jsonb where id = '58096f76-316e-4410-8f6b-0fb0cd2dcb32';
-- 68780eee-a104-4c3c-ab35-99aa34cda2c0  [options]  'Type your secret code' is correct English and 'passcode' is defensible, so a rejection here is a genuine false negative — but both partly defeat an A
update public.questions set options = '["password", "passcode", "code"]'::jsonb where id = '68780eee-a104-4c3c-ab35-99aa34cda2c0';
-- c34603ca-22d2-4556-b3f3-a31db0373996  [options]  Bare 'go for pizza' is correct English but flatly defeats a phrasal_verbs item that already accepts two phrasal answers, so it is refused. 'Head off f
update public.questions set options = '["go out", "head out", "head off"]'::jsonb where id = 'c34603ca-22d2-4556-b3f3-a31db0373996';

-- ---------- MINOR · grammar_vocab / reconstruction ----------
-- df2e5a7e-40ac-4600-b157-4bb789f22741  [explanation]  This one is real. The current explanation ends with 'Using the pronoun "He" (rather than a noun like "the manager") blocks "from lunch" from being mis
update public.questions set explanation = '"Come back" is a phrasal verb (it means "return"), so the two words stay together after "will": will come back. Next we say where — "from lunch" — and the time word "soon" goes at the end: He will come back from lunch soon.' where id = 'df2e5a7e-40ac-4600-b157-4bb789f22741';

-- ---------- MINOR · reading ----------
-- 21c41720-3151-4edc-915b-cf94c2227ca4  [body]  British-English standard
update public.passages set body = 'Over the past two quarters, voluntary turnover in the Logistics division has risen from 8% to 19%, a trend that stands in sharp contrast to the relatively stable 6% turnover recorded across the rest of the company during the same period. Exit interviews initially pointed to pay as the primary driver, yet a closer analysis of the data suggests otherwise: departing employees in Logistics earned, on average, 4% above the market rate for comparable roles, whereas those who remained were paid slightly less. What the data does show is a strong correlation between departures and shift pattern changes introduced in March, when the division moved from fixed to rotating shifts in order to cover extended warehouse hours. Employees who left cited unpredictable schedules and difficulty arranging childcare far more often than they cited salary. Consequently, while the original assumption was that a pay review would resolve the issue, the evidence instead points towards shift flexibility as the more decisive factor. A pilot allowing staff to opt out of rotating shifts will therefore be introduced next quarter, and turnover will be monitored closely to determine whether this, rather than a pay increase, reverses the trend.' where id = '21c41720-3151-4edc-915b-cf94c2227ca4';
-- 3f32faa1-72e0-419f-8ff0-b90d3857cad4  [explanation]  British-English standard: Americanism in learner-facing text
update public.questions set explanation = 'The passage says every other answer "included at least one concrete anecdote; that one hadn''t": the single unfilled gap, not open criticism, refusal to answer, or any CV contradiction, none of which occurred.' where id = '3f32faa1-72e0-419f-8ff0-b90d3857cad4';
-- 43d076ab-7707-46f0-a1af-70f16b17a32d  [body]  British-English standard
update public.passages set body = 'When Priya called the listed reference for a candidate under consideration for the operations manager role, the conversation was, technically, entirely positive: competent, reliable, good with detail, nothing negative said outright. And yet she came away from the call less confident than before she''d made it, a reaction she found difficult to justify on paper. Replaying it afterwards, she noticed the reference had answered every question with specific examples except one: asked directly how the candidate handled disagreement with a manager, the reference paused, said ''she''s very professional about it,'' and moved straight on to a different topic without being redirected. Every other answer had included at least one concrete anecdote; that one hadn''t. Priya raised this with the hiring panel, fully aware that she was arguing for caution based on an absence rather than a presence, a single unfilled gap in an otherwise glowing account. One panel member pointed out that not every question yields a good anecdote and that reading too much into a single hesitant answer risked penalising the candidate for the reference''s conversational style rather than anything real. Priya agreed this was a fair risk, but proposed a second, informal call with a different former colleague before making a final decision, reasoning that a genuine pattern would likely surface twice, while an isolated conversational quirk would not.' where id = '43d076ab-7707-46f0-a1af-70f16b17a32d';
-- 72cae707-5515-4ea9-8fe5-e5c0632f56d5  [body]  British-English standard
update public.passages set body = 'This year, the company is moving from a single annual performance review to a continuous feedback model, in which employees and managers hold shorter, more frequent check-ins every quarter. The change follows staff survey findings suggesting that annual reviews often felt disconnected from day-to-day work and left little room to address concerns before they became significant. Under the new model, each quarterly check-in focuses on progress towards goals set at the start of the year, with formal ratings still assigned only once, at the year-end review. This means that while feedback will be ongoing, the rating that determines eligibility for bonuses and promotions is not finalised until December. Employees are encouraged to keep a running record of achievements throughout the year, as managers will draw on notes from all four check-ins when preparing the year-end assessment, rather than relying solely on their most recent impression. HR has also introduced an optional peer-feedback component, allowing colleagues to contribute observations that managers may include in the review, though this input is advisory only and does not itself affect the final rating.' where id = '72cae707-5515-4ea9-8fe5-e5c0632f56d5';
-- 7765a062-4a54-445b-9790-45f98abad3fa  [prompt_text]  British-English standard: Americanism in learner-facing text
update public.questions set prompt_text = 'Why was Dr Chen specifically invited to speak?' where id = '7765a062-4a54-445b-9790-45f98abad3fa';
-- c2b93204-9377-4ca1-8c3a-9cc9dee7c202  [body]  British-English standard
update public.passages set body = 'Dear Ms Alvarez,
Following our call last week, I am writing to confirm the revised terms for renewing our supply contract. We can offer a 5% discount on bulk orders over 500 units, provided that payment is made within 30 days rather than the current 60-day term. Alternatively, if you prefer to keep the 60-day payment window, we can only extend a 2% discount. We understand that cash flow may be a concern on your end, so we are open to discussing a phased implementation over the next quarter rather than an immediate switch. Please note that these terms are valid until the end of the month, after which our standard pricing will apply. We value our partnership and hope we can reach an agreement that works well for both companies.
Kind regards,
Daniel Ross' where id = 'c2b93204-9377-4ca1-8c3a-9cc9dee7c202';
-- cd88fbd7-5099-43ce-96fd-22bf281dbb56  [body]  British-English standard
update public.passages set body = 'Subject: Registration Confirmed – Annual Sales Conference
Dear Ms Fabre,
Thank you for registering for the Annual Sales Conference, taking place on 14–15 September at the Riverside Convention Centre. Your registration includes access to all keynote sessions, two workshops of your choice, and lunch on both days. Please note that workshop places are allocated on a first-come, first-served basis, so we recommend selecting your preferred sessions through the online portal before 1 September. Your conference badge and materials will be available for collection from the registration desk from 8 am on the first day. If you require a certificate of attendance, this can be requested at the registration desk, but it will only be issued to delegates who attend both days in full. Should your plans change, cancellations made before 1 September are fully refundable; after that date, no refunds can be given, although substitute delegates are welcome at no extra charge.
Kind regards,
Conference Team' where id = 'cd88fbd7-5099-43ce-96fd-22bf281dbb56';
-- e50cf574-95fb-408e-ac18-6ffc60aa258d  [body]  British-English standard
update public.passages set body = 'Subject: Invitation to Speak at Our Annual Industry Summit. Dear Dr Chen, On behalf of the organising committee, I would like to invite you to speak at this year''s Industry Summit, taking place on 14 November in Manchester. Given your recent published research on supply chain resilience, we believe your perspective would be particularly valuable to our audience of over 300 delegates, most of whom are senior operations professionals. We are proposing a 30-minute keynote, followed by a 15-minute question-and-answer session, though we are happy to adjust the format if you would prefer a panel discussion instead. Speakers receive complimentary accommodation for two nights and reimbursement of standard travel costs, though we regret that we are unable to offer a speaking fee this year due to budget constraints. Should you accept, we would need your presentation title and a short biography by 1 October at the latest, as the programme goes to print shortly afterwards. We very much hope you will consider joining us. Kind regards, Summit Organising Committee' where id = 'e50cf574-95fb-408e-ac18-6ffc60aa258d';
-- f6dab89f-82ed-451d-b069-159c2f748494  [correct_answer]  British-English standard: Americanism in learner-facing text
update public.questions set correct_answer = 'Because spending is still reviewed afterwards, and the limit can be lowered again if problems arise' where id = 'f6dab89f-82ed-451d-b069-159c2f748494';
-- f6dab89f-82ed-451d-b069-159c2f748494  [explanation]  British-English standard: Americanism in learner-facing text
update public.questions set explanation = 'The passage says "Finance will still review all expenses retrospectively each quarter" and that "repeated errors or unclear justifications could see the limit lowered again": accountability is retained through review, just applied afterwards instead of blocking approval upfront.' where id = 'f6dab89f-82ed-451d-b069-159c2f748494';
-- f6dab89f-82ed-451d-b069-159c2f748494  [options]  British-English standard
update public.questions set options = '["Because spending is still reviewed afterwards, and the limit can be lowered again if problems arise", "Because department heads no longer need to justify any expenses", "Because finance has stopped monitoring spending altogether", "Because the €2,000 limit applies only to software purchases"]'::jsonb where id = 'f6dab89f-82ed-451d-b069-159c2f748494';
-- f780f5be-788d-4fec-b0a3-92480b088764  [correct_answer]  British-English standard: Americanism in learner-facing text
update public.questions set correct_answer = 'A qualified acceptance: acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule' where id = 'f780f5be-788d-4fec-b0a3-92480b088764';
-- f780f5be-788d-4fec-b0a3-92480b088764  [explanation]  British-English standard: Americanism in learner-facing text
update public.questions set explanation = 'The finance lead "noted that this segmented approach would be more complex to maintain long-term, but agreed the trial data didn''t support a one-size-fits-all conclusion": a concern paired with agreement, not rejection, blanket enthusiasm, or a request to re-run the trial.' where id = 'f780f5be-788d-4fec-b0a3-92480b088764';
-- f780f5be-788d-4fec-b0a3-92480b088764  [options]  British-English standard
update public.questions set options = '["A qualified acceptance: acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule", "Outright rejection of the segmented approach in favour of a universal rollout", "Enthusiastic support for the new model over the old one in general", "A demand for a second six-month trial before any decision is made"]'::jsonb where id = 'f780f5be-788d-4fec-b0a3-92480b088764';

-- ---------- MINOR · speaking ----------
-- 07846b3f-c8f1-41be-8248-e159a0bc8736  [prompt_text]  The duplication itself is real and is not merely 'same topic' — it is the same syntactic frame with an antonym swapped ('What time do you start/finish
update public.questions set prompt_text = 'What do you do at the end of your working day? Tell me two or three things you do before you go home.' where id = '07846b3f-c8f1-41be-8248-e159a0bc8736';

-- ---------- MINOR · writing ----------
-- 0008c924-b30a-4902-bfdb-62ba7b53c606  [prompt_text]  The 'impossible genre' claim fails: a reasonable A1 learner knows exactly what to produce, and the corpus itself establishes the written-note-at-a-des
update public.questions set prompt_text = 'Greet a visitor at reception

You work at the front desk of a company. A visitor has arrived for a meeting with your manager, who is not ready yet. Write a short note to give to the visitor. Welcome them, ask them to wait, and offer them a drink. (30–50 words)' where id = '0008c924-b30a-4902-bfdb-62ba7b53c606';
-- 0204c67e-dc1f-4b37-9167-3501f3037bba  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Asking for a Day Off

You want next Friday off for a family event. Write a short email to your manager, Mr Diallo. Say which day you need off and why. (30–50 words)' where id = '0204c67e-dc1f-4b37-9167-3501f3037bba';
-- 099ea2c3-4cd3-410f-a109-6079007f78fb  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Write a short meeting agenda

You are organising a 30-minute team meeting for Friday morning. Write a short email to your team with the agenda. Include at least three items to discuss and the time and place of the meeting. (50–80 words)' where id = '099ea2c3-4cd3-410f-a109-6079007f78fb';
-- 0ac567f4-d63e-45a1-9b86-09e0785c8581  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Office Move Announcement

Your office is moving to a new building on Bishop Street starting next month. Write a short email to staff. Give the new address, the start date, and tell them where to park. (50–80 words)' where id = '0ac567f4-d63e-45a1-9b86-09e0785c8581';
-- 0f7992ee-38aa-4b9f-995c-48284d65ebc9  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Handling a Subscription Cancellation Request

A customer, Mr Hendricks, emails asking to cancel his premium subscription because he feels it is too expensive. Reply confirming you can process the cancellation, explain what happens to his data and access, and mention a lower-cost plan he might consider instead. (120–160 words)' where id = '0f7992ee-38aa-4b9f-995c-48284d65ebc9';
-- 28c3d828-2798-4bcb-b5e9-16e6be52915d  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Declining a Meeting Invitation Politely

A senior colleague, Ms Okafor, has invited you to a strategy meeting that clashes with an existing client commitment you cannot move. Write a message declining the invitation, explaining the conflict without sounding dismissive, and proposing a way to stay informed or contribute asynchronously. (150–200 words)' where id = '28c3d828-2798-4bcb-b5e9-16e6be52915d';
-- 3688e792-03dc-45f0-9497-e3c253f8dcae  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Process a product exchange

A customer, Mr Chen, bought a medium-sized company polo shirt but needs a large size instead. Write a short email to confirm the exchange and explain what he should do to return the medium shirt. (50–80 words)' where id = '3688e792-03dc-45f0-9497-e3c253f8dcae';
-- 36be6c3c-1fcd-4a05-bf17-b212ca00dcf3  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Follow up after a phone call

You just had a phone call with a client, Ms Rivera. She asked about the price of your company''s training package. Write a short email to follow up. Include the price (€500 per person) and offer to answer more questions. (50–80 words)' where id = '36be6c3c-1fcd-4a05-bf17-b212ca00dcf3';
-- 43087bc8-7a84-478c-9904-2cc52f3357b2  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Explain a delay to a client

Your company''s delivery to client Mrs Novak will be three days late because of a supplier problem. Write an email explaining the delay, apologising, and giving the new delivery date. (80–120 words)' where id = '43087bc8-7a84-478c-9904-2cc52f3357b2';
-- 52832864-1d2a-40d7-afd7-4799793c9cae  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Asking for the Wi-Fi Password

You are working from a different office today and you do not have the Wi-Fi password. Write a short message to a colleague asking for it. (30–50 words)' where id = '52832864-1d2a-40d7-afd7-4799793c9cae';
-- 6903e1b5-6d83-4d16-aa70-7a18318973ba  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Write a post-meeting action plan

You chaired a cross-functional meeting about improving employee retention. Several ideas were discussed, including flexible work options, mentoring programmes, and salary benchmarking. Write a follow-up email to all participants summarising the decisions made, assigning specific action items to team members, and setting deadlines. Include a note about the next review meeting. (120–160 words)' where id = '6903e1b5-6d83-4d16-aa70-7a18318973ba';
-- 6d1412f4-408a-4e5c-9d90-ab5072b8da87  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Project Status Update

Write an email to your project sponsor updating them on the CRM migration project. Explain that data migration is 70% complete, testing has revealed two minor bugs being fixed this week, and the go-live date remains on track for 15 August. (120–160 words)' where id = '6d1412f4-408a-4e5c-9d90-ab5072b8da87';
-- 79ce8120-ff14-42d1-9b82-2abeb9552d8c  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Draft a multi-stakeholder negotiation position paper

Your company is negotiating a five-year public-private partnership with a city government to develop a smart transportation system. Multiple stakeholders have competing interests: the city wants to minimise costs and maximise public benefit, your company seeks a reasonable return on investment, and privacy advocacy groups have raised concerns about data collection. Write a position paper that proposes a framework for balancing these interests, including data governance principles, a revenue-sharing model, and accountability mechanisms. Address each stakeholder group''s primary concern and explain how your proposed framework creates alignment. (200–250 words)' where id = '79ce8120-ff14-42d1-9b82-2abeb9552d8c';
-- 7b4580c5-211f-44cf-9a3e-6d0929c295f2  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Propose a payment plan

Your company provides IT services to a small business client, GreenLeaf Ltd. They are having cash flow problems and cannot pay their €12,000 invoice in full. Write an email proposing a three-month payment plan. Explain how the plan would work and why it benefits both sides. (80–120 words)' where id = '7b4580c5-211f-44cf-9a3e-6d0929c295f2';
-- 8070a143-cd6d-48ea-8412-72b4a7f0f407  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Summarise a team decision

Your team decided in yesterday''s meeting to move the project deadline from 1 June to 15 June because of extra testing needed. Write a short message to the team explaining the decision and the reason. (80–120 words)' where id = '8070a143-cd6d-48ea-8412-72b4a7f0f407';
-- 951c9e73-e53c-456e-8d21-5140c572de78  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Request a lower price

You are buying 200 office chairs from a furniture company. The price is €85 per chair. Write a short email to the sales representative to ask for a discount because you are ordering a large quantity. (50–80 words)' where id = '951c9e73-e53c-456e-8d21-5140c572de78';
-- b4b42960-c7ea-4a2b-9452-bd21360e2d10  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Apologise for a billing error

A long-time customer, Ms Thompson, was charged twice for the same invoice. She sent an email to complain. Write a professional response apologising for the mistake, explaining what happened, and describing the steps your company will take to correct the error and prevent it from happening again. (80–120 words)' where id = 'b4b42960-c7ea-4a2b-9452-bd21360e2d10';
-- c4f5e40f-e192-4e11-893c-279ff3e78c35  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Confirm a meeting time

Your manager, Mr Diallo, asked you to meet on Thursday. Write a short email to confirm the day and time (10:00) and say where (his office). (30–50 words)' where id = 'c4f5e40f-e192-4e11-893c-279ff3e78c35';
-- cb323b04-6a23-4835-b510-f7ac60f15178  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Following Up After a Networking Event

You met Dr Elena Vasquez, a potential industry partner, at a conference last week and had a promising conversation about a possible collaboration. Write a follow-up message that re-establishes rapport, subtly reminds her of the specifics you discussed, and proposes a concrete next step without appearing overly eager. (180–250 words)' where id = 'cb323b04-6a23-4835-b510-f7ac60f15178';
-- cf64768f-540c-40e9-aba2-d710c1c8c4ae  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Reply to a customer complaint

A customer, Mr Hendricks, wrote to complain that his order arrived damaged. Write a reply that acknowledges the problem, apologises, explains what you will do (replace the item within 5 days), and offers a small discount on his next order. (120–160 words)' where id = 'cf64768f-540c-40e9-aba2-d710c1c8c4ae';
-- d70356d8-bbca-485f-b812-62dc44160866  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Accept a delivery date

A supplier has offered to deliver your order on 15 March. You are happy with this date. Write a short reply to accept the delivery date and say thank you. (30–50 words)' where id = 'd70356d8-bbca-485f-b812-62dc44160866';
-- ea2c093d-727e-4c4d-9c36-814e8a43e02a  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Summarise a conference call

You participated in a conference call with a client about a new marketing project. Write an email to your manager summarising the key points discussed, including the project timeline (launch in June), the budget (€15,000), and the next steps (send a proposal by Friday). (80–120 words)' where id = 'ea2c093d-727e-4c4d-9c36-814e8a43e02a';
-- ef2355cb-b463-42cb-8a26-5b604dad317d  [prompt_text]  British-English standard / internal spelling consistency
update public.questions set prompt_text = 'Write a note about a missed call

A customer called while your colleague was away from their desk. Write a short note for your colleague with the caller''s name (Mr Park), phone number (020 7946 0192), and reason for the call (delivery question). (30–50 words)' where id = 'ef2355cb-b463-42cb-8a26-5b604dad317d';

commit;
