-- ITEM QUALITY STATISTICS
-- Run against the live DB once attempt data has accumulated.
--   supabase db query --linked -f analysis/item-stats.sql
--
-- Three numbers decide whether a question is any good. This computes all three.
--
--   FACILITY      what fraction of learners get it right.
--                 Below 0.25 on a 4-option item = at or under pure guessing:
--                 the item is broken, mis-keyed, or has two right answers.
--                 Above 0.95 = everyone gets it, so it distinguishes nobody.
--                 Healthy range is roughly 0.30 - 0.90.
--
--   DISCRIMINATION does the item separate strong learners from weak ones?
--                 This is THE number. It compares how the top third of
--                 learners (by overall accuracy) did against the bottom third.
--                 Positive and high = good. Near zero = the item is noise.
--                 NEGATIVE = strong learners do WORSE than weak ones, which
--                 almost always means the key is wrong or a distractor is
--                 also correct. Negative discrimination is a red alert.
--
--   n             how many answers it is based on. Ignore anything under 30.
--                 Facility stabilises around 30; discrimination needs 100+.

with learner_ability as (
  -- each learner's overall accuracy = their proxy ability score
  select user_id,
         avg(case when is_correct then 1.0 else 0.0 end) as ability,
         count(*) as answered
  from public.attempts
  group by user_id
  having count(*) >= 20          -- ignore learners with too little history
),
banded as (
  select user_id, ability,
         ntile(3) over (order by ability) as band   -- 1 = weakest, 3 = strongest
  from learner_ability
),
per_item as (
  select a.question_id,
         count(*) as n,
         avg(case when a.is_correct then 1.0 else 0.0 end) as facility,
         avg(case when b.band = 3 and a.is_correct then 1.0
                  when b.band = 3 then 0.0 end) as top_third,
         avg(case when b.band = 1 and a.is_correct then 1.0
                  when b.band = 1 then 0.0 end) as bottom_third
  from public.attempts a
  join banded b on b.user_id = a.user_id
  group by a.question_id
)
select q.id,
       q.skill,
       q.cefr_level,
       left(q.prompt_text, 60) as prompt,
       p.n,
       round(p.facility, 2)                        as facility,
       round(p.top_third - p.bottom_third, 2)      as discrimination,
       case
         when p.n < 30                              then 'insufficient data'
         when p.top_third - p.bottom_third < 0      then 'RED ALERT - negative discrimination, check the key'
         when p.facility < 0.25                     then 'RED ALERT - at or below guessing'
         when p.facility > 0.95                     then 'too easy - teaches nothing'
         when p.top_third - p.bottom_third < 0.10   then 'weak - does not separate learners'
         else 'healthy'
       end as verdict
from per_item p
join public.questions q on q.id = p.question_id
order by
  case when p.n < 30 then 2 else 1 end,
  (p.top_third - p.bottom_third) asc,     -- worst discrimination first
  p.facility asc;
