import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'

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
    <Stack gap="300" fullWidth>
      <Inline align="center" justify="space-between" fullWidth>
        <Stack gap="050">
          <Text as="h1" variant="heading4">
            {workspaceProjectsText.title}
          </Text>
          <Text variant="body3" color="color.text.subtle">
            {workspaceProjectsText.summary}
          </Text>
        </Stack>
        {workspaceId ? (
          <Button
            variant="glass"
            onClick={() => navigate(getNewProjectPath(workspaceId))}
          >
            <Plus size={16} />
            {workspaceProjectsText.newProject}
          </Button>
        ) : null}
      </Inline>
      {error ? (
        <Text variant="body3" color="color.text.subtle">
          Failed to load projects: {error}
        </Text>
      ) : null}
      {!loading ? (
        <ProjectsTable projects={projects} onRowClick={handleRowClick} />
      ) : null}
    </Stack>
  )
}
