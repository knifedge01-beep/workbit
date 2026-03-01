import { useParams, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader, Stack, Text, Button, Flex } from '@design-system'
import { TeamsTable } from '../components'
import type { TeamTableRow } from '../components'
import { fetchWorkspaceTeams } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useWorkspace } from '../contexts/WorkspaceContext'

export function WorkspaceTeamsScreen() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  const { currentWorkspace } = useWorkspace()
  const { data, loading, error } = useFetch(
    () =>
      currentWorkspace
        ? fetchWorkspaceTeams(currentWorkspace.id)
        : Promise.resolve([]),
    [currentWorkspace?.id]
  )

  const teams: TeamTableRow[] = (data ?? []).map((t) => ({
    id: t.id,
    teamName: t.name,
    members: String(t.memberCount),
    project: t.project?.name ?? '',
  }))

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title="Teams"
          summary="Workspace teams, members and projects."
        />
        {workspaceId && (
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/workspace/${workspaceId}/workspace/teams/new`)
            }
          >
            <Plus size={16} />
            New Team
          </Button>
        )}
      </Flex>
      {error && (
        <Text size="sm" muted>
          Failed to load teams: {error}
        </Text>
      )}
      {!loading && workspaceId && (
        <TeamsTable workspaceId={workspaceId} teams={teams} />
      )}
    </Stack>
  )
}
