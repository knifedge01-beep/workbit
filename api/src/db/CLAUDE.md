# Persistence (DB layer) — gotchas

This folder is the **only** place the API talks to Supabase for data. All access uses the **service role** client from `utils/supabaseServer.js`.

## Rules

- **Entry point:** Use `getClient()` from `client.ts` to get the Supabase client. Don’t create a new client here.
- **Called by models only:** Controllers must not import from `db/`. Flow: routes → controllers → models → db.
- **No business logic here:** DB layer does queries and simple mapping. Validation, orchestration, and error shaping belong in models.
- **Env:** DB operations require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. `getClient()` throws if not configured.
- **Migrations:** Schema changes go in `supabase/migrations/`. Don’t change schema from application code. See `supabase/CLAUDE.md` for migration rules.

When adding a new table or view, add a migration first, then a module in `db/` that models call.
