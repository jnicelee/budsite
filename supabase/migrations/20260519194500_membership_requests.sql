create table if not exists membership_requests (
  id text primary key,
  name text not null,
  email text not null,
  message text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Denied')),
  reason text not null default '',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table membership_requests enable row level security;

drop policy if exists "Allow prototype reads for membership requests" on membership_requests;
create policy "Allow prototype reads for membership requests"
on membership_requests for select
to anon
using (true);

drop policy if exists "Allow prototype writes for membership requests" on membership_requests;
create policy "Allow prototype writes for membership requests"
on membership_requests for all
to anon
using (true)
with check (true);
