-- Multiple documentation pages per project (replaces single-row project_documentation).

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text null
);

create index if not exists project_documents_project_updated_idx
  on public.project_documents (project_id, updated_at desc);

insert into public.project_documents (project_id, title, content, updated_at, updated_by, created_at)
select
  project_id,
  'Imported',
  content,
  updated_at,
  updated_by,
  updated_at
from public.project_documentation;

alter table public.project_documents enable row level security;
create policy "project_documents_service_role" on public.project_documents
  for all using (true) with check (true);

drop table if exists public.project_documentation;
