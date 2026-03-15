-- Add project_id and issue_id to status_updates for scoping updates by project or issue
alter table public.status_updates
  add column if not exists project_id text,
  add column if not exists issue_id text;

comment on column public.status_updates.project_id is 'Optional project this update belongs to';
comment on column public.status_updates.issue_id is 'Optional issue this update belongs to';

-- Backfill project_id from team for existing rows so they still show on project page
update public.status_updates su
set project_id = t.project_id
from public.teams t
where su.team_id = t.id
  and t.project_id is not null
  and t.project_id != ''
  and su.project_id is null;
