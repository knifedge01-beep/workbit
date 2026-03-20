import type { TeamTableRow } from '../types'

export function filterTeams(
  teams: TeamTableRow[],
  query: string
): TeamTableRow[] {
  if (!query) {
    return teams
  }

  const normalized = query.toLowerCase()
  return teams.filter((team) =>
    team.teamName.toLowerCase().includes(normalized)
  )
}
