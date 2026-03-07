---
name: db-supabase
description: Supabase data access in api/src/db. Use when adding or changing DB modules, queries, or talking to Supabase from the API.
---

# DB Layer (Supabase)

`api/src/db/` is the **only** place the API talks to Supabase for data. All access uses the **service role** client from `api/src/utils/supabaseServer.js`. Before changing schema or migrations, read `api/src/db/CLAUDE.md` and `supabase/CLAUDE.md` if present.

## Rules

1. **Entry point:** Use `getClient()` from `db/client.ts` to get the Supabase client. Do not create a new client in `db/` or in controllers.
2. **Called by models only:** Controllers must not import from `db/`. Flow: routes → controllers → models → db.
3. **No business logic in db:** DB layer does queries and simple row ↔ model mapping. Validation, orchestration, and error shaping belong in models.
4. **Env:** DB operations require `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. `getClient()` throws if not configured.
5. **Migrations:** Schema changes go in `supabase/migrations/`. Do not change schema from application code.

## Adding a new table or view

1. Add a migration in `supabase/migrations/`.
2. Add a module in `db/` (e.g. `db/widgets.ts`) that uses `getClient()` and exposes functions models need.
3. Models import from `../db/widgets.js` and call those functions; controllers never import from `db/`.

## Naming and style

- **Files:** camelCase (e.g. `issues.ts`, `workspaces.ts`, `statusUpdates.ts`).
- **Exports:** Functions that perform one logical operation (e.g. `getWorkspaceById`, `insertIssue`). Return typed domain objects or IDs; let models handle composition.

## References

- **Local gotchas:** `api/src/db/CLAUDE.md`.
- **API layer:** `.cursor/skills/api-layer/SKILL.md`.
- **Supabase server client:** `api/src/utils/supabaseServer.ts`, `api/src/db/client.ts`.
