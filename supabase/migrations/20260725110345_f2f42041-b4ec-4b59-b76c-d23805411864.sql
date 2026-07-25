-- Public storage bucket for generated listening-audio clips (real TTS,
-- replacing the browser speechSynthesis fallback). Uploads only ever happen
-- server-side via the service role (bypasses RLS), so no storage.objects
-- policies are needed beyond the bucket being public for reads.
insert into storage.buckets (id, name, public)
values ('listening-audio', 'listening-audio', true)
on conflict (id) do nothing;
