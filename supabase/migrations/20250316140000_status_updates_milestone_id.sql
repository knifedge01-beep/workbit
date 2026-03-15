-- Optional milestone context for status updates (comments)
alter table public.status_updates
  add column if not exists milestone_id text;

comment on column public.status_updates.milestone_id is 'Optional milestone this update is associated with';
