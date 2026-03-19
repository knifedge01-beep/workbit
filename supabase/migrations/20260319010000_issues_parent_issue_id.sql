-- Add optional self-reference for sub-issues.
alter table public.issues
  add column if not exists parent_issue_id text;

create index if not exists issues_parent_issue_id_idx
  on public.issues(parent_issue_id);
