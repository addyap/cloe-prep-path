# Measuring whether the content actually works

The `attempts` table already logs everything needed: who answered, which
question, right or wrong, when. Nothing new has to be built. What is missing is
**volume** — as of 17 August 2026 there were 79 attempts from 12 users, which is
not enough to say anything about a single item.

These three queries turn attempt data into item quality evidence. Run them as
data accumulates.

| file | answers the question |
|---|---|
| `item-stats.sql` | Which individual questions are broken, too easy, or useless? |
| `level-check.sql` | Are the CEFR labels real, or decorative? |
| `distractor-usage.sql` | Which wrong answers does anybody actually pick? |

Run with:

    supabase db query --linked -f analysis/item-stats.sql

## How much data unlocks what

| attempts per item | what becomes trustworthy |
|---|---|
| under 30 | nothing — do not act on it |
| 30+ | facility (how hard the item is) |
| 100+ | discrimination (whether it separates strong from weak learners) |
| 200+ | distractor-level detail |

With ~1,300 items, getting 100 answers on every item means roughly 130,000
answers. That is a long way off. **So do not try to cover the bank evenly.**
Let the data land where learners actually go, and read the items that
accumulate answers first. The mock exam is the natural place to start, because
everyone taking it sees the same items.

## What to act on first

**Negative discrimination is the alarm that matters.** It means learners who
score well overall get *this* item wrong more often than learners who score
badly. There is almost never an innocent explanation: the key is wrong, or a
distractor is also correct. This is the one finding worth acting on the moment
it appears, even on thin data — it catches empirically the exact defect class
this audit had to hunt by hand.

Second: any item sitting at or below 0.25 facility on a 4-option question.
Learners are doing worse than guessing, which again points at the key.

Third: distractors nobody ever chooses. A 4-option item with two dead options is
really a 2-option item, and a coin flip scores 50%.

## The level question

The app writes `current_estimated_level` onto every learner profile and the mock
exam reports a level back to the learner. Both rest entirely on CEFR labels that
were assigned by eye and have never been checked against how anyone actually
performs.

`level-check.sql` is the check. Difficulty should fall steadily as level rises.
If B1 items turn out easier than A2 items, the ladder is wrong, and every level
estimate the site has ever shown a learner is wrong with it. Nothing in the
content itself can reveal this — only responses can.

## Cheapest signal of all

`question_reports` exists and has 0 rows. That is a learner-facing "something is
wrong with this question" route that is already built. Zero reports may mean
zero problems, or it may mean nobody can find the button. Worth checking which,
because a single learner reporting a bad item is worth more than a thousand
attempts you have to infer from.
