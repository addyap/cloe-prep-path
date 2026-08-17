-- Pedagogy audit follow-up: remove 'pass out' from gap_fill accept-list
-- Item 9a81b01d: "Could you _____ these agendas to everyone before the meeting starts?"
-- 'pass out' in BrE primarily means to faint, not to distribute. Remaining
-- accepted answers 'hand out' / 'give out' cover the teaching point fully.

begin;

update public.questions
set options = '["hand out","give out"]'::jsonb
where id = '9a81b01d-4997-4020-9262-42de7a269581';

commit;
