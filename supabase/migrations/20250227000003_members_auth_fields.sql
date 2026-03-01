-- Add auth-related fields to members table.
-- Run in Supabase SQL Editor or via `supabase db push`.

alter table public.members
  add column if not exists provisioned boolean not null default false,
  add column if not exists supabase_user_id text;

