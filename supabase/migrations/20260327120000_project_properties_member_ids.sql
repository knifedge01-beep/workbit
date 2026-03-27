alter table public.project_properties
add column if not exists member_ids jsonb not null default '[]'::jsonb;
