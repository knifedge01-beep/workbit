import type { TeamLite, TeamOption } from '../types'

export const ISSUE_PROPERTY_CHIPS = [
  'Todo',
  'No priority',
  'Assignee',
  'Labels',
  'Project',
  'Due date',
]

export function toTeamOptions(teams: TeamLite[]): TeamOption[] {
  return [
    { value: '', label: 'Select a team' },
    ...teams.map((team) => ({ value: team.id, label: team.name })),
  ]
}

export function getSummary(
  isTeamScoped: boolean,
  teamName: string | undefined,
  workspaceName: string
): string {
  if (isTeamScoped && teamName) {
    return `Create an issue for ${teamName}.`
  }

  return `Create an issue in ${workspaceName}. Choose a team that has a project.`
}

export function getTeamBadge(teamName: string | undefined): string {
  return teamName?.slice(0, 3).toUpperCase() ?? 'ISS'
}

export function getIssueDetailPath(
  workspaceId: string,
  teamId: string,
  issueId: string
): string {
  return `/workspace/${workspaceId}/team/${teamId}/issue/${issueId}`
}

export function getCancelPath(
  workspaceId: string,
  isTeamScoped: boolean,
  teamIdFromUrl?: string
): string {
  if (isTeamScoped && teamIdFromUrl) {
    return `/workspace/${workspaceId}/team/${teamIdFromUrl}/issues/active`
  }

  return `/workspace/${workspaceId}/my-issues`
}
