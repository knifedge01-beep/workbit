import type { TeamTableRow } from '../../../components'
import type { ApiTeam } from '../../../api/client'

export function mapTeamsToRows(teams: ApiTeam[]): TeamTableRow[] {
  return teams.map((team) => ({
    id: team.id,
    teamName: team.name,
    members: String(team.memberCount),
    project: team.project?.name ?? '',
  }))
}
