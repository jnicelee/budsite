create table if not exists site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "Allow prototype reads for site content"
on site_content for select
to anon
using (true);

create policy "Allow prototype writes for site content"
on site_content for all
to anon
using (true)
with check (true);
