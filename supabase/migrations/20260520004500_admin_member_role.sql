alter table member_accounts
drop constraint if exists member_accounts_role_check;

alter table member_accounts
add constraint member_accounts_role_check
check (role in ('member', 'eboard', 'admin'));
