# CLOE pedagogy audit — SESSION HANDOFF (2026-08-16)

**Status: Phase 2 (review) ~90% done. Phases 3–6 NOT started.**
Resume with `/pedagogy-audit` context but DO NOT re-run the reviewers that already completed.

---

## 0. Critical operational facts

- Repo: `/Users/antonyaddy/Desktop/cloe-prep-path`, branch `main`, clean, synced with origin.
- **Content lives in Supabase, not files.** Project `slclrioocekwnakgbakp`, CLI is linked.
  Query with: `supabase db query --linked "SELECT ..."` (returns JSON after a `{` prefix line).
- **The DB auto-pauses on the free tier.** It was paused at session start (NXDOMAIN on the
  hostname, site totally broken for real users). User restored it manually from the Supabase
  dashboard. **If queries time out again, ask the user to restore the project before proceeding.**
- Repo has NO typecheck/test scripts and NO CI workflows. Verification gate is only:
  `bun run lint` (eslint) + `bun run build` (vite). Run both before committing.
- Auto-commit-push IS enabled for this repo (see memory `auto-commit-push-cloe-prep-path`).
- ⚠️ An unidentified concurrent/automated process has historically committed to this repo.
  **Always `git fetch` + check `git log` before assuming your working state holds.**

## 1. Content inventory (verified live, 2026-08-16)

1,266 questions + 156 passages.

| skill | type | n |
|---|---|---|
| listening | mcq | 330 |
| reading | mcq | 252 |
| grammar_vocab | mcq | 288 |
| grammar_vocab | gap_fill | 72 |
| grammar_vocab | reconstruction | 36 |
| grammar_vocab | word_bank | 108 |
| writing | prompt | 72 |
| speaking | prompt | 108 |

CEFR spread is very even (205–217 per level across A1–C2). Content is **English-only** —
no French anywhere, and that is intentional (user-confirmed previously).
Passages: listening 54, reading 84, grammar_vocab 18.

## 2. Engine facts that drive the audit rubrics

From `src/lib/utils.ts` (`gradeAnswer`, `gradeGapFill`, `normalizeAnswer`):

- **gap_fill HAS an accept-list**: the `options` column is repurposed as accepted answers.
  Normalisation = trim, lowercase, collapse whitespace, curly→straight quotes, strip trailing
  `.!?;:,`. It does NOT expand contractions and does NOT handle plurals.
- **mcq / reconstruction / word_bank are EXACT MATCH with no alternates.**
  So "a second defensible answer" is UNFIXABLE IN DATA for these three — the item must be
  rewritten, not re-keyed.

## 3. Mechanical data-integrity sweep — ALL CLEAN ✅

Verified programmatically across all 1,266 items:
- mcq: 0 key-not-in-options, 0 duplicate options (all three skills)
- gap_fill: 0 canonical-missing-from-accept-list, 0 missing `_____` marker
- reconstruction: `" ".join(options) == correct_answer` for all 36

Report this as a genuine positive finding.

## 4. Reviewer agents — WHAT IS DONE

Full verbatim agent output is on disk at:
`/private/tmp/claude-501/-Users-antonyaddy-Desktop-anglaisadistance-repo/5cc090e6-02a6-490e-989a-383572bbe0b6/tasks/<agentId>.output`

These are JSONL transcripts. **Extract the final assistant message** (do not read whole file
into context — it will overflow). Suggested: `python3` + read last lines, or grep for the
final JSON array.

| scope | agentId | status | rough findings |
|---|---|---|---|
| reconstruction (36) | a4cfa6817494f69cd | ✅ done | 13 (1 critical) |
| word_bank A1–B1 | adaf44c4c84883133 | ✅ done | 14 (2 critical) |
| word_bank B2–C2 | a98ebc35c67a1af3c | ✅ done | 21 (4 critical) |
| gap_fill (72) | a1643f4a1e3d77506 | ✅ done | 35 (mostly missing-accepted-answer) |
| grammar_vocab mcq A1–B1 | ab3297858359e1a55 | ✅ done | 32 (1 critical) |
| grammar_vocab mcq B2–C2 | ad8240fddbded5787 | ✅ done | 31 (4 critical) |
| listening A1–A2 | a8c33dd49eb239c58 | ✅ done | ~27 (0 critical, 1 major) |
| listening B1–B2 | aafac522129a0a041 | ✅ done | ~28 |
| listening C1–C2 | a9c122a5a4ec2df22 | ✅ done | ~26 |
| reading A1–B1 | a482afa6cdf46ad84 | ✅ done | ~60 (1 critical, 5 major) |
| **reading B2–C2** | a76a5a8967580a677 | ❌ **FAILED** (session limit) | **RE-RUN** |
| **writing+speaking prompts** | a0a29230ae62e799e | ❌ **FAILED** (session limit) | **RE-RUN** |

### Already distilled to clean JSON on disk (use these directly, no extraction needed):
`/private/tmp/.../scratchpad/cloe-audit/`
- `findings_reconstruction.json`
- `findings_wordbank_a1b1.json`
- `findings_gapfill.json`
- `findings_gvmcq_a1b1.json`

⚠️ The other 6 completed agents' findings are ONLY in their `.output` transcripts — extract them.

### Content exports for reviewer agents (regenerate if scratchpad was wiped):
`/private/tmp/.../scratchpad/cloe-audit/{listening,reading,grammar_vocab}_*.json`, `passages.json`
Regenerate via the per-skill/type `supabase db query --linked` + `json.dump` loop.

## 5. TWO REVIEWERS STILL TO RUN

1. **reading MCQ B2–C2** (~126 items). Same brief as the A1–B1 one, plus: classify the
   cognitive skill each item tests and report the distribution per level.
2. **writing (72) + speaking (108) prompts** (180 items). Check: the writing word-count
   format `(NN–NN words)` is parsed by a strict regex — a paraphrased range breaks a real
   app feature (flag CRITICAL); task clarity; CEFR fit; speaking phase-vs-context_tag match;
   duplicates; BrE/AmE.

## 6. HEADLINE FINDINGS SO FAR (for the report)

**Criticals / majors worth leading with:**
- **`gap_fill` accept-lists are systematically under-inclusive** — ~30 of 72 items reject a
  genuinely correct answer (e.g. "got", "kindly", "conduct", "nonetheless", "trial",
  "finalize", "brush up"). Matches the 57% hit-rate found in a prior round. Highest-volume
  learner-harm defect in the whole bank. Fixable in data (just extend `options`).
- **word_bank cross-substitution is real and widespread**, worst at B1 phrasal verbs and
  C1 bare auxiliaries — including a **three-way collision** in "A Busy Monday at the Office"
  (`go through` / `look into` / `sort out` all fit blank 5) and a BrE collective-noun
  agreement case at C1 (`the leadership team have` is correct BrE but marked wrong).
- **BrE/AmE drift is the biggest systemic quality issue.** Site standard is British but the
  bank contains: `elevator`, `parking lot`, `highway`, `downtown`, `color`, `vacation`,
  `traveling`, `skeptical`, `toward`, `favorable`, `harbor`, `gotten around to`, `Mr.`/`Ms.`/
  `Mrs.` with full stops, US month-first dates, US 555-/514- phone numbers, and dollars in
  some A2 passages vs euros in others. Several are in KEYED ANSWERS, so a BrE-correct learner
  is marked wrong (`in Main Street`, `take a decision`, `sort out`).
- **Reading is cognitively flat.** 42 of 42 B1 reading items test literal detail retrieval —
  zero inference/gist/purpose/tone. A1 and A2 are the same, so B1 offers no step up over A1;
  only vocabulary escalates. (Prior audit flagged this; it is confirmed and total.)
  The B2–C2 half is unaudited — rerun that agent to see if it extends upward.
- **Several explanations teach factually WRONG rules** — e.g. "'already' requires the present
  perfect" (false), "'take a decision' is wrong" (standard BrE), "'find a balance' is not
  correct" (it is), "'win a deal' is not idiomatic" (it is), "'put effort' requires 'in'"
  (it's 'into'). These actively mis-teach.
- **Listening: 162 of 330 questions and 102 of 156 passages have NO generated audio** — they
  silently fall back to robotic browser TTS. This is an ops gap, not a code bug: the
  admin `/admin/generate` audio job was never re-run after later content rounds.
  **Only the user can fix this** (needs `OPENAI_API_KEY`, lives in Vercel):
  log into production → `/admin/generate` → click "Generate audio (next 30)" ~6×
  and "Generate passage audio (next 30)" ~4×.
- Four A1/A2 listening passages are **unattributed two-party dialogues** — one TTS voice reads
  both sides continuously, so beginners can't tell who is speaking.
- Many **absurd distractors** (rhyme-fillers like `sediment/condiment/ligament` for `dividend`;
  `orchestra/volcano/harbour` in a workplace item) make items trivially easy. High volume,
  low severity, but it's a visible quality signal.

**Genuine positives to state plainly:** zero data-integrity defects across 1,266 items; zero
wrong answer keys found in reading A1–B1; listening quote-format (a bug class that shipped
twice before) is 100% clean across all 56 A1–A2 and all 56 C1–C2 standalone items.

## 7. REMAINING PHASES

- **Phase 3 — adversarial verification.** REQUIRED before any fix. Every critical/major gets
  an independent verifier prompted to REFUTE it. Also verify each proposed FIX doesn't
  reintroduce the defect (prior rounds had fixes that made things worse). Note: I already
  suspect the reconstruction "critical" (`df2e5a7e`, "He will come back soon from lunch")
  is over-flagged — that ordering is marginal/unnatural, so verify it hard.
- **Phase 4 — HTML report** → `audit-reports/pedagogy-audit-2026-08-16.html`, send via
  SendUserFile. Grade + scorecard + severity-ranked findings table + coverage map + method note.
- **Phase 5 — repair.** Write `audit-reports/repair-manifest-2026-08-16.md` FIRST (resumability),
  then apply. **Fixes are SQL UPDATEs against Supabase (or a new migration file), not file edits.**
  Prefer a migration in `supabase/migrations/` so it's replayable, then `supabase db push --linked`.
  CEFR mismatches are FLAG-ONLY. Suggestions are not auto-applied.
- **Phase 6 — commit + push** (auto-push allowed here), report included in the commit.

## 8. Judgment calls to put to the user (do not guess)

1. The `insisted that … submitted` item (`0215289d`): BrE allows the indicative, but the item
   exists to teach the mandative subjunctive. Accept both, or keep + explain?
2. Distractor-quality rewrites are ~40 items of churn on non-broken content. Worth doing now,
   or defer as a separate content round?
3. Fixing the flat reading progression means authoring genuinely new inference questions for
   ~40 B1 items — that's a content round, not a repair. Confirm scope before starting.
