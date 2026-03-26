export function isProfileRoute(pathname: string, workspaceId: string): boolean {
  return pathname.startsWith(`/workspace/${workspaceId}/profile`)
}

export function isCreateTeamPage(pathname: string): boolean {
  return pathname.includes('/workspace/teams/new')
}

export function shouldShowNoTeamBlocker(params: {
  workspaceId?: string
  workspacesLoading: boolean
  teamsLoading: boolean
  teamsCount: number
  pathname: string
}): boolean {
  const { workspaceId, workspacesLoading, teamsLoading, teamsCount, pathname } =
    params

  return (
    Boolean(workspaceId) &&
    !workspacesLoading &&
    !teamsLoading &&
    teamsCount === 0 &&
    !isCreateTeamPage(pathname)
  )
}
