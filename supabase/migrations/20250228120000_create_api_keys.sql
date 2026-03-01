-- API keys table: stores generated secrets per user for direct Workbit API access
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  secret text not null unique,
  name text,
  last_four text,
  created_at timestamptz not null default now()
);

create index api_keys_user_id_idx on public.api_keys (user_id);

-- RLS: users can only manage their own keys
alter table public.api_keys enable row level security;

create policy "Users can view own api keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own api keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own api keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);
