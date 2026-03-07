# Project standards violations scan

Scanned against `.cursor/skills/project-structure/SKILL.md`, `use-logbit`, `use-design-system`, and `api-layer` / `db-supabase` skills. Standards: controllers → models → db; Logbit for errors; no `console.log` in app paths; design system for UI; file naming and placement.

---

## Critical: API layer (controllers must not import from db/)

**Rule:** Controllers call **models** only; **db/** is called by models only. See `api-layer` and `db-supabase` skills.

| File | Issue |
|------|--------|
| `api/src/controllers/issuesController.ts` | Imports `getMemberById`, `getTeamById`, `getProjectById` from `../db/*.js`. These should be exposed by models and called from the controller. |
| `api/src/controllers/meController.ts` | Imports `getTeamById`, `getProjectById`, `getMemberByUid`, `getTeams` from `../db/*.js`. Same: move DB access behind model APIs. |
| `api/src/controllers/workspaceController.ts` | Imports `getProjects`, `getTeams`, `getMembers`, `getViewsWithoutTeamId`, `getMemberById`, `getTeamById` from `../db/*.js`. Same: use models only. |

**Fix:** Add or extend model functions (e.g. in `models/workspace.ts`, `models/me.ts`, `models/issues.ts`) that call the db layer and return the shapes controllers need. Controllers then import only from `../models/*.js`.

---

## Logbit / logging

**Rule:** Use Logbit and project helpers; avoid `console.log` / `console.error` for production observability. See `use-logbit` skill.

### console.log in app/runtime paths

| File | Line(s) | Issue |
|------|---------|--------|
| `src/pages/IssueDetailScreen.tsx` | 357 | `console.log('Comment:', comment)` — remove or replace with logbit.debug if needed. |
| `src/pages/IssueDetailScreen.tsx` | 557 | `console.log('Priority change - not yet implemented')` — remove or use logbit.debug. |
| `api/src/controllers/workspaceController.ts` | 120 | `console.log` for member id/uid debug — use `logApiWarn`/debug or remove. |
| `api/src/utils/supabaseStore.ts` | 81 | `console.log` for Supabase members row — use logbit or remove (likely debug leftover). |

### Startup logs (acceptable or use logbit.info)

| File | Line(s) | Note |
|------|---------|------|
| `api/src/index.ts` | 51, 55, 57 | Bootstrap messages (Store, Seeded, API listening). Optional: switch to `logbit.info()` for consistency. |

### API errors not logged

| File | Issue |
|------|--------|
| `api/src/controllers/apiKeysController.ts` | On Supabase `error` (createKey, listKeys, deleteKey), returns 500 but does not call `logApiError`. Should log before `res.status(500).json(...)`. |
| `api/src/controllers/authController.ts` | No catch block; validation/401 responses. If you add retries or more branches, use `logApiError` for unexpected failures. |

---

## File location and naming

**Rule:** API client and domain helpers live under `src/api/`; pages are route-level screens. Components use PascalCase for component files; utils/hooks camelCase. See `project-structure` skill.

| File | Issue |
|------|--------|
| `src/pages/apiKeysApi.ts` | API client helpers and types; not a page. Move to `src/api/` (e.g. `apiKeys.ts` or keep name) and update imports (e.g. in `src/hooks/useApiKeys.ts`). |
| `src/components/milestoneMenuItems.tsx` | In `components/`, file naming convention is PascalCase for component files. This exports config (`MILESTONE_MENU_ITEMS`). Either rename to `MilestoneMenuItems.tsx` or move to `utils/` if treated as data-only (file contains JSX for icons, so `.tsx` is required). |

---

## UI / user feedback

**Rule:** Use design system for feedback (toast, Alert, etc.). See `use-design-system` skill.

| File | Line(s) | Issue |
|------|---------|--------|
| `src/pages/TeamIssuesScreen.tsx` | 134 | `alert(\`Failed to create issue: ${err}\`)` — use design system toast or Alert. |
| `src/pages/MyIssuesScreen.tsx` | 83 | Same — replace `alert()` with design system feedback. |

---

## Minor: style consistency

| File | Issue |
|------|--------|
| `api/src/routes/auth.ts` | Trailing semicolon on import (`;`). Rest of API uses no semicolons. |
| `api/src/controllers/authController.ts` | Same; semicolons on imports and statements. Prefer no semicolons to match rest of codebase. |

---

## Summary

| Severity | Count | Areas |
|----------|-------|--------|
| Critical | 3 files | Controllers importing from db/ (layer violation) |
| High | 4 + 2 files | console.log in runtime paths; API errors not logged |
| Medium | 2 files | apiKeysApi in pages/; milestoneMenuItems naming |
| Low | 2 files | alert() instead of design system |
| Minor | 2 files | Semicolon consistency in auth routes/controller |

Recommended order of fixes: (1) Move db access from controllers into models. (2) Replace or remove console.log and add logApiError where needed. (3) Move apiKeysApi to src/api and fix component naming/location. (4) Replace alert() with design system. (5) Normalize semicolons in auth files if desired.
