import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Flex, PageHeader, Stack, Text } from '@design-system'

import { ProjectsTable } from '../../components'
import { fetchProjects } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { workspaceProjectsText } from './styles'
import type { ApiProjectSummary, WorkspaceProjectsParams } from './types'
import {
  getNewProjectPath,
  getProjectDetailPath,
  resolveTeamId,
  toProjectRows,
} from './utils/helpers'
import { Button } from '@thedatablitz/button'

export function WorkspaceProjectsScreen() {
  const navigate = useNavigate()
  const { workspaceId } = useParams<WorkspaceProjectsParams>()
  const { data, loading, error } = useFetch(fetchProjects)

  const projectData = (data ?? []) as ApiProjectSummary[]
  const projects = toProjectRows(projectData)

  const handleRowClick = (row: (typeof projects)[number]) => {
    if (!workspaceId) return
    const teamId = resolveTeamId(projectData, row.id, row.team)
    navigate(getProjectDetailPath(workspaceId, teamId, row.id))
  }

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title={workspaceProjectsText.title}
          summary={workspaceProjectsText.summary}
        />
        {workspaceId && (
          <Button
            variant="glass"
            onClick={() => navigate(getNewProjectPath(workspaceId))}
          >
            <Plus size={16} />
            {workspaceProjectsText.newProject}
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
