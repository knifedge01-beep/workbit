# Supabase migrations — gotchas

Migrations in `migrations/` define and change the database schema. They are **irreversible** in production once applied.

## Rules

- **Order:** Files run in filename order. Use dated prefixes (e.g. `YYYYMMDD_description.sql`) and never change the contents of an already-applied migration.
- **New changes:** Add a new migration file; don’t edit old ones. Test against a local or staging Supabase instance first.
- **Destructive changes:** Dropping columns or tables, or changing types, can break the running API. Plan for backward compatibility (e.g. deploy code that ignores a column before dropping it) and document in `docs/decisions/` or runbooks.
- **Application code:** Schema is only changed via migrations. The API reads/writes via `api/src/db/` using the current schema.

Before editing or adding migrations, confirm no other branch has added migrations with the same or conflicting names. Run migrations locally and smoke-test the API before merging.
