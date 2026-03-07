# Release procedure

Use when cutting a release or preparing a deploy. Ensures nothing is missed before ship.

## Pre-release

1. **Status**  
   All intended changes merged; no known regressions in main flow (auth, workspace, issues).

2. **Build & lint**  
   From repo root: `npm run build`, `npm run lint`. From `api/`: build and lint there too. Fix any failures. (No test suite in this project; rely on build, lint, and manual verification.)

3. **Format**  
   `npm run format` (and API if applicable). Commit any formatting-only changes or note that format is clean.

4. **Env & config**  
   Confirm `.env.example` (or equivalent) documents required vars for frontend and API. No secrets in repo.

5. **Migrations**  
   If `supabase/migrations/` or DB schema changed: run migrations in a staging/test environment and verify. See `supabase/CLAUDE.md` if present.

6. **Docs**  
   Update `README.md` or `docs/` if release adds features or changes setup. Optionally add an ADR in `docs/decisions/` for major changes.

## Release

7. **Version**  
   Bump version in `package.json` (and `api/package.json` if versioned separately). Tag in git (e.g. `v1.2.0`).

8. **Deploy**  
   Follow runbooks in `docs/runbooks/` for your environment. Confirm health after deploy.

9. **Post-release**  
   Note the tag and any rollback steps in runbooks or team channel.
