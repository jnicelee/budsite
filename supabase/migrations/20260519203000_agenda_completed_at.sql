alter table eboard_agenda
add column if not exists completed_at timestamptz;
