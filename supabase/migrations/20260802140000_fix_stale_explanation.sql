-- Correctness pass finding: the A1 difficulty fix (20260802110000) updated
-- this reconstruction item's options/correct_answer but left its old
-- explanation in place, which still described the previous sentence
-- ("Could you please confirm receipt of this email?") -- talking about a
-- modal phrase and "of this email" being locked to "receipt" that no
-- longer exist in the new content. Fixes the explanation to match what's
-- actually there now.

UPDATE public.questions SET
  explanation = 'This is a polite imperative: "Please" opens the request, followed by the verb "close", its object "the door", and the time clause "when you leave" at the end.'
WHERE id = '477f0050-612f-47dc-bd58-c312096d3b64';
