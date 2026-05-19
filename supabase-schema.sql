create table if not exists eboard_agenda (
  id text primary key,
  text text not null,
  owner text not null default 'Unassigned',
  due text not null default 'Add date',
  created_at timestamptz not null default now()
);

create table if not exists eboard_budget_settings (
  id text primary key default 'default',
  total numeric not null default 5750,
  updated_at timestamptz not null default now(),
  constraint single_budget_settings check (id = 'default')
);

create table if not exists eboard_budget_rows (
  id text primary key,
  category text not null,
  allocated numeric not null default 0,
  spent numeric not null default 0,
  status text not null default 'On Hold' check (status in ('On Hold', 'Approved', 'Denied')),
  created_at timestamptz not null default now()
);

create table if not exists eboard_notes (
  id text primary key,
  date date not null,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists private_links (
  id text primary key,
  label text not null,
  description text not null default '',
  url text not null default '#',
  created_at timestamptz not null default now()
);

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

insert into eboard_budget_settings (id, total)
values ('default', 5750)
on conflict (id) do nothing;

alter table eboard_agenda enable row level security;
alter table eboard_budget_settings enable row level security;
alter table eboard_budget_rows enable row level security;
alter table eboard_notes enable row level security;
alter table private_links enable row level security;
alter table membership_requests enable row level security;

create policy "Allow prototype reads for BUDS app"
on eboard_agenda for select
to anon
using (true);

create policy "Allow prototype writes for BUDS app"
on eboard_agenda for all
to anon
using (true)
with check (true);

create policy "Allow prototype reads for budget settings"
on eboard_budget_settings for select
to anon
using (true);

create policy "Allow prototype writes for budget settings"
on eboard_budget_settings for all
to anon
using (true)
with check (true);

create policy "Allow prototype reads for budget rows"
on eboard_budget_rows for select
to anon
using (true);

create policy "Allow prototype writes for budget rows"
on eboard_budget_rows for all
to anon
using (true)
with check (true);

create policy "Allow prototype reads for notes"
on eboard_notes for select
to anon
using (true);

create policy "Allow prototype writes for notes"
on eboard_notes for all
to anon
using (true)
with check (true);

create policy "Allow prototype reads for private links"
on private_links for select
to anon
using (true);

create policy "Allow prototype writes for private links"
on private_links for all
to anon
using (true)
with check (true);

create policy "Allow prototype reads for membership requests"
on membership_requests for select
to anon
using (true);

create policy "Allow prototype writes for membership requests"
on membership_requests for all
to anon
using (true)
with check (true);
