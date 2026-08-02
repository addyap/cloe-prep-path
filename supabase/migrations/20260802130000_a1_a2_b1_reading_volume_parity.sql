-- Reading volume parity for A1/A2/B1. C1/C2/B2 each got a round-2 of 3
-- new passages (9 questions) for the inference-depth fix, leaving them
-- at 14 passages/42 questions while A1/A2/B1 stayed at the original
-- 11/33. This is a volume-only addition to match passage count across
-- all six levels -- NOT an inference/gist/tone treatment, which would be
-- miscalibrated below B2 per CEFR's own descriptors (confirmed by
-- sampling A2 and B1: both are correctly literal fact-lookup at these
-- levels). All 27 new questions here are straightforward comprehension
-- checks, same style and complexity as each level's existing content.

WITH vol_a1_0 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('New Coffee Machine', 'There is a new coffee machine in the kitchen. It is next to the fridge. The old machine is gone. You can make tea, coffee, and hot chocolate. Please clean the machine after you use it. If it is broken, tell Sam in IT.', 'reading', 'A1', 'general')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A1', 'mcq', 'general', 'Where is the new coffee machine?', to_jsonb(ARRAY['Next to the fridge','Next to the door','In the meeting room','Near the lift']::text[]), 'Next to the fridge', 'The notice says the machine "is next to the fridge."', (SELECT id FROM vol_a1_0)),
  ('reading', 'A1', 'mcq', 'general', 'What should you do after you use the machine?', to_jsonb(ARRAY['Clean it','Turn it off','Take it home','Fill it with water']::text[]), 'Clean it', 'The notice says "Please clean the machine after you use it."', (SELECT id FROM vol_a1_0)),
  ('reading', 'A1', 'mcq', 'general', 'Who should you tell if the machine is broken?', to_jsonb(ARRAY['Sam in IT','The manager','Reception','HR']::text[]), 'Sam in IT', 'The notice says "If it is broken, tell Sam in IT."', (SELECT id FROM vol_a1_0));

WITH vol_a1_1 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('Office Closed for Public Holiday', 'The office is closed on Monday. It is a public holiday. The office will open again on Tuesday at nine o''clock. If you have an important email, please send it before Friday. Have a nice holiday!', 'reading', 'A1', 'email')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A1', 'mcq', 'email', 'Why is the office closed on Monday?', to_jsonb(ARRAY['It is a public holiday','The building is broken','Everyone is sick','It is the weekend']::text[]), 'It is a public holiday', 'The message says "It is a public holiday."', (SELECT id FROM vol_a1_1)),
  ('reading', 'A1', 'mcq', 'email', 'What time does the office open on Tuesday?', to_jsonb(ARRAY['Nine o''clock','Eight o''clock','Ten o''clock','Seven o''clock']::text[]), 'Nine o''clock', 'The message says the office "will open again on Tuesday at nine o''clock."', (SELECT id FROM vol_a1_1)),
  ('reading', 'A1', 'mcq', 'email', 'When should you send an important email?', to_jsonb(ARRAY['Before Friday','On Monday','On Tuesday','After the holiday']::text[]), 'Before Friday', 'The message says "please send it before Friday."', (SELECT id FROM vol_a1_1));

WITH vol_a1_2 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('New Parking Spaces', 'The company has ten new parking spaces. They are behind the building. The spaces are for staff only, not for visitors. You need a parking sticker for your car. Ask reception for a sticker.', 'reading', 'A1', 'general')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A1', 'mcq', 'general', 'How many new parking spaces are there?', to_jsonb(ARRAY['Ten','Five','Twenty','Fifteen']::text[]), 'Ten', 'The notice says "The company has ten new parking spaces."', (SELECT id FROM vol_a1_2)),
  ('reading', 'A1', 'mcq', 'general', 'Where are the new parking spaces?', to_jsonb(ARRAY['Behind the building','In front of the building','Next to reception','On the street']::text[]), 'Behind the building', 'The notice says "They are behind the building."', (SELECT id FROM vol_a1_2)),
  ('reading', 'A1', 'mcq', 'general', 'Who should you ask for a parking sticker?', to_jsonb(ARRAY['Reception','The manager','Security','IT']::text[]), 'Reception', 'The notice says "Ask reception for a sticker."', (SELECT id FROM vol_a1_2));

WITH vol_a2_0 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('New Employee Survey', 'The company is running a short survey about working from home. It takes about ten minutes to complete. All staff are asked to fill it in by next Friday. The survey is anonymous, so your name will not be shown. Results will be shared with the team in the following month''s meeting. If you have any technical problems opening the survey link, contact the HR team.', 'reading', 'A2', 'email')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A2', 'mcq', 'email', 'How long does the survey take?', to_jsonb(ARRAY['About ten minutes','About thirty minutes','About one hour','About five minutes']::text[]), 'About ten minutes', 'The email says the survey "takes about ten minutes to complete."', (SELECT id FROM vol_a2_0)),
  ('reading', 'A2', 'mcq', 'email', 'By when must staff complete the survey?', to_jsonb(ARRAY['Next Friday','Next Monday','Tomorrow','The end of the month']::text[]), 'Next Friday', 'The email says staff are "asked to fill it in by next Friday."', (SELECT id FROM vol_a2_0)),
  ('reading', 'A2', 'mcq', 'email', 'Who should staff contact about technical problems?', to_jsonb(ARRAY['The HR team','IT support','Their manager','Reception']::text[]), 'The HR team', 'The email says "contact the HR team" for technical problems opening the survey link.', (SELECT id FROM vol_a2_0));

WITH vol_a2_1 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('Office Recycling Update', 'From next month, the office will have three new recycling bins: paper, plastic, and general waste. The bins will be placed near the printer on each floor. Staff are asked to rinse containers like bottles and cans before putting them in the plastic bin. Food waste should still go in the small bins in the kitchen, not the new recycling bins. A short guide will be sent by email before the bins arrive.', 'reading', 'A2', 'general')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A2', 'mcq', 'general', 'Where will the new bins be placed?', to_jsonb(ARRAY['Near the printer on each floor','In the car park','Next to reception','In the kitchen only']::text[]), 'Near the printer on each floor', 'The notice says the bins "will be placed near the printer on each floor."', (SELECT id FROM vol_a2_1)),
  ('reading', 'A2', 'mcq', 'general', 'What should staff do before putting bottles in the plastic bin?', to_jsonb(ARRAY['Rinse them','Crush them','Remove the label','Weigh them']::text[]), 'Rinse them', 'The notice asks staff "to rinse containers like bottles and cans before putting them in the plastic bin."', (SELECT id FROM vol_a2_1)),
  ('reading', 'A2', 'mcq', 'general', 'Where should food waste go?', to_jsonb(ARRAY['The small bins in the kitchen','The new general waste bin','The paper bin','Outside in the car park']::text[]), 'The small bins in the kitchen', 'The notice says food waste "should still go in the small bins in the kitchen, not the new recycling bins."', (SELECT id FROM vol_a2_1));

WITH vol_a2_2 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('Changes to Sick Leave Reporting', 'Starting next week, staff must report sick leave through the new HR app instead of calling the office. Open the app, select ''Report Absence'', and choose the reason. You should report your absence before nine thirty in the morning if possible. If you are away for more than three days, you will need to upload a doctor''s note in the app. Staff without smartphone access can still call the main office number as before.', 'reading', 'A2', 'general')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'A2', 'mcq', 'general', 'How should staff report sick leave from next week?', to_jsonb(ARRAY['Through the new HR app','By calling the office','By email','By text message']::text[]), 'Through the new HR app', 'The notice says staff "must report sick leave through the new HR app instead of calling the office."', (SELECT id FROM vol_a2_2)),
  ('reading', 'A2', 'mcq', 'general', 'By what time should staff report their absence?', to_jsonb(ARRAY['Nine thirty in the morning','Eight o''clock','Ten o''clock','Midday']::text[]), 'Nine thirty in the morning', 'The notice says to "report your absence before nine thirty in the morning if possible."', (SELECT id FROM vol_a2_2)),
  ('reading', 'A2', 'mcq', 'general', 'What is required if someone is away for more than three days?', to_jsonb(ARRAY['A doctor''s note uploaded in the app','A phone call to HR','A meeting with the manager','Nothing extra']::text[]), 'A doctor''s note uploaded in the app', 'The notice says "you will need to upload a doctor''s note in the app" if away more than three days.', (SELECT id FROM vol_a2_2));

WITH vol_b1_0 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('Company Volunteering Day', 'This year, the company is introducing a paid volunteering day for all staff. Employees can take one day off, in addition to their normal holiday allowance, to volunteer for a charity of their choice. To use the day, staff need to submit a short form to HR at least two weeks in advance, naming the charity and describing the activity. The company will not reimburse any travel costs related to the volunteering day, though some local charities may offer transport themselves. Managers are asked to approve requests promptly, as the scheme is designed to be easy to use rather than something staff have to fight for.', 'reading', 'B1', 'email')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'B1', 'mcq', 'email', 'How much notice must staff give before their volunteering day?', to_jsonb(ARRAY['At least two weeks','At least one week','At least one month','No notice is needed']::text[]), 'At least two weeks', 'The email says staff must submit the form "at least two weeks in advance."', (SELECT id FROM vol_b1_0)),
  ('reading', 'B1', 'mcq', 'email', 'Does the company cover travel costs for the volunteering day?', to_jsonb(ARRAY['No, it does not','Yes, fully','Yes, but only for local charities','Only if approved by a manager']::text[]), 'No, it does not', 'The email says "the company will not reimburse any travel costs related to the volunteering day."', (SELECT id FROM vol_b1_0)),
  ('reading', 'B1', 'mcq', 'email', 'Why are managers asked to approve requests promptly?', to_jsonb(ARRAY['Because the scheme is meant to be easy to use, not something staff have to fight for','Because the charity needs an urgent answer','Because HR will reject late approvals','Because the day off is optional for managers to allow']::text[]), 'Because the scheme is meant to be easy to use, not something staff have to fight for', 'The email states this directly: "the scheme is designed to be easy to use rather than something staff have to fight for."', (SELECT id FROM vol_b1_0));

WITH vol_b1_1 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('New Expense App Rollout', 'The company will replace the current paper-based expense forms with a mobile app from next month. Staff will be able to photograph receipts directly in the app rather than keeping paper copies, and approved claims will be paid within five working days instead of the current two weeks. During the transition, both systems will run in parallel for four weeks, so staff can continue using paper forms if they are not ready to switch. After this transition period, only the app will be accepted. Training sessions will be held in the first two weeks of next month for anyone who wants help getting started.', 'reading', 'B1', 'general')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'B1', 'mcq', 'general', 'How will approved claims be paid once the app is in use?', to_jsonb(ARRAY['Within five working days','Within two weeks','Within one month','Immediately']::text[]), 'Within five working days', 'The notice says approved claims "will be paid within five working days instead of the current two weeks."', (SELECT id FROM vol_b1_1)),
  ('reading', 'B1', 'mcq', 'general', 'How long will both systems run in parallel?', to_jsonb(ARRAY['Four weeks','Two weeks','One week','Six weeks']::text[]), 'Four weeks', 'The notice says "both systems will run in parallel for four weeks."', (SELECT id FROM vol_b1_1)),
  ('reading', 'B1', 'mcq', 'general', 'What will happen after the transition period ends?', to_jsonb(ARRAY['Only the app will be accepted','Only paper forms will be accepted','Both systems will continue as normal','The app will be removed']::text[]), 'Only the app will be accepted', 'The notice says "After this transition period, only the app will be accepted."', (SELECT id FROM vol_b1_1));

WITH vol_b1_2 AS (
  INSERT INTO public.passages (title, body, skill, cefr_level, context_tag)
    VALUES ('Office Move Update', 'As previously announced, the finance team will move to the second floor next Wednesday to make space for the growing customer support team on the ground floor. IT will set up new phone lines and computers the night before, so no work should be lost during the move itself. Staff are asked to pack personal items into the boxes provided by Friday, label them clearly, and leave desks clear by Tuesday evening. Anyone with large items, such as extra monitors or personal furniture, should contact facilities directly rather than including them with general boxes, since these need to be moved separately.', 'reading', 'B1', 'email')
  RETURNING id
)
INSERT INTO public.questions (skill, cefr_level, type, context_tag, prompt_text, options, correct_answer, explanation, passage_id) VALUES
  ('reading', 'B1', 'mcq', 'email', 'Which team is moving to the second floor?', to_jsonb(ARRAY['The finance team','The customer support team','The IT team','The facilities team']::text[]), 'The finance team', 'The email says "the finance team will move to the second floor next Wednesday."', (SELECT id FROM vol_b1_2)),
  ('reading', 'B1', 'mcq', 'email', 'By when should desks be left clear?', to_jsonb(ARRAY['Tuesday evening','Wednesday morning','Friday','Monday']::text[]), 'Tuesday evening', 'The email says staff should "leave desks clear by Tuesday evening."', (SELECT id FROM vol_b1_2)),
  ('reading', 'B1', 'mcq', 'email', 'What should staff do about large items like extra monitors?', to_jsonb(ARRAY['Contact facilities directly','Put them in the general boxes','Leave them on the desk','Take them home']::text[]), 'Contact facilities directly', 'The email says staff with large items "should contact facilities directly rather than including them with general boxes."', (SELECT id FROM vol_b1_2));
