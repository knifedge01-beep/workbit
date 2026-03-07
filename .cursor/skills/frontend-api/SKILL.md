---
name: frontend-api
description: How the frontend calls the API: src/api/client.ts, authFetch, types. Use when adding or changing API calls, REST helpers, or response types from the app.
---

# Frontend API Client

All REST calls from the app go through `src/api/client.ts`. The client uses the session token when available and logs failures to Logbit. Do not call Supabase directly for app data (workspaces, issues, teams, etc.); use the API.

## Usage

- **Authenticated fetch:** `authFetch(path, options)` – GET by default; for POST/PATCH/DELETE pass `method` and `body`. Automatically adds `Authorization: Bearer <token>` via `getAccessToken()`. Base URL is `VITE_API_URL` + `/api/v1` or `/api/v1` when relative.
- **Helpers:** The client exports domain-specific helpers (e.g. `fetchWorkspaces`, `fetchWorkspaceTeams`, `createIssue`) that use `authFetch` and return typed data. Use these instead of raw `authFetch` when available.
- **Types:** Use the types exported from `src/api/client.ts` (e.g. `ApiWorkspace`, `ApiMember`, `ApiIssueDetail`, `ProjectStatus`) in components and pages.

## Errors

- Failed responses are logged via Logbit and throw with a message. Use `handleAsync` or try/catch and `logError` from `src/utils/errorHandling.ts`; show user-facing messages via the design system (e.g. toast or Alert). See the `use-logbit` skill.

## Workspace-scoped calls

Many endpoints require a `workspaceId` (from route params or `useWorkspace()`). Pass it into the client helpers that accept it (e.g. `fetchWorkspaceTeams(workspaceId)`). Do not store or send workspace id in a global or ad-hoc way; use the workspace context and route params. See the `workspace-context` skill.

## Adding a new endpoint call

1. If it’s a one-off, use `authFetch('/resource', { method: 'POST', body: JSON.stringify(payload) })` and type the result.
2. If it’s reusable, add a named function in `client.ts` (e.g. `export async function createWidget(workspaceId: string, data: CreateWidgetInput): Promise<ApiWidget>`) that calls `authFetch` and returns the typed response.
3. Export any new types from `client.ts` for use in components.

## References

- **API contract:** `.cursor/docs/API_AND_SERVICES_SPEC.md`.
- **Auth token:** `src/pages/auth/supabaseClient.ts` (`getAccessToken`).
- **Errors:** `.cursor/skills/use-logbit/SKILL.md`, `src/utils/errorHandling.ts`.
- **Workspace:** `.cursor/skills/workspace-context/SKILL.md`.
