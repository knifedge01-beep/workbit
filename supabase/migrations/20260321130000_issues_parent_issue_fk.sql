-- Add self-referencing FK for parent-child issues.
alter table public.issues
  drop constraint if exists issues_parent_issue_id_fkey;

alter table public.issues
  add constraint issues_parent_issue_id_fkey
  foreign key (parent_issue_id)
  references public.issues(id)
  on delete set null;
