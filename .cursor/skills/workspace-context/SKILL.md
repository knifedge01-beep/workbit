---
name: workspace-context
description: Workspace-scoped UI: useWorkspace(), currentWorkspace, route params. Use when building or changing workspace/team screens, nav, or workspace-scoped API calls.
---

# Workspace Context and Routes

Workbit is workspace-centric. Most screens are under a workspace and optionally a team. The current workspace is held in context and in the URL; use it for nav and for API calls that need `workspaceId`.

## Context

- **Provider:** `WorkspaceProvider` in `src/contexts/WorkspaceContext.tsx` wraps the app (e.g. in `main.tsx`).
- **Hook:** `useWorkspace()` returns:
  - `currentWorkspace: ApiWorkspace | null` – selected workspace
  - `workspaces: ApiWorkspace[]` – list for switcher
  - `workspaceId: string | undefined` – from route params when inside a workspace route
  - `teams` – teams for current workspace (for nav and dropdowns)
  - `setCurrentWorkspace`, `refreshWorkspaces`, `refreshTeamsAndProjects`, etc.
- **Persistence:** Current workspace id is stored (e.g. `workbit.currentWorkspaceId`) so it survives refresh.

## Routes

- **Pattern:** `/workspace/:workspaceId` for workspace-level; `/workspace/:workspaceId/team/:teamId` for team-level.
- **Params:** Use `useParams<{ workspaceId: string; teamId?: string }>()` to get `workspaceId` and `teamId` for links and API calls.
- **Consistency:** Same `workspaceId` from params should match `currentWorkspace?.id` when the user is in that workspace; use context for dropdowns and nav, params for deep links and REST calls.

## Typical patterns

- **Workspace screen:** `const { workspaceId } = useParams(); const { currentWorkspace, teams } = useWorkspace();` – use `workspaceId` in navigation and `currentWorkspace` for display name / loading state.
- **Team-scoped screen:** `const { workspaceId, teamId } = useParams();` – use both in API calls and links (e.g. `navigate(\`/workspace/${workspaceId}/team/${teamId}/issues/active\`)`).
- **Create flows:** Ensure `workspaceId` and optionally `teamId` are in the URL; after create, navigate to the appropriate list or detail (e.g. `/workspace/${workspaceId}/team/${teamId}/issues/active` or `/workspace/${workspaceId}/workspace/teams`).
- **Sidebar/nav:** Pass `workspaceId` and `teams` from context into `SidebarNav`, `TeamDropdown`, etc., so links use the current workspace and team.

## Guards

- If a screen requires a workspace, check `workspaceId` and `currentWorkspace`; show loading or redirect when missing. Example: `if (!workspaceId || !currentWorkspace) return <LoadingState />` or redirect to workspaces list.

## References

- **Context implementation:** `src/contexts/WorkspaceContext.tsx`.
- **API client (workspaceId):** `src/api/client.ts`, `.cursor/skills/frontend-api/SKILL.md`.
- **Route definitions:** `src/route/index.tsx`, `src/pages/TeamRouteWrappers.tsx`.
