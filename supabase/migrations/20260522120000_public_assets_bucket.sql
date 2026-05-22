insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-assets',
  'public-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Allow prototype public asset reads"
on storage.objects for select
to anon
using (bucket_id = 'public-assets');

create policy "Allow prototype public asset uploads"
on storage.objects for insert
to anon
with check (bucket_id = 'public-assets');

create policy "Allow prototype public asset updates"
on storage.objects for update
to anon
using (bucket_id = 'public-assets')
with check (bucket_id = 'public-assets');
