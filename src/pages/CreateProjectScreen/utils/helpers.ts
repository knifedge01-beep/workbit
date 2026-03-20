import type { TeamList, TeamSelectOption } from '../types'

export const PROPERTY_CHIPS = [
  'Backlog',
  'No priority',
  'Lead',
  'Members',
  'Start',
  'Target',
  'Labels',
  'Dependencies',
]

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

export function getSummary(
  isTeamScoped: boolean,
  teamName: string | undefined,
  workspaceName: string
): string {
  if (isTeamScoped && teamName) {
    return `Create a project for ${teamName}.`
  }

  return `Create a project in ${workspaceName}.`
}

export function getTeamBadge(teamName: string | undefined): string {
  return teamName?.slice(0, 3).toUpperCase() ?? 'PRJ'
}

export function toTeamOptions(teams: TeamList): TeamSelectOption[] {
  return [
    { value: '', label: 'Select a team' },
    ...teams.map((team) => ({ value: team.id, label: team.name })),
  ]
}
