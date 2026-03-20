export function getReturnPath(
  workspaceId: string,
  isTeamScoped: boolean,
  teamIdFromUrl?: string
): string {
  if (isTeamScoped && teamIdFromUrl) {
    return `/workspace/${workspaceId}/team/${teamIdFromUrl}/issues/active`
  }

  return `/workspace/${workspaceId}/workspace/teams`
}

export function getSummary(workspaceName: string): string {
  return `Create a team in ${workspaceName}.`
}
