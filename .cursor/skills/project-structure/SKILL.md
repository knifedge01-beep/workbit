---
name: project-structure
description: Follows this repo's project structure, file naming, and code practices. Use when adding files, refactoring, creating components or API code, or when the user asks about project layout, naming conventions, or code style.
---

# Project Structure and Code Practices

When adding or moving code, follow the existing layout and naming so the codebase stays consistent.

## 1. Project layout

- **Frontend:** All app UI and client logic live under `src/`. The API server is a separate package under `api/`.
- **API:** Express server under `api/src/`. Uses Node ESM (`.js` in imports). Entry: `api/src/index.ts`.
- **Design system:** Shared UI in `src/design-system/`. Use the `use-design-system` skill when building UI.
- **Docs:** `.cursor/docs/` – DESIGN_SYSTEM.md, LOGBIT_SDK.md, API_AND_SERVICES_SPEC.md, README.md.

**Frontend (`src/`) at a glance:**

| Directory           | Purpose |
|---------------------|---------|
| `main.tsx`          | Entry; Logbit init, React root, ThemeProvider, Router. |
| `App.tsx`           | Root component (e.g. wraps routes). |
| `route/index.tsx`   | Route definitions; imports screens from `../pages`. |
| `pages/`            | Route-level screens and layout; barrel in `pages/index.ts`. |
| `pages/auth/`       | Auth UI and context; barrel in `pages/auth/index.ts`. |
| `components/`       | Shared components; barrel in `components/index.ts`. |
| `components/common/`| Reusable UI (LoadingState, ErrorState, EmptyState); barrel. |
| `hooks/`            | Custom React hooks (e.g. useFetch, useApiKeys). |
| `contexts/`        | React context providers (e.g. WorkspaceContext). |
| `utils/`            | Pure helpers (errorHandling, format, validation, api); barrel in `utils/index.ts`. |
| `api/client.ts`     | REST/API client used by the frontend. |
| `constants.ts`      | App-wide constants and types. |
| `relay/`            | Relay env, fetchGraphQL, queries (GraphQL reads). |
| `landing/`          | Landing page and its components; barrel in `landing/index.ts`. |
| `design-system/`    | Design system (layout, typography, ui, theme). |

**API (`api/src/`) at a glance:**

| Directory     | Purpose |
|---------------|---------|
| `index.ts`    | Express app, Logbit init, middleware, route mounting, server start. |
| `loadEnv.ts`  | Env loading; imported first. |
| `controllers/`| Request handlers; one file per domain (e.g. issuesController, workspaceController). |
| `models/`     | Domain logic; call `db/` and expose functions to controllers. |
| `db/`         | Data access (Supabase/client); `db/client.ts`, then e.g. `db/issues.ts`. |
| `routes/`     | Express routers; mount in index (e.g. issuesRoutes, workspaceRoutes). |
| `middleware/` | Auth and shared middleware. |
| `utils/`      | log.ts (logApiError, logApiWarn), supabaseServer, fileStore, etc. |
| `graphql/`    | GraphQL schema (reads). |
| `scripts/`    | Standalone scripts (e.g. seed.ts). |

---

## 2. File naming

### Frontend

| Kind | Convention | Examples |
|------|------------|----------|
| **Route screens** | PascalCase, suffix `Screen` | `CreateIssueScreen.tsx`, `MyIssuesScreen.tsx`, `InboxScreen.tsx` |
| **Other pages** | PascalCase, suffix `Page` or descriptive | `LandingPage.tsx`, `ProfilePage.tsx`, `MainLayout.tsx` |
| **Components** | PascalCase | `NavbarLeft.tsx`, `StatusSelector.tsx`, `WorkspaceDropdown.tsx` |
| **Hooks** | camelCase, `use` prefix | `useFetch.ts`, `useApiKeys.ts` |
| **Utils / non-UI** | camelCase | `errorHandling.ts`, `format.ts`, `validation.ts`, `api.ts` |
| **Contexts** | PascalCase, suffix `Context` | `WorkspaceContext.tsx` |
| **Constants** | camelCase or descriptive | `constants.ts`, `projectStatus.ts` |
| **API client** | camelCase | `api/client.ts` |
| **Design-system** | One folder per component: `ComponentName/ComponentName.tsx` + `index.ts` | `Button/Button.tsx`, `Card/Card.tsx` |

Use **PascalCase** for files that export a React component as the main export; **camelCase** for utilities, hooks, and non-component modules.

### API

| Kind | Convention | Examples |
|------|------------|----------|
| **Controllers** | camelCase + `Controller` | `issuesController.ts`, `workspaceController.ts` |
| **Models** | camelCase (domain name) | `issues.ts`, `me.ts`, `workspace.ts`, `store.ts` |
| **DB** | camelCase | `client.ts`, `issues.ts`, `workspaces.ts` |
| **Routes** | camelCase | `issues.ts`, `workspace.ts`, `teams.ts`, `me.ts`, `auth.ts` |
| **Utils / middleware** | camelCase | `log.ts`, `supabaseServer.ts`, `auth.ts` |

---

## 3. Imports and barrels

- **Design system:** Use path alias `@design-system` (or `@/design-system` if configured). Import from the barrel: `import { Button, Card, Stack } from '@design-system'`.
- **Frontend elsewhere:** Prefer **relative** imports: `../pages`, `../components`, `../utils/format`, `../hooks/useFetch`, `../contexts/WorkspaceContext`, `../api/client`. Use barrel files where they exist (`pages/index.ts`, `components/index.ts`, `utils/index.ts`) so routes and other modules import from `../pages` or `../components` instead of individual files when the barrel exports what you need.
- **API:** Use **relative** imports with **`.js` extension** (Node ESM): `import * as ctrl from '../controllers/issuesController.js'`, `import * as db from '../db/issues.js'`, `import { logApiError } from '../utils/log.js'`.
- **Barrel files:** `index.ts` (or `index.tsx`) re-exports the public API of the folder. Add new exports to the barrel when you add new public modules (e.g. new page in `pages/index.ts`, new component in `components/index.ts`).

---

## 4. Code practices

- **TypeScript:** Strict mode. Use types for function params and returns where it helps; export types used by other modules (e.g. `type StatusOption`, `type MemberRow`).
- **Exports:** Prefer **named exports** (e.g. `export function MyIssuesScreen()`). Component name should match the main export (e.g. `MyIssuesScreen` in `MyIssuesScreen.tsx`).
- **Data and API:** GraphQL for reads (Relay in `src/relay/`). REST for writes (POST/PATCH/DELETE). See `.cursor/docs/API_AND_SERVICES_SPEC.md` and `.cursor/docs/README.md`.
- **Errors:** Use Logbit and project helpers. See the `use-logbit` skill: frontend `logError`, `handleAsync`, `retryWithBackoff` from `src/utils/errorHandling.ts`; API `logApiError`, `logApiWarn` from `api/src/utils/log.ts`.
- **UI:** Use the design system and `ThemeProvider`. See the `use-design-system` skill and `.cursor/docs/DESIGN_SYSTEM.md`.
- **API layer:** Controllers receive `(req, res)`, call **models** for domain logic, and **db** only via models. Models import from `../db/*.js` and `./types.js`; controllers import from `../models/*.js` and `../utils/log.js`. Keep route definitions thin (mount routers; handlers live in controllers).

---

## 5. Adding new code (checklist)

- **New route screen:** Add `PascalNameScreen.tsx` in `pages/`, export from `pages/index.ts`, add route in `route/index.tsx`.
- **New shared component:** Add `ComponentName.tsx` in `components/` (or `components/common/`), export from `components/index.ts` (or `components/common/index.ts`).
- **New hook:** Add `useName.ts` in `hooks/`.
- **New util:** Add `name.ts` in `utils/`, export from `utils/index.ts` if public.
- **New API domain:** Add `domainController.ts`, `domain.ts` (model), `db/domain.ts` (and types in `models/types.ts` if needed), `routes/domain.ts`; mount route in `api/src/index.ts`; use `logApiError`/`logApiWarn` in controller.

---

## 6. References

- **Design system:** `.cursor/docs/DESIGN_SYSTEM.md` and skill `use-design-system`.
- **Logging/errors:** `.cursor/docs/LOGBIT_SDK.md` and skill `use-logbit`.
- **API and data:** `.cursor/docs/API_AND_SERVICES_SPEC.md`, `.cursor/docs/README.md`.
