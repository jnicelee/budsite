alter table membership_requests
drop column if exists password;

alter table member_accounts
drop column if exists password;
