-- Add workspace_id to teams so teams are scoped per workspace.
alter table public.teams add column if not exists workspace_id text;

-- Backfill existing rows with default workspace (matches seed id).
update public.teams set workspace_id = 'ws-1' where workspace_id is null;

-- Enforce non-null for new and backfilled data.
alter table public.teams alter column workspace_id set not null;

-- Index for filtering by workspace_id.
create index if not exists idx_teams_workspace_id on public.teams (workspace_id);
