import type { ApiTeam } from '../../../api/client'
import type { TeamTableRow } from '../types'

export function mapTeamsToRows(teams: ApiTeam[]): TeamTableRow[] {
  return teams.map((team) => ({
    id: team.id,
    teamName: team.name,
    members: String(team.memberCount),
    project: team.project?.name ?? '',
  }))
}
