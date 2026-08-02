-- Speaking volume/variety round. The 2026-08-01 audit flagged speaking as
-- thin: 54 items across only 3 context_tags (3/phase/level), vs writing's
-- 48/4 or grammar_vocab's 504/6 — a session immediately exhausts the pool
-- for a given phase/level and starts repeating. Speaking's 3 tags map
-- directly to the official CLOE oral exam's 3 fixed phases (intro/
-- interview, role-play, thematic discussion), so unlike other skills this
-- can't be widened with more tags — the fix is depth: doubling density per
-- phase/level from 3 to 6, adding 54 new prompts (3 new/phase/level x 3
-- phases x 6 levels), each briefed against the existing 54 to avoid
-- repeating scenarios/themes.

INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text) VALUES
  -- Interview
  ('speaking', 'A1', 'prompt', 'interview', 'How do you get to work every day? Bus, car, or on foot?'),
  ('speaking', 'A1', 'prompt', 'interview', 'What time do you finish work each day?'),
  ('speaking', 'A1', 'prompt', 'interview', 'Who do you work with? Tell me about your colleagues.'),
  ('speaking', 'A2', 'prompt', 'interview', 'What do you usually do during your lunch break?'),
  ('speaking', 'A2', 'prompt', 'interview', 'Tell me about a normal day at your job, from morning to evening.'),
  ('speaking', 'A2', 'prompt', 'interview', 'What do you like most about your team?'),
  ('speaking', 'B1', 'prompt', 'interview', 'Describe a time you helped a colleague with a problem at work.'),
  ('speaking', 'B1', 'prompt', 'interview', 'Talk about a goal you have for your career this year.'),
  ('speaking', 'B1', 'prompt', 'interview', 'Describe how you usually communicate with your manager about your work.'),
  ('speaking', 'B2', 'prompt', 'interview', 'Tell me about a time you had to give feedback to a colleague. How did you approach it?'),
  ('speaking', 'B2', 'prompt', 'interview', 'Describe a change at your workplace that you had to adapt to. How did you handle it?'),
  ('speaking', 'B2', 'prompt', 'interview', 'Talk about a time you worked with a difficult client or customer. What did you do?'),
  ('speaking', 'C1', 'prompt', 'interview', 'Describe a time you had to persuade a sceptical colleague or manager to support your idea. What approach did you take?'),
  ('speaking', 'C1', 'prompt', 'interview', 'Talk about a mistake you made at work and what you learned from it.'),
  ('speaking', 'C1', 'prompt', 'interview', 'Describe a time you had to balance a short-term business need against a longer-term goal. How did you decide?'),
  ('speaking', 'C2', 'prompt', 'interview', 'Describe a time your judgement on a work matter was challenged by someone more senior than you. How did you respond?'),
  ('speaking', 'C2', 'prompt', 'interview', 'Talk about a time you had to change your own opinion after hearing a colleague''s perspective. What changed your mind?'),
  ('speaking', 'C2', 'prompt', 'interview', 'Describe how you have handled a situation where company policy conflicted with what you believed was the right thing to do.'),

  -- Role-play
  ('speaking', 'A1', 'prompt', 'role_play', 'You want to sit next to your colleague, Alex, in the meeting. Ask Alex if the seat next to them is free.'),
  ('speaking', 'A1', 'prompt', 'role_play', 'You need to use the photocopier, but a colleague is using it. Politely ask how much longer they will be.'),
  ('speaking', 'A1', 'prompt', 'role_play', 'A visitor has arrived at reception. Greet them and ask who they are here to see.'),
  ('speaking', 'A2', 'prompt', 'role_play', 'You want to change your lunch break time today. Ask your manager if that is possible.'),
  ('speaking', 'A2', 'prompt', 'role_play', 'A colleague left their umbrella in the meeting room. Tell them where it is.'),
  ('speaking', 'A2', 'prompt', 'role_play', 'You need to book a meeting room for tomorrow morning. Call reception and ask if one is free.'),
  ('speaking', 'B1', 'prompt', 'role_play', 'A colleague asks to borrow money until payday. Politely explain your position and offer an alternative if you can.'),
  ('speaking', 'B1', 'prompt', 'role_play', 'You need to reschedule a meeting with a client because you are unwell. Call them to explain and propose a new time.'),
  ('speaking', 'B1', 'prompt', 'role_play', 'A new team member seems overwhelmed by their tasks. Check in with them and offer some support.'),
  ('speaking', 'B2', 'prompt', 'role_play', 'You need to tell a colleague that a mistake in their report caused a delay. Explain the issue and agree on next steps together.'),
  ('speaking', 'B2', 'prompt', 'role_play', 'A long-term supplier is threatening to end the contract over a late payment. Call them to resolve the issue and keep the relationship.'),
  ('speaking', 'B2', 'prompt', 'role_play', 'Your team has hit a busy period and you need a colleague to cover an extra shift. Ask them and address any concerns they raise.'),
  ('speaking', 'C1', 'prompt', 'role_play', 'A client is unhappy that a project went over budget and wants an explanation before agreeing to pay the final invoice. Handle the call.'),
  ('speaking', 'C1', 'prompt', 'role_play', 'You need to tell your manager that a deadline they promised the client is not realistic. Raise the concern and suggest an alternative.'),
  ('speaking', 'C1', 'prompt', 'role_play', 'Two departments disagree about who is responsible for a shared budget overspend. As the person leading the review, mediate the discussion.'),
  ('speaking', 'C2', 'prompt', 'role_play', 'You must inform a high-performing employee that their promotion has been delayed due to a company-wide freeze, without discouraging them. Have that conversation.'),
  ('speaking', 'C2', 'prompt', 'role_play', 'A client wants your company to bend an ethical guideline in exchange for a large contract. Address the request diplomatically but firmly.'),
  ('speaking', 'C2', 'prompt', 'role_play', 'You need to deliver difficult news to a business partner that a joint project is being cancelled due to a strategic shift. Manage the conversation.'),

  -- Discussion
  ('speaking', 'A1', 'prompt', 'discussion', 'Do you think it''s good to talk to your colleagues during breaks? Why?'),
  ('speaking', 'A1', 'prompt', 'discussion', 'Is it better to have a short lunch or a long lunch? What do you think?'),
  ('speaking', 'A1', 'prompt', 'discussion', 'Do you like wearing a uniform or your own clothes to work? Why?'),
  ('speaking', 'A2', 'prompt', 'discussion', 'Do you think it''s important for a workplace to be quiet? Why or why not?'),
  ('speaking', 'A2', 'prompt', 'discussion', 'Is it better to work fixed hours or flexible hours? What do you think?'),
  ('speaking', 'A2', 'prompt', 'discussion', 'Do you prefer talking to colleagues in person or by message? Why?'),
  ('speaking', 'B1', 'prompt', 'discussion', 'Do you think regular team meetings are useful, or do they waste time? Explain your opinion.'),
  ('speaking', 'B1', 'prompt', 'discussion', 'Is it better for a company to promote from within, or should experience elsewhere always be valued more? What do you think?'),
  ('speaking', 'B1', 'prompt', 'discussion', 'Do you think employees should be able to choose their own working hours? Explain your opinion.'),
  ('speaking', 'B2', 'prompt', 'discussion', 'Should companies pay for employees'' professional development courses? What''s your view?'),
  ('speaking', 'B2', 'prompt', 'discussion', 'Do you think open-plan offices help or hurt teamwork? Explain your opinion.'),
  ('speaking', 'B2', 'prompt', 'discussion', 'Should employees be allowed to work from anywhere in the world, not just from home? What do you think?'),
  ('speaking', 'C1', 'prompt', 'discussion', 'Is it fair for companies to require employees to be available on messaging apps outside working hours? Argue your position.'),
  ('speaking', 'C1', 'prompt', 'discussion', 'Should companies be transparent about employee salaries within the organisation? What is your view, and why?'),
  ('speaking', 'C1', 'prompt', 'discussion', 'Is constant performance tracking through software good or bad for employee motivation? Argue your position.'),
  ('speaking', 'C2', 'prompt', 'discussion', 'Should companies be required to disclose how they use AI in hiring and performance decisions? Defend your view.'),
  ('speaking', 'C2', 'prompt', 'discussion', 'Is it ethical for a company to prioritise shareholder profit over employee wellbeing during a downturn? Argue your position.'),
  ('speaking', 'C2', 'prompt', 'discussion', 'Should senior leaders be paid significantly more than the rest of the workforce, regardless of company performance? Defend your view.');
