-- Issue comments (Activity on issue detail). Separate from status_updates (project screen only).
create table if not exists public.issue_comments (
  id text primary key,
  issue_id text not null references public.issues(id) on delete cascade,
  author_name text not null,
  author_avatar_src text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists issue_comments_issue_id_idx on public.issue_comments(issue_id);

alter table public.issue_comments enable row level security;
create policy "issue_comments_service_role" on public.issue_comments for all using (true) with check (true);
