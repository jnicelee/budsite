alter table membership_requests
add column if not exists password text not null default '';

create table if not exists member_accounts (
  id text primary key,
  name text not null,
  email text not null unique,
  password text not null,
  role text not null default 'member' check (role in ('member', 'eboard')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table member_accounts enable row level security;

drop policy if exists "Allow prototype reads for member accounts" on member_accounts;
create policy "Allow prototype reads for member accounts"
on member_accounts for select
to anon
using (true);

drop policy if exists "Allow prototype writes for member accounts" on member_accounts;
create policy "Allow prototype writes for member accounts"
on member_accounts for all
to anon
using (true)
with check (true);
