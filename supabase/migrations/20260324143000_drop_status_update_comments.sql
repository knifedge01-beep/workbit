-- Status update comments are stored in public.comments (entity_id = status_update.id).
-- Remove legacy table now that API no longer reads/writes public.status_update_comments.
drop table if exists public.status_update_comments;
