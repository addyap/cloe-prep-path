-- CEFR LEVEL VALIDATION
-- Are the labelled levels real? Run once you have data.
--   supabase db query --linked -f analysis/level-check.sql
--
-- The logic: difficulty should rise with level. If your A2 items are harder
-- than your B1 items, the labels are wrong - and since the app writes a
-- current_estimated_level onto every learner profile, wrong labels mean you
-- are telling people the wrong thing about themselves.
--
-- Read the facility column DOWNWARDS. It should decrease steadily.
-- Any level that is easier than the level below it is mislabelled.

select q.skill,
       q.cefr_level,
       count(distinct q.id)                              as items_with_data,
       count(*)                                          as answers,
       round(avg(case when a.is_correct then 1.0 else 0.0 end), 2) as facility
from public.attempts a
join public.questions q on q.id = a.question_id
group by q.skill, q.cefr_level
having count(*) >= 50
order by q.skill,
         array_position(array['A1','A2','B1','B2','C1','C2'], q.cefr_level::text);
