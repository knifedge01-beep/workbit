# Docs

Documentation for the Workbit project.

## Project structure

The repo follows a clear structure: root **CLAUDE.md** (purpose, repo map, rules), **.cursor/skills/** (project structure, design system, Logbit, api/auth/db/frontend/workspace skills, code-review, refactor, release), **.cursor/docs/** (design system, API spec, Logbit SDK), **docs/** (architecture, ADRs, runbooks), and local **CLAUDE.md** in risky areas (`src/pages/auth/`, `api/src/db/`, `supabase/`). Use root `CLAUDE.md` as the north star; keep it short.

## Data & API

- **REST:** All API access (reads and writes) uses REST as per [API_AND_SERVICES_SPEC.md](./API_AND_SERVICES_SPEC.md). Frontend uses `src/api/client.ts` and `useFetch`.
- **Env:** Set `VITE_API_URL` (see `.env.example`) for the API base URL.

## Logging (Logbit SDK)

- **[LOGBIT_SDK.md](./LOGBIT_SDK.md)** – Setup, init, and usage for `@thedatablitz/logbit-sdk` (logging, spans, metrics, Workbit). Initialized in `src/main.tsx` and `api/src/index.ts`.

## Design System

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** – Reference for `src/design-system` components (imports, props, usage).

### Using in Cursor

To give the AI consistent design-system guidance:

1. **Reference in chat:** Use `@docs/DESIGN_SYSTEM.md` when asking for UI or component work.
2. **Cursor rules:** Add a rule that says to prefer components and APIs from `docs/DESIGN_SYSTEM.md` when building or editing UI.
3. **.cursorrules / AGENTS.md:** Mention that design system usage is documented in `docs/DESIGN_SYSTEM.md`.

This keeps imports, prop names, and patterns aligned with the design system.
