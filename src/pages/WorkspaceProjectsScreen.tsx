import { useNavigate } from 'react-router-dom'
import { PageHeader, Stack, Text } from '@design-system'
import { ProjectsTable } from '../components'
import type { ProjectTableRow } from '../components'
import { fetchProjects } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function WorkspaceProjectsScreen() {
  const navigate = useNavigate()
  const { data, loading, error } = useFetch(fetchProjects)

  const projects: ProjectTableRow[] = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    team: p.team.name,
    status: p.status,
  }))

  const handleRowClick = (row: ProjectTableRow) => {
    const teamId = data?.find((p) => p.id === row.id)?.team.id ?? row.team
    navigate(`/team/${teamId}/projects/${row.id}`)
  }

  return (
    <Stack gap={4}>
      <PageHeader
        title="Workspace projects"
        summary="All projects in your workspace."
      />
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
