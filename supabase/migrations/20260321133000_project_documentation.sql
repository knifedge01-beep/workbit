-- Store editable documentation content per project.
create table if not exists public.project_documentation (
  project_id text primary key references public.projects(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text null
);

create index if not exists project_documentation_updated_at_idx
  on public.project_documentation (updated_at desc);
