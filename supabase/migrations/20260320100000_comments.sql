-- Threaded comments with likes, mentions, and UI options (matches app comment shape).
create table if not exists public.comments (
  id text primary key,
  entity_id text,
  comment_text text not null,
  comment_date timestamptz not null default now(),
  comment_author text not null,
  comment_author_avatar text,
  parent_comment_id text references public.comments (id) on delete cascade,
  likes integer not null default 0 check (likes >= 0),
  mention_author_ids text[] not null default '{}',
  comment_options jsonb not null default '{"hideReplies": false, "hideLikes": false}'::jsonb,
  constraint comments_comment_options_shape check (
    jsonb_typeof(comment_options) = 'object'
    and comment_options ? 'hideReplies'
    and comment_options ? 'hideLikes'
    and jsonb_typeof(comment_options -> 'hideReplies') = 'boolean'
    and jsonb_typeof(comment_options -> 'hideLikes') = 'boolean'
  )
);

create index if not exists comments_entity_id_idx
  on public.comments (entity_id);

create index if not exists comments_parent_comment_id_idx
  on public.comments (parent_comment_id);

create index if not exists comments_comment_date_idx
  on public.comments (comment_date desc);

alter table public.comments enable row level security;

create policy "comments_service_role" on public.comments
  for all using (true) with check (true);
