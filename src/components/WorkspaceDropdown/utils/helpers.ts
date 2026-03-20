import type { ApiWorkspace } from '../../../api/client'

export function getDisplayWorkspace(
  selectedWorkspace: ApiWorkspace | null,
  workspaces: ApiWorkspace[]
): ApiWorkspace | null {
  return selectedWorkspace ?? workspaces[0] ?? null
}

export function getWorkspaceInitials(name?: string): string {
  return (name ?? 'WS').slice(0, 2).toUpperCase()
}
