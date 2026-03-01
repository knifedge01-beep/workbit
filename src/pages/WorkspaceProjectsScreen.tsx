import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader, Stack, Text, Button, Flex } from '@design-system'
import { ProjectsTable } from '../components'
import type { ProjectTableRow } from '../components'
import { fetchProjects } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceProjectsScreen() {
  const navigate = useNavigate()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data, loading, error } = useFetch(fetchProjects)

  const projects: ProjectTableRow[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    team: p.team.name,
    status: p.status,
  }))

  const handleRowClick = (row: ProjectTableRow) => {
    const teamId = data?.find((p) => p.id === row.id)?.team.id ?? row.team
    if (workspaceId)
      navigate(`/workspace/${workspaceId}/team/${teamId}/projects/${row.id}`)
  }

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title="Workspace projects"
          summary="All projects in your workspace."
        />
        {workspaceId && (
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/workspace/${workspaceId}/workspace/projects/new`)
            }
          >
            <Plus size={16} />
            New Project
          </Button>
        )}
      </Flex>
      {error && (
        <Text size="sm" muted>
          Failed to load projects: {error}
        </Text>
      )}
      {!loading && (
        <ProjectsTable projects={projects} onRowClick={handleRowClick} />
      )}
    </Stack>
  )
}
