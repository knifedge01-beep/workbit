/** Members list; use `invalidateQueries({ queryKey: workspaceMembersQueryKeyRoot })` for all users. */
export const workspaceMembersQueryKeyRoot = ['workspace-members'] as const

export function workspaceMembersQueryKey(userId: string | null) {
  return [...workspaceMembersQueryKeyRoot, userId] as const
}

/** Prefix for `['workspaces', 'list', memberId]`; use with `invalidateQueries`. */
export const workspacesListQueryKeyPrefix = ['workspaces', 'list'] as const

export function workspaceTeamsAndProjectsQueryKey(workspaceId: string) {
  return ['workspace', 'teamsAndProjects', workspaceId] as const
}

/** Full `fetchWorkspaceTeams` result for team pickers (separate from context cache shape). */
export function workspaceTeamsPickerQueryKey(workspaceId: string) {
  return ['workspace', 'teams-picker', workspaceId] as const
}
