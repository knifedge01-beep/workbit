-- Add project description used by API/MCP project creation and listing.

alter table if exists public.projects
  add column if not exists description text not null default '';

-- Ensure PostgREST picks up the new column quickly in long-lived sessions.
notify pgrst, 'reload schema';
