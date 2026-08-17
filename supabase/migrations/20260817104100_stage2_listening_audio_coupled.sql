-- CLOE pedagogy audit 2026-08-16 — STAGE 2: listening fixes coupled to audio
--
-- ⚠️  DO NOT RUN THIS ON ITS OWN.
--
-- Every statement here changes a SPOKEN script. Listening audio is pre-rendered
-- (src/lib/audio-gen.functions.ts), so applying these without regenerating audio
-- leaves learners hearing text that no longer matches what is written — a worse
-- defect than the ones being fixed.
--
-- RUN ORDER:
--   1. supabase db push --linked      (applies this file; nulls the stale audio_url)
--   2. production /admin/generate  ->  "Generate passage audio (next 30)"  x2
--                                 ->  "Generate audio (next 30)"          x1
--   3. verify no listening row has a null audio_url (query at the bottom)
--
-- Between steps 1 and 2 the affected items have NO audio. Keep the window short.

begin;

-- listening question 6d3a5ad1-f185-4420-a95b-2205d1d20a89
-- Strictest reading still confirms. Key='The elevator'; the three distractors are 'The stairs', 'The fire exit', 'The parking lot' — all three are things a person
update public.questions set prompt_text = 'Attention, everyone. This is a short reminder about fire safety. The fire exit is at the end of the hall on the left. Please do not use the lift during a fire. Walk to the car park and wait there. The safety meeting is every first Monday of the month.', audio_url = null where id = '6d3a5ad1-f185-4420-a95b-2205d1d20a89';

-- passage 0be200bb-09ff-4205-b06c-7564dea7e726  'Asking for a Phone Number'
-- A1. Four-turn two-party exchange read by one TTS voice with no attribution of any kind. The turn boundary is carried solely by the pragmatic shift from 'Can I h
update public.passages set body = 'Receptionist: Hello, reception. Can I help you?
Caller: Yes, I need the phone number for the sales department, please.
Receptionist: Of course. The number is 514-555-0178. Do you also need the email address?
Caller: No, thank you. Just the phone number is fine.', audio_url = null where id = '0be200bb-09ff-4205-b06c-7564dea7e726';

-- passage 3d8965b6-6957-4bb6-9696-1be9ab84b208  'Booking a Table for Lunch'
-- A1. Three-turn customer/staff exchange, single voice, no attribution. The switch lands mid-passage at 'Of course. I have a table near the window.' with no signa
update public.passages set body = 'Customer: Good morning. I would like to book a table for four people, please. It is for a business lunch on Tuesday at noon. We need a quiet table, if possible.
Restaurant staff: Of course. I have a table near the window. Is that okay?
Customer: Yes, that is perfect. Thank you.', audio_url = null where id = '3d8965b6-6957-4bb6-9696-1be9ab84b208';

-- passage 5481e77d-da33-42d2-b8e1-84beadcd5f3e  'Discussing a Bulk Discount'
-- A2. Three-turn buyer/supplier negotiation, single voice, no attribution. This is the worst of the five for comprehension because the two speakers quote competin
update public.passages set body = 'Buyer: I see that the unit price is twelve dollars. If we order five hundred units instead of two hundred, can you offer a better price?
Supplier: Let me check with my manager. For orders over four hundred units, we usually give a ten percent discount. So the price would be ten dollars and eighty cents per unit.
Buyer: That sounds reasonable. Let me discuss it with my team and get back to you by Friday.', audio_url = null where id = '5481e77d-da33-42d2-b8e1-84beadcd5f3e';

-- passage 48ef41a9-db6b-4d71-a712-45e29e97c81d  'Confirming a Hotel Reservation'
-- A2. Three-turn guest/receptionist exchange, single voice, no attribution. The switch at 'Yes, Ms. Patterson, I can see your booking here' is inferable only from
update public.passages set body = 'Guest: Good afternoon. I am calling to confirm a reservation for two nights, from March 12th to March 14th. The booking is under the name Patterson, first name Linda. I also requested a room with a view of the garden. Could you check that, please?
Receptionist: Yes, Ms. Patterson, I can see your booking here. You have a garden-view room on the fourth floor. Breakfast is included and starts at seven a.m.
Guest: Perfect, thank you very much.', audio_url = null where id = '48ef41a9-db6b-4d71-a712-45e29e97c81d';

-- passage 78fec23d-6158-43a5-b1f2-696c1d6d97d6  'Returning Wireless Headphones'
-- A2. Three-turn customer/shop-assistant exchange, single voice, no attribution. Both speakers make requests and both mention what they do or do not want, so with
update public.passages set body = 'Customer: Hello, I bought these wireless headphones last Saturday, but the left ear stopped working after two days. I still have the receipt and the original box. I would like a replacement, please, not a refund.
Shop assistant: Of course. Let me check if we have the same model in stock. Yes, we do. I will swap them for you right now. Would you also like a one-year extended warranty? It costs fifteen dollars.
Customer: No, thank you. The standard warranty is fine.', audio_url = null where id = '78fec23d-6158-43a5-b1f2-696c1d6d97d6';

-- knock-on required by 6d3a5ad1: sibling item's options must match the revised audio
update public.questions set options = '["Next to the lift","In the car park","In the hall","At the fire exit"]'::jsonb
  where id::text like '64368a14%';

commit;

-- verification after audio regeneration (must return 0 rows):
-- select id, skill from public.passages where skill='listening' and audio_url is null;
-- select id from public.questions where skill='listening' and passage_id is null and audio_url is null;
