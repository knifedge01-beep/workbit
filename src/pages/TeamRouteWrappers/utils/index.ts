import type { Team } from '../../../constants'

export const RESERVED_TEAM_SEGMENTS = new Set([
  'issues',
  'issue',
  'projects',
  'views',
  'logs',
  'member',
  'teams',
  'new',
])

export function resolveTeamName(teams: Team[], teamId: string | undefined) {
  return teams.find((team) => team.id === teamId)?.name ?? teamId ?? 'Team'
}
