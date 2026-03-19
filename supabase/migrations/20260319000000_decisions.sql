-- Project decisions for roadmap and scope-change history.
create table if not exists public.decisions (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  title text not null,
  type text not null check (type in ('major', 'minor')),
  rationale text not null,
  impact text,
  tags text[] not null default '{}',
  created_by_id text not null,
  created_by_name text not null,
  decision_date date,
  status text not null check (status in ('proposed', 'approved', 'rejected', 'superseded')),
  linked_milestone_ids text[] not null default '{}',
  linked_issue_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decisions_project_id_idx on public.decisions(project_id);
create index if not exists decisions_decision_date_idx on public.decisions(decision_date);
create index if not exists decisions_status_idx on public.decisions(status);
create index if not exists decisions_type_idx on public.decisions(type);

alter table public.decisions enable row level security;
create policy "decisions_service_role" on public.decisions for all using (true) with check (true);
