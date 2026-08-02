-- Reading inference/gist/tone depth pass. The 2026-08-01 audit found every
-- C1 reading question was pure fact-lookup ("According to the text, what/
-- when/why...") with zero questions requiring inference, gist, or tone —
-- a C1 reading item was functionally a B1 comprehension check in fancier
-- vocabulary. C2 was partially better (7/11 passages already had genuine
-- synthesis questions) but 4 were still flat lookup. This replaces the
-- single weakest (most trivial, single-fact) question in each affected
-- passage with a genuine inference/gist/tone question requiring readers
-- to combine or interpret information rather than locate a quoted phrase.
-- In-place UPDATEs only — question count per passage/level is unchanged.

-- C1: Company-wide Rollout of the New Expense Management System
UPDATE public.questions SET
  prompt_text = 'What is the main purpose of this message?',
  options = to_jsonb(ARRAY[
    'To explain how and when staff will move to the new expense system',
    'To request feedback on the mobile receipt-scanning feature',
    'To warn staff that claims over £500 will no longer be approved',
    'To announce that manual signatures have been removed from the process'
  ]::text[]),
  correct_answer = 'To explain how and when staff will move to the new expense system',
  explanation = 'The message''s core content is the phased rollout schedule, training requirement, and cut-off date — informing staff how and when the transition happens. It does not ask for feedback, does not say claims over £500 stop being approved (only that manual sign-off remains for now), and the manual-signature step is described as an ongoing limitation the IT team is still working to fix, not something already removed.'
WHERE id = '5af1ed16-02bd-48bf-a08f-719c2c2474fc';

-- C1: Findings from the Annual Software Licence Audit
UPDATE public.questions SET
  prompt_text = 'What is the tone of "we would rather quietly true up the numbers now than face an uncomfortable conversation with the vendor''s compliance team later"?',
  options = to_jsonb(ARRAY[
    'Diplomatically cautious, urging proactive correction to avoid a bigger problem',
    'Openly hostile toward the software vendor',
    'Indifferent about whether licensing issues are resolved',
    'Boastful about the company''s compliance record'
  ]::text[]),
  correct_answer = 'Diplomatically cautious, urging proactive correction to avoid a bigger problem',
  explanation = 'The phrasing softens a real compliance risk ("quietly true up") while still pushing for action to avoid a worse outcome later ("uncomfortable conversation... later"), signalling careful, non-alarmist urgency rather than hostility, indifference, or boasting.'
WHERE id = 'ff5d4325-d43e-4b86-9211-6c6dba9af480';

-- C1: Invitation to Speak at Our Annual Industry Summit
UPDATE public.questions SET
  prompt_text = 'What can be inferred about the summit''s budget this year compared to previous years?',
  options = to_jsonb(ARRAY[
    'It appears tighter than before, since a speaking fee is not available this time',
    'It has increased substantially, funding accommodation for the first time',
    'It is unrelated to whether speakers receive a fee',
    'It fully covers a speaking fee, accommodation, and travel as usual'
  ]::text[]),
  correct_answer = 'It appears tighter than before, since a speaking fee is not available this time',
  explanation = 'The email says organisers are "unable to offer a speaking fee this year due to budget constraints" — the phrase "this year" implies a change from previous years, so a fee was likely offered before. This is implied, not stated outright.'
WHERE id = '9a5d351c-5076-4adf-a82e-d75a7e4ee43c';

-- C1: Launching Our Diversity and Inclusion Initiative
UPDATE public.questions SET
  prompt_text = 'What does the phrase "including areas where we have fallen short" suggest about the company''s approach to this initiative?',
  options = to_jsonb(ARRAY[
    'It intends to report honestly on setbacks, not just successes',
    'It expects the initiative to fail completely',
    'It plans to hide any negative results from staff',
    'It has already identified major failures before starting'
  ]::text[]),
  correct_answer = 'It intends to report honestly on setbacks, not just successes',
  explanation = 'Committing to report "transparently... including areas where we have fallen short" signals an intent toward honest, balanced reporting, not an expectation of failure or an intention to conceal results.'
WHERE id = 'f7daa637-113f-4be6-ac74-11e066f23bbf';

-- C1: Our New Head Office
UPDATE public.questions SET
  prompt_text = 'What does the passage suggest about the trade-off involved in the new office?',
  options = to_jsonb(ARRAY[
    'Staff gain more collaborative space but give up some individual desk space',
    'The new office is worse in every way than the current one',
    'Desk space and collaborative space have both increased',
    'There is no trade-off; everything has improved'
  ]::text[]),
  correct_answer = 'Staff gain more collaborative space but give up some individual desk space',
  explanation = 'The email notes "considerably more collaborative space... though individual desk space will be slightly reduced," directly setting up a gain-and-loss trade-off rather than a uniform improvement or decline.'
WHERE id = '7eead99e-457b-4877-820e-155a62794d34';

-- C1: Remote Work Productivity Study
UPDATE public.questions SET
  prompt_text = 'What is the overall conclusion the researchers draw from these mixed findings?',
  options = to_jsonb(ARRAY[
    'Hybrid-work policy should vary by the nature of the task rather than apply uniformly',
    'Hybrid work should be abandoned entirely because of collaboration losses',
    'All teams should switch to fully remote work immediately',
    'The productivity differences found are too small to matter'
  ]::text[]),
  correct_answer = 'Hybrid-work policy should vary by the nature of the task rather than apply uniformly',
  explanation = 'The study states the discrepancy between task types "is not necessarily an argument against hybrid work itself, but rather evidence that policies should be tailored to the nature of the work being performed, rather than applied uniformly" — this is the researchers'' actual takeaway, not a call to abandon hybrid work or go fully remote.'
WHERE id = '90778703-7012-4d8f-bf04-0a0281fe2b03';

-- C1: Restructuring Announcement
UPDATE public.questions SET
  prompt_text = 'What does the tone of this email suggest about the writer''s awareness of employee concerns?',
  options = to_jsonb(ARRAY[
    'The writer anticipates staff anxiety and tries to reassure them proactively',
    'The writer is dismissive of any employee concerns',
    'The writer is unaware that changes might worry staff',
    'The writer is frustrated about having to make this announcement'
  ]::text[]),
  correct_answer = 'The writer anticipates staff anxiety and tries to reassure them proactively',
  explanation = 'The email explicitly names the risk ("changes of this nature can generate uncertainty") and immediately follows with reassurance ("we do not expect any disruption... all existing commitments will be honoured"), showing proactive awareness rather than dismissiveness or ignorance of staff concerns.'
WHERE id = 'b2bf0401-df03-49d5-a867-81e468ce1906';

-- C1: Rollout of Company Expense Cards
UPDATE public.questions SET
  prompt_text = 'What can be inferred about the company''s main concern in introducing this policy?',
  options = to_jsonb(ARRAY[
    'Ensuring the card is used strictly for legitimate business purposes',
    'Reducing the number of employees who travel for work',
    'Replacing the finance app with a new system',
    'Encouraging employees to make more personal purchases'
  ]::text[]),
  correct_answer = 'Ensuring the card is used strictly for legitimate business purposes',
  explanation = 'The strict receipt/note requirement, the explicit warning that "any personal use, even if reimbursed later, will be treated as a policy violation," and the withdrawal clause all point to controlling misuse as the policy''s central concern.'
WHERE id = 'df846091-bd81-4a9a-a445-03ccfd681b16';

-- C1: Supplier Onboarding Checklist
UPDATE public.questions SET
  prompt_text = 'What does the recommendation to begin onboarding six weeks in advance mainly suggest about the process?',
  options = to_jsonb(ARRAY[
    'The steps involved, especially for overseas suppliers, can take significant time',
    'Onboarding is normally instant and six weeks is excessive caution',
    'The six-week window applies only to suppliers under framework agreements',
    'Vendor codes alone take six weeks to generate'
  ]::text[]),
  correct_answer = 'The steps involved, especially for overseas suppliers, can take significant time',
  explanation = 'The checklist lists sequential steps (documentation, a credit check that "can extend to two weeks for suppliers based overseas," a sample order) whose combined duration explains why a six-week buffer is recommended, not because any single step is inherently slow for everyone.'
WHERE id = '1755a362-281e-400a-ac8a-1d1d416a724c';

-- C1: Transition to a New Payroll Provider
UPDATE public.questions SET
  prompt_text = 'What does the writer''s closing phrase "we appreciate your patience during this transition" suggest about how the company expects staff to react?',
  options = to_jsonb(ARRAY[
    'Some disruption or inconvenience is anticipated during the changeover',
    'Staff are expected to be completely unaffected by the change',
    'The company expects no one to notice the change at all',
    'The company is confident there will be no delays for anyone'
  ]::text[]),
  correct_answer = 'Some disruption or inconvenience is anticipated during the changeover',
  explanation = 'Thanking staff in advance for "patience" — paired with the email''s own admission that international-transfer staff "may experience a delay" — signals the writer expects some friction during the changeover, not a seamless, unnoticed switch.'
WHERE id = '9b792bae-e9f8-44d4-9387-8cbaeed44592';

-- C1: Understanding the New Performance Review Cycle
UPDATE public.questions SET
  prompt_text = 'What problem with the old review process does the detail about drawing on "notes from all four check-ins" suggest the new model is designed to fix?',
  options = to_jsonb(ARRAY[
    'Managers'' assessments being overly influenced by only their most recent impression of an employee',
    'Employees not receiving any feedback at all under the old system',
    'Peer feedback previously being compulsory',
    'Bonuses being paid too frequently'
  ]::text[]),
  correct_answer = 'Managers'' assessments being overly influenced by only their most recent impression of an employee',
  explanation = 'The text says managers will use notes from all four check-ins "rather than relying solely on their most recent impression" — naming recency bias as exactly the failure mode the new model avoids, not an absence of feedback, peer-feedback rules, or bonus frequency.'
WHERE id = '88c73d7e-ed46-44b9-98d1-bc66c6ad95fc';

-- C2: A Note on Handling Escalations
UPDATE public.questions SET
  prompt_text = 'What is the writer mainly pushing back against in this note?',
  options = to_jsonb(ARRAY[
    'The assumption that the front-line team''s performance has declined',
    'The decision to introduce the new ticketing system',
    'The proposal to invest in a finance handoff mechanism',
    'The rise in complaint ticket volume'
  ]::text[]),
  correct_answer = 'The assumption that the front-line team''s performance has declined',
  explanation = 'The note opens by naming and rejecting the easy conclusion ("It would be easy to conclude... that our front-line team is simply overwhelmed and understaffed") and spends the rest of the note showing the team is actually outperforming previous benchmarks — the finance handoff and ticketing system are things the writer discusses, not what they are arguing against.'
WHERE id = '68d2d15e-f7b7-4990-bba6-d4ba6a7cb093';

-- C2: Case Study: How Bramwell Logistics Cut Delivery Delays
UPDATE public.questions SET
  prompt_text = 'What does the case study imply was surprising about the resistance to the rollout?',
  options = to_jsonb(ARRAY[
    'The employees most resistant to change were the newest, not the most experienced, staff',
    'No employees resisted the new system at all',
    'Senior dispatchers refused to use the software entirely',
    'Resistance came only from drivers, not dispatchers'
  ]::text[]),
  correct_answer = 'The employees most resistant to change were the newest, not the most experienced, staff',
  explanation = 'The case study flags this explicitly as counter to expectation: "the most resistant team during rollout was not, as expected, the longest-serving dispatchers, but a group of newer hires."'
WHERE id = '29caf5f4-d9d7-4393-a9c3-48bcd71f3714';

-- C2: Extract from Our First Sustainability Report
UPDATE public.questions SET
  prompt_text = 'What does "we would rather set out an honest baseline now than present a more flattering picture that later proves difficult to sustain" suggest about the company''s philosophy in publishing this report?',
  options = to_jsonb(ARRAY[
    'It values transparency about shortfalls over presenting an overly positive image',
    'It intends to stop publishing sustainability reports after this year',
    'It believes none of its targets are achievable',
    'It wants to avoid ever discussing missed targets again'
  ]::text[]),
  correct_answer = 'It values transparency about shortfalls over presenting an overly positive image',
  explanation = 'Choosing an "honest baseline" over "a more flattering picture" is a direct statement of preference for candour over image management — it says nothing about ending future reports or avoiding the topic going forward, and the report explicitly does discuss a missed target (single-use plastics) itself.'
WHERE id = '65b224cc-c2bb-4fbc-ac78-9340aae0bde5';

-- C2: Post-Incident Review: Intranet Outage
UPDATE public.questions SET
  prompt_text = 'What does the fact that the outage was first reported by an employee in Finance, rather than detected by monitoring, suggest?',
  options = to_jsonb(ARRAY[
    'The automated alerting system had a significant blind spot that human process happened to catch',
    'Finance is formally responsible for monitoring server infrastructure',
    'The on-call engineer chose to ignore the alert',
    'IT deliberately disabled monitoring during the update'
  ]::text[]),
  correct_answer = 'The automated alerting system had a significant blind spot that human process happened to catch',
  explanation = 'The report says monitoring alerts "had not been triggered at all" and the fault "was instead first reported by an employee in Finance" — the outage was caught by chance, not by design, revealing a real gap in the alerting system rather than any deliberate action or Finance having a monitoring role.'
WHERE id = 'b538a39d-f06e-44a7-a2b6-5277e94fc069';
