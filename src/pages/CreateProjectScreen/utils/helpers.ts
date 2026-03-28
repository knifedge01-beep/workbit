export function getProjectListPath(
  workspaceId: string,
  isTeamScoped: boolean,
  teamIdFromUrl?: string
): string {
  if (isTeamScoped && teamIdFromUrl) {
    return `/workspace/${workspaceId}/team/${teamIdFromUrl}/projects`
  }

  return `/workspace/${workspaceId}/workspace/projects`
}
