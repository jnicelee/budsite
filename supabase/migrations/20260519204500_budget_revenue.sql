create table if not exists eboard_budget_revenue (
  id text primary key,
  category text not null,
  amount numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table eboard_budget_revenue enable row level security;

drop policy if exists "Allow prototype reads for budget revenue" on eboard_budget_revenue;
create policy "Allow prototype reads for budget revenue"
on eboard_budget_revenue for select
to anon
using (true);

drop policy if exists "Allow prototype writes for budget revenue" on eboard_budget_revenue;
create policy "Allow prototype writes for budget revenue"
on eboard_budget_revenue for all
to anon
using (true)
with check (true);
