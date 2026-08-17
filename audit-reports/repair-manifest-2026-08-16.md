# CLOE pedagogy audit 2026-08-16 — repair manifest

**Purpose: resumability.** If a repair run dies mid-way, a fresh session diffs the
current DB state against this manifest and skips every item that already matches —
no re-derivation, no lost work.

**Stage 1 (audio-safe): 126 column updates across 88 rows.**
Migration: `supabase/migrations/20260817103129_pedagogy_audit_2026_08_16.sql`

Every entry below survived an independent adversarial verification pass whose brief
was to *refute* it. Refuted findings and downgrade-to-no-change findings are absent.
Each verified fix was also re-tested against the defect it removes.

## Invariants re-checked after simulating every update

| invariant | result |
|---|---|
| MCQ/listening/reading: `correct_answer` present in `options` | 0 failures |
| MCQ family: no duplicate options | 0 failures |
| gap_fill: canonical answer in accept-list, `_____` marker intact | 0 failures |
| reconstruction: `' '.join(options) == correct_answer` | 0 failures |
| word_bank: every `{{n}}` blank survives; answer still in pool | 0 failures |
| writing: `(NN–NN words)` still parsed by practice.writing.tsx:45 | 72/72 |
| listening: first quoted span (the spoken script) byte-identical | 0 desyncs |

---

## CRITICAL · grammar_vocab / mcq

### `363e7188-c7f7-41cb-bdab-26f4c3eaedf6` — `questions.prompt_text`
*'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturally than the keyed sentence for many B2 learners in a digital-business context. The bare stem contains nothing — no money word, no unit — that points to income specifically. A learner with genuinely good business English is punished. The other two dist …*

```diff
- Our _____ increased by 15% this quarter.
+ Our _____ increased by 15% this quarter, meaning we earned more money from sales.
```

### `363e7188-c7f7-41cb-bdab-26f4c3eaedf6` — `questions.explanation`
*'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturally than the keyed sentence for many B2 learners in a digital-business context. The bare stem contains nothing — no money word, no unit — that points to income specifically. A learner with genuinely good business English is punished. The other two dist …*

```diff
- 'Revenue' refers to the income a business generates, which can rise or fall by a percentage.
+ 'Revenue' is the money a business earns from sales, so a 15% rise in revenue means it earned more. 'Expenditure' is money spent, 'headcount' is the number of employees, and 'downtime' is time when systems are not working — an increase in any of those does not mean more money was earned.
```

### `363e7188-c7f7-41cb-bdab-26f4c3eaedf6` — `questions.options`
*'Our traffic increased by 15% this quarter' is ordinary, high-frequency business English (web traffic, footfall, call traffic) and reads more naturally than the keyed sentence for many B2 learners in a digital-business context. The bare stem contains nothing — no money word, no unit — that points to income specifically. A learner with genuinely good business English is punished. The other two dist …*

```diff
- ["revenue", "recipe", "rainfall", "traffic"]
+ ["revenue", "expenditure", "headcount", "downtime"]
```

### `55d57a5c-c44e-4cd6-9972-63bb9edde156` — `questions.prompt_text`
*Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British form (Swan; Fowler) and the site's declared standard is British — this is the exact BrE-correct/AmE-keyed inversion that must be confirmed, not refuted. The explanation 'On is used with the names of streets' teaches the American convention as though it  …*

```diff
- The new office is located _____ Main Street.
+ The new office is located _____ 25 Main Street.
```

### `55d57a5c-c44e-4cd6-9972-63bb9edde156` — `questions.explanation`
*Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British form (Swan; Fowler) and the site's declared standard is British — this is the exact BrE-correct/AmE-keyed inversion that must be confirmed, not refuted. The explanation 'On is used with the names of streets' teaches the American convention as though it  …*

```diff
- 'On' is used with the names of streets.
+ When an address includes the building number, English uses 'at': 'at 25 Main Street'. (Without a number, British English says 'in Main Street' and American English says 'on Main Street', so a bare street name has no single right answer.) 'Since' is only used for time, not place.
```

### `55d57a5c-c44e-4cd6-9972-63bb9edde156` — `questions.options`
*Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British form (Swan; Fowler) and the site's declared standard is British — this is the exact BrE-correct/AmE-keyed inversion that must be confirmed, not refuted. The explanation 'On is used with the names of streets' teaches the American convention as though it  …*

```diff
- ["on", "in", "at", "since"]
+ ["at", "on", "in", "since"]
```

### `55d57a5c-c44e-4cd6-9972-63bb9edde156` — `questions.correct_answer`
*Stem is 'The new office is located _____ Main Street.' with no house number, so nothing excludes 'in'. 'In Main Street' is the traditional British form (Swan; Fowler) and the site's declared standard is British — this is the exact BrE-correct/AmE-keyed inversion that must be confirmed, not refuted. The explanation 'On is used with the names of streets' teaches the American convention as though it  …*

```diff
- on
+ at
```

### `69ac63c4-01f1-4eb4-9a86-036cc08c47e7` — `questions.prompt_text`
*Backshift is optional, not obligatory, when the reported situation still holds — Swan and the Cambridge Grammar both treat 'She asked me where I live' as correct when the person has not moved. The stem supplies no change of situation. Decisively, the file's own sibling item 3a9ef0c4 gets this right, adding 'The project has since been completed' precisely to make backshift obligatory and even sayin …*

```diff
- She asked me, 'Where do you live?' She asked me _____.
+ She asked me, 'Where do you live?' I have since moved to another city. Report her question: She asked me _____.
```

### `69ac63c4-01f1-4eb4-9a86-036cc08c47e7` — `questions.explanation`
*Backshift is optional, not obligatory, when the reported situation still holds — Swan and the Cambridge Grammar both treat 'She asked me where I live' as correct when the person has not moved. The stem supplies no change of situation. Decisively, the file's own sibling item 3a9ef0c4 gets this right, adding 'The project has since been completed' precisely to make backshift obligatory and even sayin …*

```diff
- Reported questions use normal statement word order with no inversion and backshift the tense, so 'do you live' becomes 'I lived.'
+ Reported questions use statement word order with no inversion, so 'do you live' cannot stay as 'do I live' or become 'did I live'. Backshift ('live' to 'lived') is optional when the situation is still true, but obligatory here because the speaker has since moved away.
```

### `8294f46d-837a-44c9-b7d1-b31e8e6e4df7` — `questions.explanation`
*Both halves check out. 'Previous to' is recorded as a preposition meaning 'before' in the OED and Merriam-Webster and is attested in formal writing, so the distractor is genuinely correct in the stem — a C2 learner with wide reading is punished for it. And the explanation's blanket claim that 'the other forms are not standard English' is false as stated. Dual defect: second valid answer plus a fal …*

```diff
- 'Prior to' is the correct formal preposition phrase meaning 'before'; the other forms are not standard English.
+ 'Prior to' is the standard formal preposition meaning 'before'. 'Prior of', 'prior than' and 'previous of' do not exist in English. (Note that 'previous to' is a genuine, though much rarer, alternative to 'prior to'.)
```

### `8294f46d-837a-44c9-b7d1-b31e8e6e4df7` — `questions.options`
*Both halves check out. 'Previous to' is recorded as a preposition meaning 'before' in the OED and Merriam-Webster and is attested in formal writing, so the distractor is genuinely correct in the stem — a C2 learner with wide reading is punished for it. And the explanation's blanket claim that 'the other forms are not standard English' is false as stated. Dual defect: second valid answer plus a fal …*

```diff
- ["prior to", "prior of", "previous to", "prior than"]
+ ["prior to", "prior of", "previous of", "prior than"]
```

### `e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be` — `questions.prompt_text`
*'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 'before' is the default way to say this, arguably more natural than the key. 'The team were negotiating...' is also fine with BrE collective plural agreement. Two defensible alternatives against one key, with an exact-match grader. Confirmed at criti …*

```diff
- The team _____ for over three hours before the CEO finally arrived.
+ By the time the CEO finally arrived, the team _____ for over three hours and were visibly exhausted.
```

### `e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be` — `questions.explanation`
*'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 'before' is the default way to say this, arguably more natural than the key. 'The team were negotiating...' is also fine with BrE collective plural agreement. Two defensible alternatives against one key, with an exact-match grader. Confirmed at criti …*

```diff
- Past perfect continuous emphasises the duration of an action in progress up until another past event.
+ The past perfect continuous (had been + -ing) describes an action that continued for a period up to a point in the past. 'By the time the CEO arrived' fixes that point and 'for over three hours' gives the duration, so 'had been negotiating' is required. The past simple 'negotiated' cannot express du …
```

### `e5c00d35-b405-46cd-8bbb-9a9ea7a2f0be` — `questions.options`
*'The team negotiated for over three hours before the CEO finally arrived' is unimpeachable standard English — past simple with a duration phrase plus 'before' is the default way to say this, arguably more natural than the key. 'The team were negotiating...' is also fine with BrE collective plural agreement. Two defensible alternatives against one key, with an exact-match grader. Confirmed at criti …*

```diff
- ["had been negotiating", "negotiated", "has negotiated", "were negotiating"]
+ ["had been negotiating", "negotiated", "has negotiated", "have been negotiating"]
```

## MAJOR · grammar_vocab / gap_fill

### `0215289d-f812-4fbe-b08f-e42cff937b3b` — `questions.prompt_text`
*Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_vocab_gap_fill.json, so it is free-typed and its `options` array doubles as the accept-list (src/lib/utils.ts:85-89, consumed at practice.grammar-vocab.tsx:229-238 and mock-exam.tsx:522-524). The current accept-list is ['submit','should submit'], which  …*

```diff
- The auditor insisted that the manager _____ all receipts before month-end.
+ In formal written English, 'insist that' can be followed by the mandative subjunctive — the base form of the verb, with no 'should' and no tense ending: 'The auditor insisted that the manager _____ all receipts before month-end.'
```

### `0215289d-f812-4fbe-b08f-e42cff937b3b` — `questions.explanation`
*Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_vocab_gap_fill.json, so it is free-typed and its `options` array doubles as the accept-list (src/lib/utils.ts:85-89, consumed at practice.grammar-vocab.tsx:229-238 and mock-exam.tsx:522-524). The current accept-list is ['submit','should submit'], which  …*

```diff
- Mandative subjunctive after verbs like 'insist that' uses the base form of the verb regardless of the subject.
+ After verbs of demanding or requiring — 'insist', 'demand', 'require', 'recommend', 'propose' — a 'that' clause can take the mandative subjunctive: the base form of the verb, unchanged for person or tense, so 'that the manager submit', never 'submits'. British English also allows 'that the manager s …
```

### `0215289d-f812-4fbe-b08f-e42cff937b3b` — `questions.options`
*Owner-directed rewrite. Important correction to the audit's framing: this item is NOT in grammar_vocab_mcq.json — it is a gap_fill item in grammar_vocab_gap_fill.json, so it is free-typed and its `options` array doubles as the accept-list (src/lib/utils.ts:85-89, consumed at practice.grammar-vocab.tsx:229-238 and mock-exam.tsx:522-524). The current accept-list is ['submit','should submit'], which  …*

```diff
- ["submit", "should submit"]
+ ["submit"]
```

### `0f924792-4c64-41c4-b41e-43a5057aa689` — `questions.options`
*'-ize' is not an Americanism: Oxford spelling prefers 'finalize' and it is fully standard British English, so accepting 'finalise' while rejecting 'finalize' penalises a legitimate BrE variant of an answer the item already blesses. This is the one case in the batch where a so-called American spelling genuinely belongs.*

```diff
- ["sign", "finalise"]
+ ["sign", "finalise", "finalize"]
```

### `1da354d4-81cb-4595-9d9a-e88f8ab469bd` — `questions.options`
*Tag is 'tenses', so the target is past-simple form, not lexis; 'got' is itself an irregular past simple (get→got) and 'the team got a new printer' is fully natural BrE, so the teaching point survives. Rejecting it marks a correct answer wrong.*

```diff
- ["bought", "purchased"]
+ ["bought", "purchased", "got"]
```

### `2476b08e-136c-4d15-a4c2-9bd4a9ec7bb7` — `questions.options`
*'Was taking a phone call' is fully natural BrE and is the same past-continuous structure the item drills. 'Was on a phone call' is also current standard usage and remains past continuous (of 'be'), so the interrupted-action teaching point is intact.*

```diff
- ["was making", "was having"]
+ ["was making", "was having", "was taking", "was on"]
```

### `3189e813-1eb4-4001-8ca3-53fc878dee90` — `questions.options`
*'Bring in' is a phrasal verb that fits and preserves the drill, so it is added; but 'introduce' and 'implement' are plain verbs on a phrasal-only accept-list and admitting them would dissolve the item. The finding's underlying observation is nonetheless valid: 'phase in … gradually' is pleonastic, which is what makes plain verbs look equally right.*

```diff
- ["phase in", "roll out"]
+ ["phase in", "roll out", "bring in"]
```

### `436a4f94-e822-47a1-bf81-40ebd7bbdaa8` — `questions.options`
*Unlike the other phrasal items, this accept-list already contains the plain verb 'prepare', so the phrasal-only teaching point has already been conceded and rejecting 'create' costs nothing pedagogically. 'Pull together a presentation' is idiomatic BrE and is itself phrasal.*

```diff
- ["put together", "prepare", "throw together"]
+ ["put together", "prepare", "throw together", "pull together", "create"]
```

### `467914d0-1884-4ff8-a197-3d12a9a4e5ed` — `questions.options`
*With no cue anywhere in the stem pointing to a low-frequency C2 verb, 'sell off', 'offload' and 'sell' are all correct completions of the sentence as written, so the item currently fails learners who write good English. 'Spin off' is refused: it denotes creating a separate independent entity, a materially different transaction from divesting.*

```diff
- ["divest"]
+ ["divest", "sell off", "offload", "sell"]
```

### `50ab01cc-a26e-4cdf-83ba-f4a5ac6d10c0` — `questions.options`
*The list already accepts 'admitted to', so rejecting the bare transitive 'admitted the mistake' — which is the more idiomatic form before a noun object — is indefensible. 'Acknowledged' and 'came clean about' are both correct in the frame.*

```diff
- ["owned up to", "admitted to", "confessed to"]
+ ["owned up to", "admitted to", "confessed to", "admitted", "acknowledged", "came clean about"]
```

### `5b1f0b8d-736b-46aa-8d4a-f90b395f98ed` — `questions.options`
*'The merger fell apart at the last minute' is exactly as idiomatic as 'fell through' and the list already accepts the non-phrasal 'collapsed', so there is no teaching-point defence for rejecting it. 'Broke down' does not survive: in BrE it is talks/negotiations that break down, not the merger itself.*

```diff
- ["fell through", "collapsed"]
+ ["fell through", "collapsed", "fell apart"]
```

### `5db43218-64ea-4e2a-827c-6b1ca79866b5` — `questions.options`
*'Nonetheless' and the already-accepted 'nevertheless' are interchangeable formal contrastive connectors; accepting one and rejecting the other is arbitrary. It satisfies exactly what the stem asks — a formal replacement for sentence-initial 'but'.*

```diff
- ["however", "nevertheless"]
+ ["however", "nevertheless", "nonetheless"]
```

### `5f5f14d2-d5f5-452d-825c-b2deddafbbbd` — `questions.options`
*'A three-month trial period' is standard BrE employment language, and the item's own explanation glosses probation as 'a trial period' — rejecting the word the explanation uses to define the answer is indefensible.*

```diff
- ["probation", "probationary"]
+ ["probation", "probationary", "trial"]
```

### `628d273d-1c13-4d5a-bec4-37d96d54afb4` — `questions.options`
*The stem genuinely under-determines the answer — phone, mobile, tablet, PC and desktop all write emails and check a schedule — and the explanation's claim that 'no other common office item performs these functions' is factually false. This is an item-design defect, not just a missing synonym.*

```diff
- ["computer", "laptop"]
+ ["computer", "laptop", "pc", "desktop", "desktop computer"]
```

### `74142bb5-9081-4ecc-ab90-f61f8cd2ff47` — `questions.options`
*'Brush up' is listed transitively without 'on' in both Cambridge and Oxford ('brush up your Spanish'), so the current single-entry list marks standard British English wrong. 'Polish up her rusty Spanish' is equally idiomatic, and both remain phrasal verbs so the C2 teaching point is untouched.*

```diff
- ["brush up on"]
+ ["brush up on", "brush up", "polish up"]
```

### `8f1a6d53-e431-4917-8825-848c3b4912bf` — `questions.options`
*'Set up a bank account' is a fully standard BrE collocation, so rejecting it marks correct English wrong. 'Open up a bank account' is colloquial and AmE-leaning and is not standard in a bank-counter register, so it does not survive.*

```diff
- ["open"]
+ ["open", "set up"]
```

### `96af1248-67e2-4448-8f0e-9efd1cc99a22` — `questions.options`
*The item tests the past-perfect half of a mixed conditional, and 'had completed', 'had undergone' and 'had received' are all correct past perfects that collocate normally with 'training'. None changes the structure being tested.*

```diff
- ["had taken", "had done"]
+ ["had taken", "had done", "had completed", "had undergone", "had received"]
```

### `af1ea971-854c-4310-b08e-e8364e5eead7` — `questions.options`
*'Resulted in' is a direct equivalent of the already-accepted 'led to', so the list is internally inconsistent; 'the reforms resulted in significant changes' is unimpeachable. 'Triggered' is refused because it implies a sudden precipitating event, which sits awkwardly with cultural change 'within two years'.*

```diff
- ["brought about", "led to"]
+ ["brought about", "led to", "resulted in"]
```

### `af8d6dd7-9495-45d9-bcf3-3a5e62ddfcd2` — `questions.options`
*'According to company policy' explicitly licenses an obligation reading, so 'must/should be processed' and 'are to be processed' are correct and remain passives — the item's stated target. 'Are paid' is also correct English since the item tests form, not lexis, and nothing in the stem cues 'processed' over it.*

```diff
- ["are processed"]
+ ["are processed", "must be processed", "should be processed", "are to be processed", "are paid", "must be paid"]
```

### `c5db7144-5dbb-453d-a4a9-cc1b66d1b4d8` — `questions.options`
*The accept-list already includes the non-phrasal 'draft', so the phrasal-only rationale does not apply here and 'prepare a new contract' is plainly correct. 'Write up' and 'put together' are both real, correct collocations with contract/document.*

```diff
- ["draw up", "draft"]
+ ["draw up", "draft", "prepare", "put together", "write up"]
```

### `c9336b13-7e6c-4189-8cab-560ecf6a9123` — `questions.options`
*'Could you kindly send me the report?' is standard formal BrE and satisfies exactly what the stem asks for — a politeness marker replacing the bare imperative. Nothing about accepting it undermines the 'please' teaching point.*

```diff
- ["please"]
+ ["please", "kindly"]
```

### `f0f44c23-698c-41d1-b713-c84ebb07b453` — `questions.options`
*'Has set up three new offices since 2015' is natural BrE and is the same present-perfect structure the item drills, so it neither changes the target nor introduces bad English. It sits alongside the already-accepted 'has established'/'has launched' as a direct equivalent.*

```diff
- ["has opened", "has established", "has launched"]
+ ["has opened", "has established", "has launched", "has set up"]
```

### `fe054509-34b0-4ae1-8c0b-ab775d4de069` — `questions.options`
*The stem asks for the standard formal-request formula and there is more than one: 'I would appreciate it if…' and the distinctively British 'I should be grateful if…' are both textbook, and intensified 'would be most/very grateful' is standard correspondence register. A single-entry accept-list on an open formula item is a genuine defect.*

```diff
- ["would be grateful"]
+ ["would be grateful", "would be most grateful", "would be very grateful", "should be grateful", "should be most grateful", "should be very grateful", "would appreciate it"]
```

## MAJOR · grammar_vocab / mcq

### `0de85b5d-f568-48f7-88ab-ab34c60a5e52` — `questions.explanation`
*Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the American 'harbor' and repeats it in the explanation. On a declared-BrE site the keyed C2 collocation is spelled American. No second-valid-answer problem — 'carry', 'keep' and 'do' are all wrong with 'doubts' in this frame — so the defect is confined to spel …*

```diff
- The fixed collocation is "harbor doubts"; "carry/keep/do doubts" are not correct English.
+ The fixed collocation is 'harbour doubts' — to hold doubts privately without expressing them. Note the British spelling 'harbour' ('harbor' is American). 'Carry', 'keep' and 'do' are not used with 'doubts' in this way.
```

### `0de85b5d-f568-48f7-88ab-ab34c60a5e52` — `questions.options`
*Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the American 'harbor' and repeats it in the explanation. On a declared-BrE site the keyed C2 collocation is spelled American. No second-valid-answer problem — 'carry', 'keep' and 'do' are all wrong with 'doubts' in this frame — so the defect is confined to spel …*

```diff
- ["harbor", "carry", "keep", "do"]
+ ["harbour", "carry", "keep", "do"]
```

### `0de85b5d-f568-48f7-88ab-ab34c60a5e52` — `questions.correct_answer`
*Verified the internal inconsistency: item 14bf6dff in the same file uses the British spelling 'harbour' as an option, while this item keys the American 'harbor' and repeats it in the explanation. On a declared-BrE site the keyed C2 collocation is spelled American. No second-valid-answer problem — 'carry', 'keep' and 'do' are all wrong with 'doubts' in this frame — so the defect is confined to spel …*

```diff
- harbor
+ harbour
```

### `1286cb32-56ac-4773-9ba3-9197f026087b` — `questions.explanation`
*Kind 2, verified. 'Find a balance' is fully standard English and extremely common in exactly this policy register ('find a balance between work and family life'). The aggravating factor: 'find' is not even among the options, so the explanation goes out of its way to teach a falsehood the item never needed to mention. A learner who has correctly acquired 'find a balance' is told to unlearn it.*

```diff
- "Strike a balance" means to find a satisfactory middle point between two things — an idiomatic pairing, not "make" or "find" a balance.
+ 'Strike a balance' is the idiomatic collocation for reaching a satisfactory middle point between two competing things. 'Make a balance', 'hold a balance' and 'take a balance' are not used in this sense. ('Find a balance' is also correct English, but it is not one of the options here.)
```

### `1a6442e2-3747-49fb-b900-88a153be1542` — `questions.prompt_text`
*Read the full stem: it fixes when the words were spoken ('on Monday') but never when they are being reported. Deictic shift depends entirely on the reporting moment, so if you relay this on Monday itself, 'He said he would finish the report tomorrow' is the correct and natural form — the 'will' to 'would' backshift is independent of the time adverb and does not force the shift. Both 'the next day' …*

```diff
- He told me on Monday, 'I'll finish the report tomorrow.' He said he would finish the report _____.
+ He told me on Monday, 'I'll finish the report tomorrow.' Reporting his words the following week, you say: He said he would finish the report _____.
```

### `1a6442e2-3747-49fb-b900-88a153be1542` — `questions.explanation`
*Read the full stem: it fixes when the words were spoken ('on Monday') but never when they are being reported. Deictic shift depends entirely on the reporting moment, so if you relay this on Monday itself, 'He said he would finish the report tomorrow' is the correct and natural form — the 'will' to 'would' backshift is independent of the time adverb and does not force the shift. Both 'the next day' …*

```diff
- In reported speech, time expressions shift back one step from the moment of speaking, so 'tomorrow' becomes 'the next day.'
+ Time words that depend on the moment of speaking shift when you report at a distant later time: 'tomorrow' becomes 'the next day' (the day after he spoke — Tuesday). 'Tomorrow' would only be correct if you were reporting on Monday itself. 'Yesterday' and 'the previous day' point backwards from the w …
```

### `2f079dd9-3940-4ea4-ab47-05ecd73ebd4a` — `questions.explanation`
*Kind 2, and the false rule is verified: 'take a decision' is standard formal British English (Collins and OED both record it; it is routine in UK institutional and EU register). The explanation's 'English pairs decision with make, not do or take' directly contradicts the site's own declared British standard. No grading harm — 'take' is not among the options — so the defect is purely in what the ex …*

```diff
- English pairs "decision" with "make", not "do" or "take" — "make a decision" is the natural collocation for deciding on something.
+ 'Make a decision' is the standard collocation in both British and American English. ('Take a decision' also exists in formal British English, though it is not offered here.) 'Do a decision' and 'have a decision' are not used at all, and 'give a decision' works only of a judge or referee announcing a …
```

### `38a1dace-de82-44c5-8d4f-529ab047eff0` — `questions.explanation`
*'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard is British, the keyed answer — the one form the learner is told is right — is the American one. This is the mirror image of a defensible-distractor case: here the key itself is off-standard, so every learner is taught the wrong variety.*

```diff
- 'Get around to' means to finally find time to do something after a delay.
+ 'Get around to (something)' means to finally find the time to do it after a delay. British English uses 'got' as the past participle of 'get', so it is 'I haven't got around to it yet' ('gotten' is American). The other three are separable phrasal verbs that would need the object in the middle — 'iro …
```

### `38a1dace-de82-44c5-8d4f-529ab047eff0` — `questions.options`
*'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard is British, the keyed answer — the one form the learner is told is right — is the American one. This is the mirror image of a defensible-distractor case: here the key itself is off-standard, so every learner is taught the wrong variety.*

```diff
- ["gotten around to", "ironed out", "phased out", "rolled out"]
+ ["got around to", "ironed out", "phased out", "rolled out"]
```

### `38a1dace-de82-44c5-8d4f-529ab047eff0` — `questions.correct_answer`
*'Gotten' as the past participle of 'get' is American; British English uses 'got' ('I haven't got around to it yet'). On a site whose declared standard is British, the keyed answer — the one form the learner is told is right — is the American one. This is the mirror image of a defensible-distractor case: here the key itself is off-standard, so every learner is taught the wrong variety.*

```diff
- gotten around to
+ got around to
```

### `3eff3c84-4d17-46de-99ab-627a21e87043` — `questions.explanation`
*'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve one's own hard work. 'Your hard work has been well deserved' is semantically incoherent and there is no non-strained reading that rescues it. No learner is mis-graded (all three distractors are informal, so the register test still resolves), which is  …*

```diff
- A company-wide email calls for polite, professional congratulations rather than casual slang.
+ A company-wide email needs full, professional wording: 'Congratulations' written out, a complete sentence, and no slang. 'Nice one', 'Congrats' and 'Heard you got...' are casual spoken forms suited to a message between friends; the last one is also inaccurate, since a promotion is not a new job.
```

### `3eff3c84-4d17-46de-99ab-627a21e87043` — `questions.options`
*'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve one's own hard work. 'Your hard work has been well deserved' is semantically incoherent and there is no non-strained reading that rescues it. No learner is mis-graded (all three distractors are informal, so the register test still resolves), which is  …*

```diff
- ["Congratulations on your promotion; your hard work has been well deserved.", "Nice one, well done!", "Congrats, you really earned this!", "Heard you got a new job, nice."]
+ ["Congratulations on your promotion; it is thoroughly well deserved after all your hard work.", "Nice one, well done!", "Congrats, you really earned this!", "Heard you got a new job, nice."]
```

### `3eff3c84-4d17-46de-99ab-627a21e87043` — `questions.correct_answer`
*'Well deserved' predicates merit of a reward, not of the effort that earned it — one deserves a promotion, a rest, recognition; one does not deserve one's own hard work. 'Your hard work has been well deserved' is semantically incoherent and there is no non-strained reading that rescues it. No learner is mis-graded (all three distractors are informal, so the register test still resolves), which is  …*

```diff
- Congratulations on your promotion; your hard work has been well deserved.
+ Congratulations on your promotion; it is thoroughly well deserved after all your hard work.
```

### `516c146c-9f6a-4054-9216-aecc89678866` — `questions.explanation`
*Re-read the full stem: 'I _____ that report yesterday.' There is no aspect marker, no subordinator and no completion adverbial — nothing excludes past continuous. 'I was writing that report yesterday' is natural, unmarked English (ongoing activity over a past day). The explanation only rules out the present perfect, so the item silently punishes a correct past-continuous choice.*

```diff
- The definite past time marker 'yesterday' requires the past simple, not the present perfect, which is used for unspecified past time.
+ 'Yesterday' is a finished past time, so English uses the past simple: 'wrote'. The present perfect ('have written') and present perfect continuous ('have been writing') cannot be combined with a finished past time expression, and the present simple 'write' cannot describe a completed past event.
```

### `516c146c-9f6a-4054-9216-aecc89678866` — `questions.options`
*Re-read the full stem: 'I _____ that report yesterday.' There is no aspect marker, no subordinator and no completion adverbial — nothing excludes past continuous. 'I was writing that report yesterday' is natural, unmarked English (ongoing activity over a past day). The explanation only rules out the present perfect, so the item silently punishes a correct past-continuous choice.*

```diff
- ["wrote", "have written", "have been writing", "was writing"]
+ ["wrote", "have written", "have been writing", "write"]
```

### `607882d8-50bd-4c47-a04f-a1d8240a1ebd` — `questions.explanation`
*Kind 2, verified, and structurally identical to 1286cb32. 'Take the opportunity to do something' is standard English of the most ordinary kind, and 'take' is not among the options — so the explanation volunteers a false rule with no bearing on the item. This is doubly damaging because 'seize' and 'take' are near-synonyms here, so the learner is being pushed away from the commoner of the two.*

```diff
- "Seize an opportunity" means to take quick advantage of a chance — the standard verb pairing, not "take" or "catch" an opportunity.
+ 'Seize an opportunity' means to take quick, decisive advantage of a chance. 'Make an opportunity' means creating one that did not exist, which does not fit an opportunity that is already there, and 'hold/catch an opportunity' are not English collocations. ('Take the opportunity to do something' is a …
```

### `a277e24b-87ae-4159-a33e-cae3d3712aa1` — `questions.prompt_text`
*Both halves confirmed. Non-backshift after a past reporting verb is permitted when the reported situation still holds, so 'She told me she has already sent the invoice' is defensible on the bare stem. And the explanation's stated reason — that 'has' simply 'fails to backshift and doesn't agree in tense with the reporting verb' — presents backshift as a mechanical agreement requirement, which is no …*

```diff
- She told me, 'I've already sent the invoice.' She told me she _____ already sent the invoice.
+ She told me last month, 'I've already sent the invoice.' The invoice never arrived. She told me she _____ already sent the invoice.
```

### `a277e24b-87ae-4159-a33e-cae3d3712aa1` — `questions.explanation`
*Both halves confirmed. Non-backshift after a past reporting verb is permitted when the reported situation still holds, so 'She told me she has already sent the invoice' is defensible on the bare stem. And the explanation's stated reason — that 'has' simply 'fails to backshift and doesn't agree in tense with the reporting verb' — presents backshift as a mechanical agreement requirement, which is no …*

```diff
- In reported speech, present perfect ('have sent') backshifts to past perfect ('had sent'). 'Has' and 'have' fail to backshift and don't agree in tense with the reporting verb 'told'. 'Was' would require a passive construction ('was sent') and doesn't fit the active meaning of the original statement.
+ After a past reporting verb, the present perfect 'have sent' normally backshifts to the past perfect 'had sent'. Keeping the present perfect ('has sent') is possible only when the speaker treats the reported statement as still true, which is impossible here because the invoice never arrived. 'Have'  …
```

### `b93baa9e-08fc-4b9c-aa1d-cf912acd23fb` — `questions.explanation`
*Kind 2, verified. 'Win a deal' is common, unremarkable business English (win a deal, win the deal, deal wins) — the explanation's flat assertion that it 'is not idiomatic' is false, and the contrast it draws with 'win a contract' is not a real distinction. The keyed answer is still right for the reason the explanation fails to give: the stem has two sides jointly reaching agreement, which is incom …*

```diff
- 'Strike a deal' is the correct fixed collocation meaning to reach an agreement. 'Hit a deal' and 'beat a deal' are not standard English collocations. 'Win a deal' is not idiomatic; you 'win a contract' or 'win a tender', but not 'win a deal'.
+ 'Strike a deal' is the fixed collocation for two sides reaching an agreement together. 'Win a deal' does exist in business English, but it means beating rivals to secure business for yourself, so it cannot describe two sides jointly agreeing after negotiation. 'Hit a deal' is not English at all, and …
```

### `cbfe921b-90f2-4b4b-a53c-03eaa70562f4` — `questions.explanation`
*Kind 2, verified false. 'Already' does not require the present perfect in any variety: 'I already knew that', 'She already left' (AmE past simple), 'Are you here already?' (present), 'He had already gone' (past perfect). The subject's person is irrelevant to tense selection — the explanation fuses a real agreement fact ('she' takes 'has') with a fabricated tense rule. Checked the option set for a  …*

```diff
- 'Already' with a third-person singular subject requires the present perfect 'has finished'.
+ Here 'already' marks an action completed before now whose result still matters, so English uses the present perfect: has/have + past participle. 'She' is third person singular, so the auxiliary is 'has'. 'Have finished' would need I/you/we/they. 'Since' cannot be used in these options because it int …
```

## MAJOR · grammar_vocab / word_bank

### `1aec4974-ba5c-4650-9e3c-96a9e41111d7` — `questions.explanation`
*Confirmed on all points; I could not refute any part. The blank-5 explanation asserts that "'regain' would wrongly imply the talks previously had momentum before stalling" — but (a) the passage states exactly that two sentences earlier ('the negotiations very nearly broke down over disagreements about executive compensation'), (b) the target sentence itself ends 'once more', which explicitly encod …*

```diff
- "Gain traction" is the fixed collocation for building fresh momentum; "regain" would wrongly imply the talks previously had momentum before stalling.
+ 'Gain traction' is the fixed business collocation for a process starting to make real progress; the adverbial 'once more' carries the sense of resumption, so the verb itself stays 'gain'. No other word in the pool collocates with 'traction'.
```

### `51650db1-4fab-4c9a-bea9-d0877fd90ff3` — `passages.body`
*Confirmed. 'The report has been reviewed carefully by the panel, and, despite having several minor c*

```diff
- Dear Ms. Owusu, I am writing {{1}} your request for feedback on the quarterly performance review. The report has been reviewed carefully by the panel, and, {{2}} having several minor concerns, your overall contribution was judged to be highly satisfactory. {{3}} to the meeting, please review the att …
+ Dear Ms. Owusu, I am writing {{1}} your request for feedback on the quarterly performance review. The report has been reviewed carefully by the panel, and, {{2}} several minor concerns raised during that review, your overall contribution was judged to be highly satisfactory. {{3}} to the meeting, pl …
```

### `9579187e-0725-45c9-a9f6-b69ef02fdc58` — `passages.body`
*Split verdict. The cross-substitution half is REFUTED: 'would' is the answer to blank 3, whose inver*

```diff
- No sooner had the breach been detected than the incident-response team {{1}} into action, activating protocols that had been rehearsed only weeks earlier. By the time the regulator's inquiry landed on the general counsel's desk, the company {{2}} already notified every affected client, a fact that w …
+ No sooner had the breach been detected than the incident-response team {{1}} into action, activating protocols that had been rehearsed only weeks earlier. By the time the regulator's inquiry landed on the general counsel's desk, the company {{2}} already notified every affected client, a fact that w …
```

### `b812664a-6dde-4807-af6a-952bd4215850` — `passages.body`
*Survives every refutation test. Pool is ['with','into','in','under','at','on','of']; answers are in/*

```diff
- Tom always keeps the shop's spare keys {{1}} a small locked box behind the counter. He starts work {{2}} nine o'clock every morning. He writes today's specials {{3}} a small whiteboard by the door. Customers can pay {{4}} a credit card.
+ Tom always keeps the shop's spare keys {{1}} a small locked box behind the counter, and he opens it every morning to take them out. He starts work {{2}} nine o'clock every morning. He writes today's specials {{3}} a small whiteboard by the door. Customers can pay {{4}} a credit card.
```

### `fa5b4452-a5bb-4162-b6fb-bbd971d36a50` — `passages.body`
*Genuine correctness defect, and not a cross-substitution at all. 'Get through to someone' is telic —; Confirmed, and it is one half of a real two-way collision with blank 5 (see next entry). I tried har; Confirmed but PARTIALLY REFUTED as stated — it is a two-way, not a three-way, collision, and I am do*

```diff
- When I arrived at work this morning, I learned that a major client had complained about a late delivery. I immediately decided to {{1}} why the delivery had been delayed, before responding to the client. Not long after, I had to {{2}} the client's lawyer three times before he finally answered his ph …
+ When I arrived at work this morning, I learned that a major client had complained about a late delivery. I immediately decided to {{1}} why the delivery had been delayed, before responding to the client. Not long after, I rang the client's lawyer three times before I could finally {{2}} him and expl …
```

## MAJOR · listening

### `06b4748e-b0c2-4c10-b311-bc1ec02df2f9` — `questions.prompt_text`
*I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent', 'Entirely focused on blaming') and one is the hedged both-sides option ('Balanced, offering both praise and constructive criticism'), which is also the only one containing an explicit conjunction of two opposing elements. A candidate with the audi …*

```diff
- How would you best describe Elena's overall attitude in this meeting?
+ What does Elena's response to James's admission show about her priorities?
```

### `06b4748e-b0c2-4c10-b311-bc1ec02df2f9` — `questions.options`
*I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent', 'Entirely focused on blaming') and one is the hedged both-sides option ('Balanced, offering both praise and constructive criticism'), which is also the only one containing an explicit conjunction of two opposing elements. A candidate with the audi …*

```diff
- ["Angry and dismissive of James's efforts", "Balanced, offering both praise and constructive criticism", "Indifferent to the outcome of the launch", "Entirely focused on blaming the sales team"]
+ ["She values early warning of problems more than a flawless record", "She values keeping the sales team's workload steady above all", "She values creative campaigns more than delivery dates", "She values formal escalation channels over informal conversations"]
```

### `06b4748e-b0c2-4c10-b311-bc1ec02df2f9` — `questions.correct_answer`
*I tried hard to refute this and could not. The tell is structural, not merely tonal: three options are absolutes ('Angry and dismissive', 'Indifferent', 'Entirely focused on blaming') and one is the hedged both-sides option ('Balanced, offering both praise and constructive criticism'), which is also the only one containing an explicit conjunction of two opposing elements. A candidate with the audi …*

```diff
- Balanced, offering both praise and constructive criticism
+ She values early warning of problems more than a flawless record
```

### `6a35310f-9a49-44b6-a00c-d87b25220327` — `questions.prompt_text`
*Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften frustration / preserve the relationship' is default customer-service reasoning available with the audio muted. Second, and decisive, the item has a partially-correct distractor that the explanation itself admits — 'While it might indirectly encourage a …*

```diff
- Why might the speaker have mentioned the fifteen percent discount before asking for a decision?
+ What reason does Karen give for offering the fifteen percent discount?
```

### `6a35310f-9a49-44b6-a00c-d87b25220327` — `questions.options`
*Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften frustration / preserve the relationship' is default customer-service reasoning available with the audio muted. Second, and decisive, the item has a partially-correct distractor that the explanation itself admits — 'While it might indirectly encourage a …*

```diff
- ["To distract the customer from the additional courier charge", "To encourage the customer to accept the slower priority handling option", "To soften the customer's frustration and maintain the business relationship", "To meet a company requirement for complaint resolution"]
+ ["The delay was caused by her own company's error", "Mr Tanaka has complained about a previous shipment", "The express courier option was unavailable", "The shipment cannot be traced in the system"]
```

### `6a35310f-9a49-44b6-a00c-d87b25220327` — `questions.correct_answer`
*Confirmed on two independent grounds, the second of which is the more serious. First, guessability: the stem supplies the discount fact and 'soften frustration / preserve the relationship' is default customer-service reasoning available with the audio muted. Second, and decisive, the item has a partially-correct distractor that the explanation itself admits — 'While it might indirectly encourage a …*

```diff
- To soften the customer's frustration and maintain the business relationship
+ The delay was caused by her own company's error
```

### `782e2afc-c789-4a36-811e-14e205bb2d43` — `questions.prompt_text`
*Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three absolutes ('lazy and avoids responsibility', 'frequent conflicts', 'prefers working in large teams') against one hedged positive-with-caveat key, and a graded-feedback stem makes the two hostile character judgements implausible on genre grounds alone.  …*

```diff
- What can you infer about James's personality from the feedback about teamwork?
+ What does the manager say about the effect of James's approach to teamwork?
```

### `782e2afc-c789-4a36-811e-14e205bb2d43` — `questions.options`
*Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three absolutes ('lazy and avoids responsibility', 'frequent conflicts', 'prefers working in large teams') against one hedged positive-with-caveat key, and a graded-feedback stem makes the two hostile character judgements implausible on genre grounds alone.  …*

```diff
- ["He is lazy and avoids responsibility", "He is hardworking but struggles to trust others with tasks", "He prefers working in large teams", "He has frequent conflicts with colleagues"]
+ ["He absorbs work himself, which holds up the rest of the team", "He distributes work quickly but checks it too closely", "He waits for instructions before starting shared tasks", "He takes on only the tasks that match his strongest skills"]
```

### `782e2afc-c789-4a36-811e-14e205bb2d43` — `questions.correct_answer`
*Confirmed, though it is the weakest of the answerable-without-audio set and I nearly downgraded it. What holds it up: the option set is again three absolutes ('lazy and avoids responsibility', 'frequent conflicts', 'prefers working in large teams') against one hedged positive-with-caveat key, and a graded-feedback stem makes the two hostile character judgements implausible on genre grounds alone.  …*

```diff
- He is hardworking but struggles to trust others with tasks
+ He absorbs work himself, which holds up the rest of the team
```

### `c3fc3de1-8848-4391-a31c-534d5173ca5f` — `questions.prompt_text`
*Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: 'He relies entirely on email and avoids phone calls' is impossible because the passage is a voicemail he left, and 'He is indifferent about whether Patricia accepts the proposal' is incoherent for someone making a follow-up call. That leaves a two-hor …*

```diff
- What can you infer about Michael's communication style?
+ How does Michael handle the timing of Patricia's decision?
```

### `c3fc3de1-8848-4391-a31c-534d5173ca5f` — `questions.options`
*Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: 'He relies entirely on email and avoids phone calls' is impossible because the passage is a voicemail he left, and 'He is indifferent about whether Patricia accepts the proposal' is incoherent for someone making a follow-up call. That leaves a two-hor …*

```diff
- ["He is aggressive and pushes for an immediate decision", "He is patient but creates a sense of urgency with factual deadlines", "He is indifferent about whether Patricia accepts the proposal", "He relies entirely on email and avoids phone calls"]
+ ["He gives her time to review but ties the decision to a fixed pricing deadline", "He gives her time to review and leaves the deadline entirely open", "He asks for a decision before the technical questions are settled", "He defers the pricing question until after the implementation meeting"]
```

### `c3fc3de1-8848-4391-a31c-534d5173ca5f` — `questions.correct_answer`
*Confirmed, and this is the strongest case of the family. Two of the three distractors are self-refuting from the item frame alone, before any audio: 'He relies entirely on email and avoids phone calls' is impossible because the passage is a voicemail he left, and 'He is indifferent about whether Patricia accepts the proposal' is incoherent for someone making a follow-up call. That leaves a two-hor …*

```diff
- He is patient but creates a sense of urgency with factual deadlines
+ He gives her time to review but ties the decision to a fixed pricing deadline
```

### `d9fb72b4-ce81-4420-8b44-873ba20283cb` — `questions.prompt_text`
*Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', and of the four options exactly one makes any claim about timing at all — 'The caterer refused the job', 'The menu is too expensive' and 'The retreat has been cancelled' are not rival timing readings, they are topic changes. So all three distractors a …*

```diff
- You hear: "Honestly, swapping the caterer this close to the retreat is cutting it fine, but they promised the new menu by Friday." What does the phrase cutting it fine suggest about the timing?
+ You hear: "Honestly, swapping the caterer this close to the retreat is cutting it fine, but they promised the new menu by Friday." What does the speaker suggest about the timing of the change?
```

### `d9fb72b4-ce81-4420-8b44-873ba20283cb` — `questions.options`
*Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', and of the four options exactly one makes any claim about timing at all — 'The caterer refused the job', 'The menu is too expensive' and 'The retreat has been cancelled' are not rival timing readings, they are topic changes. So all three distractors a …*

```diff
- ["There is very little time left before the retreat", "The caterer refused the job", "The menu is too expensive", "The retreat has been cancelled"]
+ ["There is barely enough time before the retreat", "There is plenty of time in hand before the retreat", "The retreat has been pushed back to allow more time", "The new menu will not arrive until after the retreat"]
```

### `d9fb72b4-ce81-4420-8b44-873ba20283cb` — `questions.correct_answer`
*Confirmed, and note it is confirmed for a sharper reason than the one given. The stem asks specifically what the phrase suggests 'about the timing', and of the four options exactly one makes any claim about timing at all — 'The caterer refused the job', 'The menu is too expensive' and 'The retreat has been cancelled' are not rival timing readings, they are topic changes. So all three distractors a …*

```diff
- There is very little time left before the retreat
+ There is barely enough time before the retreat
```

### `f56ceff7-4a1d-48e8-a48a-824f3fcfbb63` — `questions.prompt_text`
*Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 and 13, a ratio of 2.08 (the finding said 2.4; close enough, and the effect is the same). It is also the only option carrying a concessive clause and the only one answering both halves of a double-barrelled stem, so three independent tells all point at …*

```diff
- What dilemma does the speaker identify with Option one, and what does it reveal about the competitive landscape?
+ What drawback does the speaker identify with Option one?
```

### `f56ceff7-4a1d-48e8-a48a-824f3fcfbb63` — `questions.options`
*Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 and 13, a ratio of 2.08 (the finding said 2.4; close enough, and the effect is the same). It is also the only option carrying a concessive clause and the only one answering both halves of a double-barrelled stem, so three independent tells all point at …*

```diff
- ["Option one is illegal and the speaker knows the company will be fined", "Option one is technically compliant but will appear evasive compared to competitors who can submit actual data, revealing that the company has underinvested in supply chain traceability", "Option one requires sharing propriet …
+ ["It is legal, but the estimates will look evasive beside rivals' measured data", "It is illegal and will attract a regulatory fine", "It requires sharing proprietary supply chain data with competitors", "It satisfies regulators but breaches the sustainability-linked bond covenants"]
```

### `f56ceff7-4a1d-48e8-a48a-824f3fcfbb63` — `questions.correct_answer`
*Confirmed, and the sibling claim is confirmed too — I measured it rather than taking it on trust. The key is 27 words against distractors of 10, 11 and 13, a ratio of 2.08 (the finding said 2.4; close enough, and the effect is the same). It is also the only option carrying a concessive clause and the only one answering both halves of a double-barrelled stem, so three independent tells all point at …*

```diff
- Option one is technically compliant but will appear evasive compared to competitors who can submit actual data, revealing that the company has underinvested in supply chain traceability
+ It is legal, but the estimates will look evasive beside rivals' measured data
```

### `ffabeaed-80c6-4a26-b888-1ad0b4926059` — `questions.prompt_text`
*Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market comparables strengthens a negotiating position' is then generic negotiation logic requiring nothing from the audio. The distractors do not compete: 'threaten to leave' and 'demonstrate their expertise in commercial real estate' are motives no cooperati …*

```diff
- Why might the speaker have mentioned comparable market rates?
+ What figure does the speaker use to justify asking for a lower rate?
```

### `ffabeaed-80c6-4a26-b888-1ad0b4926059` — `questions.options`
*Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market comparables strengthens a negotiating position' is then generic negotiation logic requiring nothing from the audio. The distractors do not compete: 'threaten to leave' and 'demonstrate their expertise in commercial real estate' are motives no cooperati …*

```diff
- ["To show that they have already found a better alternative", "To strengthen their position by providing objective evidence for a lower rate", "To threaten to leave if the rate is not reduced", "To demonstrate their expertise in commercial real estate"]
+ ["Comparable spaces in the district are about ten percent cheaper per square metre", "Comparable spaces in the district are about ten percent dearer per square metre", "Their current rent is about ten percent below the asking rate", "Fit-out costs add about ten percent to the total"]
```

### `ffabeaed-80c6-4a26-b888-1ad0b4926059` — `questions.correct_answer`
*Confirmed. The stem 'Why might the speaker have mentioned comparable market rates?' hands the candidate both the fact and the frame; 'citing market comparables strengthens a negotiating position' is then generic negotiation logic requiring nothing from the audio. The distractors do not compete: 'threaten to leave' and 'demonstrate their expertise in commercial real estate' are motives no cooperati …*

```diff
- To strengthen their position by providing objective evidence for a lower rate
+ Comparable spaces in the district are about ten percent cheaper per square metre
```

## MODERATE · speaking

### `995eb9e8-8ca5-4d74-ad3f-fc38c554fb87` — `questions.prompt_text`
*Survives the elaboration objection. The decisive evidence is not 'it only needs one sentence' but that it is the sole single-move item in its own pool: the other five A2 role_plays (41cd8fdf, 6ea7dae0, bff56be5, 15faffa3, 29ad727e) are all two-move transactional tasks with a request and a reason. This one asks only for a locative statement — there is no request, no constraint, no interlocutor move …*

```diff
- A colleague left their umbrella in the meeting room. Tell them where it is.
+ Your colleague cannot find their umbrella and it is raining outside. You saw it in the meeting room this morning, but that room is closed until 3 p.m. Tell your colleague where the umbrella is, explain why they cannot get it now, and suggest what they can do.
```

## MINOR · grammar_vocab / gap_fill

### `58096f76-316e-4410-8f6b-0fb0cd2dcb32` — `questions.options`
*'Conduct business with your company' is genuinely correct and formal, and accepting it does not weaken the item's actual point (that it is 'do', not 'make'/'have' business). Downgraded because 'conduct' is C1 vocabulary on an A1 item, so essentially no learner in the target population will type it.*

```diff
- ["do"]
+ ["do", "conduct"]
```

### `68780eee-a104-4c3c-ab35-99aa34cda2c0` — `questions.options`
*'Type your secret code' is correct English and 'passcode' is defensible, so a rejection here is a genuine false negative — but both partly defeat an A1 vocabulary item whose whole target is 'password', and 'password' is strongly cued by 'log into the computer system'.*

```diff
- ["password"]
+ ["password", "passcode", "code"]
```

### `c34603ca-22d2-4556-b3f3-a31db0373996` — `questions.options`
*Bare 'go for pizza' is correct English but flatly defeats a phrasal_verbs item that already accepts two phrasal answers, so it is refused. 'Head off for pizza' is idiomatic BrE and is itself a phrasal verb, so it survives without cost to the teaching point.*

```diff
- ["go out", "head out"]
+ ["go out", "head out", "head off"]
```

## MINOR · grammar_vocab / reconstruction

### `df2e5a7e-40ac-4600-b157-4bb789f22741` — `questions.explanation`
*This one is real. The current explanation ends with 'Using the pronoun "He" (rather than a noun like "the manager") blocks "from lunch" from being misread as a modifier of the subject, since pronouns can't take that kind of postmodifying phrase.' That is item-design rationale addressed to a content author, not a learner: it cites a noun phrase ('the manager') that does not appear in the exercise,  …*

```diff
- The phrasal verb 'come back' (return) stays together as one unit. Subject comes first, then the verb phrase, then the place ('from lunch'), with the time word 'soon' at the very end. Using the pronoun 'He' (rather than a noun like 'the manager') blocks 'from lunch' from being misread as a modifier o …
+ "Come back" is a phrasal verb (it means "return"), so the two words stay together after "will": will come back. Next we say where — "from lunch" — and the time word "soon" goes at the end: He will come back from lunch soon.
```

## MINOR · reading

### `21c41720-3151-4edc-915b-cf94c2227ca4` — `passages.body`
*British-English standard*

```diff
- Over the past two quarters, voluntary turnover in the Logistics division has risen from 8% to 19%, a trend that stands in sharp contrast to the relatively stable 6% turnover recorded across the rest of the company during the same period. Exit interviews initially pointed to pay as the primary driver …
+ Over the past two quarters, voluntary turnover in the Logistics division has risen from 8% to 19%, a trend that stands in sharp contrast to the relatively stable 6% turnover recorded across the rest of the company during the same period. Exit interviews initially pointed to pay as the primary driver …
```

### `3f32faa1-72e0-419f-8ff0-b90d3857cad4` — `questions.explanation`
*British-English standard: Americanism in learner-facing text*

```diff
- The passage says every other answer "included at least one concrete anecdote; that one hadn't" -- the single unfilled gap, not open criticism, refusal to answer, or any CV contradiction, none of which occurred.
+ The passage says every other answer "included at least one concrete anecdote; that one hadn't": the single unfilled gap, not open criticism, refusal to answer, or any CV contradiction, none of which occurred.
```

### `43d076ab-7707-46f0-a1af-70f16b17a32d` — `passages.body`
*British-English standard*

```diff
- When Priya called the listed reference for a candidate under consideration for the operations manager role, the conversation was, technically, entirely positive: competent, reliable, good with detail, nothing negative said outright. And yet she came away from the call less confident than before she' …
+ When Priya called the listed reference for a candidate under consideration for the operations manager role, the conversation was, technically, entirely positive: competent, reliable, good with detail, nothing negative said outright. And yet she came away from the call less confident than before she' …
```

### `72cae707-5515-4ea9-8fe5-e5c0632f56d5` — `passages.body`
*British-English standard*

```diff
- This year, the company is moving from a single annual performance review to a continuous feedback model, in which employees and managers hold shorter, more frequent check-ins every quarter. The change follows staff survey findings suggesting that annual reviews often felt disconnected from day-to-da …
+ This year, the company is moving from a single annual performance review to a continuous feedback model, in which employees and managers hold shorter, more frequent check-ins every quarter. The change follows staff survey findings suggesting that annual reviews often felt disconnected from day-to-da …
```

### `7765a062-4a54-445b-9790-45f98abad3fa` — `questions.prompt_text`
*British-English standard: Americanism in learner-facing text*

```diff
- Why was Dr. Chen specifically invited to speak?
+ Why was Dr Chen specifically invited to speak?
```

### `c2b93204-9377-4ca1-8c3a-9cc9dee7c202` — `passages.body`
*British-English standard*

```diff
- Dear Ms. Alvarez, ⏎ Following our call last week, I am writing to confirm the revised terms for renewing our supply contract. We can offer a 5% discount on bulk orders over 500 units, provided that payment is made within 30 days rather than the current 60-day term. Alternatively, if you prefer to ke …
+ Dear Ms Alvarez, ⏎ Following our call last week, I am writing to confirm the revised terms for renewing our supply contract. We can offer a 5% discount on bulk orders over 500 units, provided that payment is made within 30 days rather than the current 60-day term. Alternatively, if you prefer to kee …
```

### `cd88fbd7-5099-43ce-96fd-22bf281dbb56` — `passages.body`
*British-English standard*

```diff
- Subject: Registration Confirmed – Annual Sales Conference ⏎ Dear Ms. Fabre, ⏎ Thank you for registering for the Annual Sales Conference, taking place on 14–15 September at the Riverside Convention Centre. Your registration includes access to all keynote sessions, two workshops of your choice, and lu …
+ Subject: Registration Confirmed – Annual Sales Conference ⏎ Dear Ms Fabre, ⏎ Thank you for registering for the Annual Sales Conference, taking place on 14–15 September at the Riverside Convention Centre. Your registration includes access to all keynote sessions, two workshops of your choice, and lun …
```

### `e50cf574-95fb-408e-ac18-6ffc60aa258d` — `passages.body`
*British-English standard*

```diff
- Subject: Invitation to Speak at Our Annual Industry Summit. Dear Dr. Chen, On behalf of the organising committee, I would like to invite you to speak at this year's Industry Summit, taking place on 14 November in Manchester. Given your recent published research on supply chain resilience, we believe …
+ Subject: Invitation to Speak at Our Annual Industry Summit. Dear Dr Chen, On behalf of the organising committee, I would like to invite you to speak at this year's Industry Summit, taking place on 14 November in Manchester. Given your recent published research on supply chain resilience, we believe  …
```

### `f6dab89f-82ed-451d-b069-159c2f748494` — `questions.correct_answer`
*British-English standard: Americanism in learner-facing text*

```diff
- Because spending is still reviewed afterward, and the limit can be lowered again if problems arise
+ Because spending is still reviewed afterwards, and the limit can be lowered again if problems arise
```

### `f6dab89f-82ed-451d-b069-159c2f748494` — `questions.explanation`
*British-English standard: Americanism in learner-facing text*

```diff
- The passage says "Finance will still review all expenses retrospectively each quarter" and that "repeated errors or unclear justifications could see the limit lowered again" -- accountability is retained through review, just applied afterward instead of blocking approval upfront.
+ The passage says "Finance will still review all expenses retrospectively each quarter" and that "repeated errors or unclear justifications could see the limit lowered again": accountability is retained through review, just applied afterwards instead of blocking approval upfront.
```

### `f6dab89f-82ed-451d-b069-159c2f748494` — `questions.options`
*British-English standard*

```diff
- ["Because spending is still reviewed afterward, and the limit can be lowered again if problems arise", "Because department heads no longer need to justify any expenses", "Because finance has stopped monitoring spending altogether", "Because the €2,000 limit applies only to software purchases"]
+ ["Because spending is still reviewed afterwards, and the limit can be lowered again if problems arise", "Because department heads no longer need to justify any expenses", "Because finance has stopped monitoring spending altogether", "Because the €2,000 limit applies only to software purchases"]
```

### `f780f5be-788d-4fec-b0a3-92480b088764` — `questions.correct_answer`
*British-English standard: Americanism in learner-facing text*

```diff
- A qualified acceptance -- acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule
+ A qualified acceptance: acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule
```

### `f780f5be-788d-4fec-b0a3-92480b088764` — `questions.explanation`
*British-English standard: Americanism in learner-facing text*

```diff
- The finance lead "noted that this segmented approach would be more complex to maintain long-term, but agreed the trial data didn't support a one-size-fits-all conclusion" -- a concern paired with agreement, not rejection, blanket enthusiasm, or a request to re-run the trial.
+ The finance lead "noted that this segmented approach would be more complex to maintain long-term, but agreed the trial data didn't support a one-size-fits-all conclusion": a concern paired with agreement, not rejection, blanket enthusiasm, or a request to re-run the trial.
```

### `f780f5be-788d-4fec-b0a3-92480b088764` — `questions.options`
*British-English standard*

```diff
- ["A qualified acceptance -- acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule", "Outright rejection of the segmented approach in favour of a universal rollout", "Enthusiastic support for the new model over the old one in general", "A d …
+ ["A qualified acceptance: acknowledging added complexity while agreeing the data justifies a segmented approach over a single universal rule", "Outright rejection of the segmented approach in favour of a universal rollout", "Enthusiastic support for the new model over the old one in general", "A dem …
```

## MINOR · speaking

### `07846b3f-c8f1-41be-8248-e159a0bc8736` — `questions.prompt_text`
*The duplication itself is real and is not merely 'same topic' — it is the same syntactic frame with an antonym swapped ('What time do you start/finish work every day/each day'), same tense, same register, same expected answer type (a single clock time). That meets the functional near-identity bar. But the stated harm is false: pickPromptForPhase returns pool.find(exact cefr_level), so an A1 learne …*

```diff
- What time do you finish work each day?
+ What do you do at the end of your working day? Tell me two or three things you do before you go home.
```

## MINOR · writing

### `0008c924-b30a-4902-bfdb-62ba7b53c606` — `questions.prompt_text`
*The 'impossible genre' claim fails: a reasonable A1 learner knows exactly what to produce, and the corpus itself establishes the written-note-at-a-desk genre four times over at A1/A2 (8f9f37cc out-of-office note, ef2355cb missed-call note, e370efc0 note to security about a visitor, ec80ee7d front-desk handover). 'Ask them to wait / offer a drink' are perfectly writable in a note ('Please take a se …*

```diff
- Greet a visitor at reception ⏎  ⏎ You work at the front desk of a company. A visitor has arrived for a meeting with your manager. Write a short welcome message to the visitor. Ask them to wait and offer a drink. (30–50 words)
+ Greet a visitor at reception ⏎  ⏎ You work at the front desk of a company. A visitor has arrived for a meeting with your manager, who is not ready yet. Write a short note to give to the visitor. Welcome them, ask them to wait, and offer them a drink. (30–50 words)
```

### `0204c67e-dc1f-4b37-9167-3501f3037bba` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Asking for a Day Off ⏎  ⏎ You want next Friday off for a family event. Write a short email to your manager, Mr. Diallo. Say which day you need off and why. (30–50 words)
+ Asking for a Day Off ⏎  ⏎ You want next Friday off for a family event. Write a short email to your manager, Mr Diallo. Say which day you need off and why. (30–50 words)
```

### `099ea2c3-4cd3-410f-a109-6079007f78fb` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Write a short meeting agenda ⏎  ⏎ You are organizing a 30-minute team meeting for Friday morning. Write a short email to your team with the agenda. Include at least three items to discuss and the time and place of the meeting. (50–80 words)
+ Write a short meeting agenda ⏎  ⏎ You are organising a 30-minute team meeting for Friday morning. Write a short email to your team with the agenda. Include at least three items to discuss and the time and place of the meeting. (50–80 words)
```

### `0ac567f4-d63e-45a1-9b86-09e0785c8581` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Office Move Announcement ⏎  ⏎ Your office is moving to a new building on 5th Street starting next month. Write a short email to staff. Give the new address, the start date, and tell them where to park. (50–80 words)
+ Office Move Announcement ⏎  ⏎ Your office is moving to a new building on Bishop Street starting next month. Write a short email to staff. Give the new address, the start date, and tell them where to park. (50–80 words)
```

### `0f7992ee-38aa-4b9f-995c-48284d65ebc9` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Handling a Subscription Cancellation Request ⏎  ⏎ A customer, Mr. Hendricks, emails asking to cancel his premium subscription because he feels it is too expensive. Reply confirming you can process the cancellation, explain what happens to his data and access, and mention a lower-cost plan he might c …
+ Handling a Subscription Cancellation Request ⏎  ⏎ A customer, Mr Hendricks, emails asking to cancel his premium subscription because he feels it is too expensive. Reply confirming you can process the cancellation, explain what happens to his data and access, and mention a lower-cost plan he might co …
```

### `28c3d828-2798-4bcb-b5e9-16e6be52915d` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Declining a Meeting Invitation Politely ⏎  ⏎ A senior colleague, Ms. Okafor, has invited you to a strategy meeting that clashes with an existing client commitment you cannot move. Write a message declining the invitation, explaining the conflict without sounding dismissive, and proposing a way to st …
+ Declining a Meeting Invitation Politely ⏎  ⏎ A senior colleague, Ms Okafor, has invited you to a strategy meeting that clashes with an existing client commitment you cannot move. Write a message declining the invitation, explaining the conflict without sounding dismissive, and proposing a way to sta …
```

### `3688e792-03dc-45f0-9497-e3c253f8dcae` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Process a product exchange ⏎  ⏎ A customer, Mr. Chen, bought a medium-sized company polo shirt but needs a large size instead. Write a short email to confirm the exchange and explain what he should do to return the medium shirt. (50–80 words)
+ Process a product exchange ⏎  ⏎ A customer, Mr Chen, bought a medium-sized company polo shirt but needs a large size instead. Write a short email to confirm the exchange and explain what he should do to return the medium shirt. (50–80 words)
```

### `36be6c3c-1fcd-4a05-bf17-b212ca00dcf3` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Follow up after a phone call ⏎  ⏎ You just had a phone call with a client, Ms. Rivera. She asked about the price of your company's training package. Write a short email to follow up. Include the price ($500 per person) and offer to answer more questions. (50–80 words)
+ Follow up after a phone call ⏎  ⏎ You just had a phone call with a client, Ms Rivera. She asked about the price of your company's training package. Write a short email to follow up. Include the price (€500 per person) and offer to answer more questions. (50–80 words)
```

### `43087bc8-7a84-478c-9904-2cc52f3357b2` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Explain a delay to a client ⏎  ⏎ Your company's delivery to client Mrs. Novak will be three days late because of a supplier problem. Write an email explaining the delay, apologising, and giving the new delivery date. (80–120 words)
+ Explain a delay to a client ⏎  ⏎ Your company's delivery to client Mrs Novak will be three days late because of a supplier problem. Write an email explaining the delay, apologising, and giving the new delivery date. (80–120 words)
```

### `52832864-1d2a-40d7-afd7-4799793c9cae` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Asking for the Wifi Password ⏎  ⏎ You are working from a different office today and you do not have the wifi password. Write a short message to a colleague asking for it. (30–50 words)
+ Asking for the Wi-Fi Password ⏎  ⏎ You are working from a different office today and you do not have the Wi-Fi password. Write a short message to a colleague asking for it. (30–50 words)
```

### `6903e1b5-6d83-4d16-aa70-7a18318973ba` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Write a post-meeting action plan ⏎  ⏎ You chaired a cross-functional meeting about improving employee retention. Several ideas were discussed, including flexible work options, mentoring programs, and salary benchmarking. Write a follow-up email to all participants summarizing the decisions made, ass …
+ Write a post-meeting action plan ⏎  ⏎ You chaired a cross-functional meeting about improving employee retention. Several ideas were discussed, including flexible work options, mentoring programmes, and salary benchmarking. Write a follow-up email to all participants summarising the decisions made, a …
```

### `6d1412f4-408a-4e5c-9d90-ab5072b8da87` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Project Status Update ⏎  ⏎ Write an email to your project sponsor updating them on the CRM migration project. Explain that data migration is 70% complete, testing has revealed two minor bugs being fixed this week, and the go-live date remains on track for August 15th. (120–160 words)
+ Project Status Update ⏎  ⏎ Write an email to your project sponsor updating them on the CRM migration project. Explain that data migration is 70% complete, testing has revealed two minor bugs being fixed this week, and the go-live date remains on track for 15 August. (120–160 words)
```

### `79ce8120-ff14-42d1-9b82-2abeb9552d8c` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Draft a multi-stakeholder negotiation position paper ⏎  ⏎ Your company is negotiating a five-year public-private partnership with a city government to develop a smart transportation system. Multiple stakeholders have competing interests: the city wants to minimize costs and maximize public benefit,  …
+ Draft a multi-stakeholder negotiation position paper ⏎  ⏎ Your company is negotiating a five-year public-private partnership with a city government to develop a smart transportation system. Multiple stakeholders have competing interests: the city wants to minimise costs and maximise public benefit,  …
```

### `7b4580c5-211f-44cf-9a3e-6d0929c295f2` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Propose a payment plan ⏎  ⏎ Your company provides IT services to a small business client, GreenLeaf Ltd. They are having cash flow problems and cannot pay their $12,000 invoice in full. Write an email proposing a three-month payment plan. Explain how the plan would work and why it benefits both side …
+ Propose a payment plan ⏎  ⏎ Your company provides IT services to a small business client, GreenLeaf Ltd. They are having cash flow problems and cannot pay their €12,000 invoice in full. Write an email proposing a three-month payment plan. Explain how the plan would work and why it benefits both side …
```

### `8070a143-cd6d-48ea-8412-72b4a7f0f407` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Summarise a team decision ⏎  ⏎ Your team decided in yesterday's meeting to move the project deadline from June 1 to June 15 because of extra testing needed. Write a short message to the team explaining the decision and the reason. (80–120 words)
+ Summarise a team decision ⏎  ⏎ Your team decided in yesterday's meeting to move the project deadline from 1 June to 15 June because of extra testing needed. Write a short message to the team explaining the decision and the reason. (80–120 words)
```

### `951c9e73-e53c-456e-8d21-5140c572de78` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Request a lower price ⏎  ⏎ You are buying 200 office chairs from a furniture company. The price is $85 per chair. Write a short email to the sales representative to ask for a discount because you are ordering a large quantity. (50–80 words)
+ Request a lower price ⏎  ⏎ You are buying 200 office chairs from a furniture company. The price is €85 per chair. Write a short email to the sales representative to ask for a discount because you are ordering a large quantity. (50–80 words)
```

### `b4b42960-c7ea-4a2b-9452-bd21360e2d10` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Apologize for a billing error ⏎  ⏎ A long-time customer, Ms. Thompson, was charged twice for the same invoice. She sent an email to complain. Write a professional response apologizing for the mistake, explaining what happened, and describing the steps your company will take to correct the error and  …
+ Apologise for a billing error ⏎  ⏎ A long-time customer, Ms Thompson, was charged twice for the same invoice. She sent an email to complain. Write a professional response apologising for the mistake, explaining what happened, and describing the steps your company will take to correct the error and p …
```

### `c4f5e40f-e192-4e11-893c-279ff3e78c35` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Confirm a meeting time ⏎  ⏎ Your manager, Mr. Diallo, asked you to meet on Thursday. Write a short email to confirm the day and time (10:00) and say where (his office). (30–50 words)
+ Confirm a meeting time ⏎  ⏎ Your manager, Mr Diallo, asked you to meet on Thursday. Write a short email to confirm the day and time (10:00) and say where (his office). (30–50 words)
```

### `cb323b04-6a23-4835-b510-f7ac60f15178` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Following Up After a Networking Event ⏎  ⏎ You met Dr. Elena Vasquez, a potential industry partner, at a conference last week and had a promising conversation about a possible collaboration. Write a follow-up message that reestablishes rapport, subtly reminds her of the specifics you discussed, and  …
+ Following Up After a Networking Event ⏎  ⏎ You met Dr Elena Vasquez, a potential industry partner, at a conference last week and had a promising conversation about a possible collaboration. Write a follow-up message that re-establishes rapport, subtly reminds her of the specifics you discussed, and  …
```

### `cf64768f-540c-40e9-aba2-d710c1c8c4ae` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Reply to a customer complaint ⏎  ⏎ A customer, Mr. Hendricks, wrote to complain that his order arrived damaged. Write a reply that acknowledges the problem, apologises, explains what you will do (replace the item within 5 days), and offers a small discount on his next order. (120–160 words)
+ Reply to a customer complaint ⏎  ⏎ A customer, Mr Hendricks, wrote to complain that his order arrived damaged. Write a reply that acknowledges the problem, apologises, explains what you will do (replace the item within 5 days), and offers a small discount on his next order. (120–160 words)
```

### `d70356d8-bbca-485f-b812-62dc44160866` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Accept a delivery date ⏎  ⏎ A supplier has offered to deliver your order on March 15. You are happy with this date. Write a short reply to accept the delivery date and say thank you. (30–50 words)
+ Accept a delivery date ⏎  ⏎ A supplier has offered to deliver your order on 15 March. You are happy with this date. Write a short reply to accept the delivery date and say thank you. (30–50 words)
```

### `ea2c093d-727e-4c4d-9c36-814e8a43e02a` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Summarize a conference call ⏎  ⏎ You participated in a conference call with a client about a new marketing project. Write an email to your manager summarizing the key points discussed, including the project timeline (launch in June), the budget ($15,000), and the next steps (send a proposal by Frida …
+ Summarise a conference call ⏎  ⏎ You participated in a conference call with a client about a new marketing project. Write an email to your manager summarising the key points discussed, including the project timeline (launch in June), the budget (€15,000), and the next steps (send a proposal by Frida …
```

### `ef2355cb-b463-42cb-8a26-5b604dad317d` — `questions.prompt_text`
*British-English standard / internal spelling consistency*

```diff
- Write a note about a missed call ⏎  ⏎ A customer called while your colleague was away from their desk. Write a short note for your colleague with the caller's name (Mr. Park), phone number (555-0192), and reason for the call (delivery question). (30–50 words)
+ Write a note about a missed call ⏎  ⏎ A customer called while your colleague was away from their desk. Write a short note for your colleague with the caller's name (Mr Park), phone number (020 7946 0192), and reason for the call (delivery question). (30–50 words)
```
