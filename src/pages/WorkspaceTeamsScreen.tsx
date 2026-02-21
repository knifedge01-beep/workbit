import { PageHeader, Stack } from '@design-system'
import { TeamsTable } from '../components'
import type { TeamTableRow } from '../components'
import { DEMO_TEAMS } from '../constants'

const SAMPLE_TEAMS: TeamTableRow[] = DEMO_TEAMS.map((team, i) => ({
  id: team.id,
  teamName: team.name,
  members: `${i + 1}`,
  project: team.name === 'Test94' ? 'TES' : team.name === 'Design' ? 'Design system' : 'Platform',
}))

export function WorkspaceTeamsScreen() {
  return (
    <Stack gap={4}>
      <PageHeader title="Teams" summary="Workspace teams, members and projects." />
      <TeamsTable teams={SAMPLE_TEAMS} />
    </Stack>
  )
}
