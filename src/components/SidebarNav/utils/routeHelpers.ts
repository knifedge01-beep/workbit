import type { Team } from '../../../constants'

export function getActiveProfileTab(search: string): 'profile' | 'api-keys' {
  return new URLSearchParams(search).get('tab') === 'profile'
    ? 'profile'
    : 'api-keys'
}

export function isTeamIssues(base: string, teamId: string, pathname: string) {
  return (
    pathname === `${base}/team/${teamId}` ||
    pathname === `${base}/team/${teamId}/` ||
    pathname.startsWith(`${base}/team/${teamId}/issues`)
  )
}

export function isTeamProjects(base: string, teamId: string, pathname: string) {
  return pathname.startsWith(`${base}/team/${teamId}/projects`)
}

export function isTeamViews(base: string, teamId: string, pathname: string) {
  return pathname === `${base}/team/${teamId}/views`
}

export function isTeamLogs(base: string, teamId: string, pathname: string) {
  return pathname === `${base}/team/${teamId}/logs`
}

export function initExpandedTeams(teams: Team[]): Record<string, boolean> {
  return Object.fromEntries(teams.map((team) => [team.id, true]))
}
