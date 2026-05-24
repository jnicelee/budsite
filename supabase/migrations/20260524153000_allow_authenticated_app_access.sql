create policy "Allow authenticated reads for agenda"
on eboard_agenda for select
to authenticated
using (true);

create policy "Allow authenticated writes for agenda"
on eboard_agenda for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for budget settings"
on eboard_budget_settings for select
to authenticated
using (true);

create policy "Allow authenticated writes for budget settings"
on eboard_budget_settings for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for budget rows"
on eboard_budget_rows for select
to authenticated
using (true);

create policy "Allow authenticated writes for budget rows"
on eboard_budget_rows for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for budget revenue"
on eboard_budget_revenue for select
to authenticated
using (true);

create policy "Allow authenticated writes for budget revenue"
on eboard_budget_revenue for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for notes"
on eboard_notes for select
to authenticated
using (true);

create policy "Allow authenticated writes for notes"
on eboard_notes for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for private links"
on private_links for select
to authenticated
using (true);

create policy "Allow authenticated writes for private links"
on private_links for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for membership requests"
on membership_requests for select
to authenticated
using (true);

create policy "Allow authenticated writes for membership requests"
on membership_requests for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for member accounts"
on member_accounts for select
to authenticated
using (true);

create policy "Allow authenticated writes for member accounts"
on member_accounts for all
to authenticated
using (true)
with check (true);

create policy "Allow authenticated reads for site content"
on site_content for select
to authenticated
using (true);

create policy "Allow authenticated writes for site content"
on site_content for all
to authenticated
using (true)
with check (true);
