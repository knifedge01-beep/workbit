-- Allow status_updates without a team (e.g. issue-only comments when issue has no team)
alter table public.status_updates
  alter column team_id drop not null;
