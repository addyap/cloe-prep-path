-- DISTRACTOR USAGE
-- Which wrong answers does anybody actually pick?
--   supabase db query --linked -f analysis/distractor-usage.sql
--
-- A distractor nobody ever chooses is dead weight - a 4-option item where two
-- options are never picked is really a 2-option item, and a coin flip scores
-- 50%. This is the empirical version of the "weak distractor" problem: instead
-- of judging by eye whether an option is plausible, you observe whether a real
-- learner was ever tempted.
--
-- Also watch for a distractor chosen MORE often than the key. That usually
-- means the item has two defensible answers, or the key is simply wrong.

select q.id,
       q.skill,
       q.cefr_level,
       left(q.prompt_text, 50) as prompt,
       a.user_answer,
       (a.user_answer = q.correct_answer) as is_key,
       count(*)                           as chosen,
       round(100.0 * count(*) / sum(count(*)) over (partition by q.id), 1) as pct
from public.attempts a
join public.questions q on q.id = a.question_id
where q.type = 'mcq'
group by q.id, q.skill, q.cefr_level, q.prompt_text, a.user_answer, q.correct_answer
having sum(count(*)) over (partition by q.id) >= 30
order by q.id, chosen desc;
