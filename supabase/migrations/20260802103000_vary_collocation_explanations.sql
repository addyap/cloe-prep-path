-- Explanation-style consistency pass. The 2026-08-01 audit flagged a
-- verbatim-reused template phrase across explanation text; a 6-word
-- shingle analysis over all reconstruction/word_bank explanations found
-- "is the fixed collocation meaning to" repeated identically across 14
-- rows (spanning mcq, gap_fill, and word_bank — every collocation-teaching
-- item that used this boilerplate, not just one format). Rewords each to
-- vary the phrasing while preserving the same correctness content;
-- correct_answer/options/prompt_text are untouched.

UPDATE public.questions SET explanation = 'English pairs "decision" with "make", not "do" or "take" — "make a decision" is the natural collocation for deciding on something.' WHERE id = '2f079dd9-3940-4ea4-ab47-05ecd73ebd4a';

UPDATE public.questions SET explanation = '"Reach an agreement" is how English describes arriving at a mutual decision after negotiation — not "make" or "do" an agreement.' WHERE id = '3bfc10ef-91ff-43dc-92bb-4acc6a1ee5a7';

UPDATE public.questions SET explanation = 'To "find common ground" means to identify shared interests between parties — a set phrase, not "make" or "get" common ground.' WHERE id = '7e40f021-d433-47e5-b13a-458e7b7c566f';

UPDATE public.questions SET explanation = '"Raise a concern" is the natural way to say you mention a worry or issue — not "make" or "tell" a concern.' WHERE id = '0ee9a469-f551-4ef1-8460-05b9772204d3';

UPDATE public.questions SET explanation = '"Strike a balance" means to find a satisfactory middle point between two things — an idiomatic pairing, not "make" or "find" a balance.' WHERE id = '1286cb32-56ac-4773-9ba3-9197f026087b';

UPDATE public.questions SET explanation = '"Seize an opportunity" means to take quick advantage of a chance — the standard verb pairing, not "take" or "catch" an opportunity.' WHERE id = '607882d8-50bd-4c47-a04f-a1d8240a1ebd';

UPDATE public.questions SET explanation = '"Uphold a standard" means to maintain or support an established level of quality — not "keep" or "hold" a standard.' WHERE id = '96193646-5c24-4fc9-a1f0-04872541d3c9';

UPDATE public.questions SET explanation = '"Streamline a process" means to make a procedure simpler and more efficient — the natural verb choice here, not "clean" or "fix" a process.' WHERE id = '7ca09597-9580-406d-997b-11d09519186c';

UPDATE public.questions SET explanation = '"Extend a deadline" means to push it back by a specific amount of time — the standard verb pairing, not "expand" or "delay" a deadline.' WHERE id = 'cbf584da-4be7-49a9-ab71-19e115fcf9e1';

UPDATE public.questions SET explanation = '"Raise concerns" means to formally voice worries — matching the analysts'' role in flagging currency risk here.' WHERE id = 'a22e9277-da83-464d-a085-880db62015e7';

UPDATE public.questions SET explanation = '"Reach a consensus" means to arrive at general agreement after discussion among the directors — the natural verb pairing, not "make" or "find" a consensus.' WHERE id = 'edba44b8-ce8d-4fef-b4cc-63e2b524b529';

UPDATE public.questions SET explanation = 'The set phrase is "raise concerns" — to formally voice worries; no other noun in the pool pairs naturally with "raise" in this idiomatic sense.' WHERE id = '74f71158-c2cf-4330-aa69-42d2cd999d10';

UPDATE public.questions SET explanation = 'The idiom here is "join forces", meaning to combine efforts; "combine forces" is a common but less idiomatic near-miss in this exact phrase.' WHERE id = '96b6f351-814c-4cf3-bd8d-819688660af0';

UPDATE public.questions SET explanation = '"Hinge on" means to depend entirely on a single deciding factor — the required preposition after "hinge".' WHERE id = 'e11d88ab-3a9a-478e-909a-95271061f1d2';
