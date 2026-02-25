import { PageHeader, Stack, Text } from '@design-system'
import { TeamsTable } from '../components'
import type { TeamTableRow } from '../components'
import { fetchWorkspaceTeams } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceTeamsScreen() {
  const { data, loading, error } = useFetch(fetchWorkspaceTeams)

  const teams: TeamTableRow[] = (data ?? []).map((t) => ({
    id: t.id,
    teamName: t.name,
    members: String(t.memberCount),
    project: t.project?.name ?? '',
  }))

  return (
    <Stack gap={4}>
      <PageHeader
        title="Teams"
        summary="Workspace teams, members and projects."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load teams: {error}
        </Text>
      )}
      {!loading && <TeamsTable teams={teams} />}
    </Stack>
  )
}
