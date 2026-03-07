# Workbit — Repo memory

**Purpose (why)**  
Workbit is a workspace/productivity app: workspaces, teams, projects, issues. Frontend is React + Vite; backend is Express (REST). Data lives in Supabase. Use Logbit for logging/errors; use the design system for all UI.

**Repo map (where)**

| Area | Path | What |
|------|------|------|
| App entry | `src/main.tsx` | Logbit init, React root, router |
| Frontend | `src/` | `pages/`, `components/`, `hooks/`, `contexts/`, `utils/`, `api/client.ts`, `design-system/` |
| Auth (client) | `src/pages/auth/` | Login/signup UI, Supabase client — see local CLAUDE.md |
| API server | `api/src/` | Express app, `index.ts` entry; `controllers/`, `models/`, `db/`, `routes/`, `middleware/` |
| Persistence | `api/src/db/` | Supabase data access — see local CLAUDE.md |
| Docs | `.cursor/docs/` | DESIGN_SYSTEM.md, LOGBIT_SDK.md, API_AND_SERVICES_SPEC.md |
| Progressive context | `docs/` | architecture.md, decisions/, runbooks/ |
| Skills | `.cursor/skills/` | project-structure, use-design-system, use-logbit, api-layer, auth, db-supabase, frontend-api, workspace-context, code-review, refactor, release |

**Rules**

- Follow layout and naming in `.cursor/skills/project-structure/SKILL.md`. Use design system (`.cursor/skills/use-design-system/SKILL.md`) and Logbit (`.cursor/skills/use-logbit/SKILL.md`) for UI and errors.
- Controllers call models; models call `db/`. Never put business logic in routes or db layer.
- REST for writes; use `src/api/client.ts`. Imports: relative in app; in API use `.js` extension (Node ESM).
- Before changing auth, billing, or migrations, read the local CLAUDE.md in that directory.

**Commands**

- `npm run dev` — start frontend
- `npm run build` — typecheck + build
- `npm run format` — format `src/` with Prettier
- `npm run lint` — ESLint
- From `api/`: `npm run dev` (or equivalent) — start API server

Keep this file short. Put depth in `docs/` and in local CLAUDE.md files.
