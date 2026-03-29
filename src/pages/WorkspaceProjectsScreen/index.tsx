import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Alert } from '@thedatablitz/alert'
import { PageHeader, Stack as View } from '@design-system'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { fetchProjects } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Badge } from '@thedatablitz/badge'
import { Table } from '@thedatablitz/table'
import type { ApiProjectSummary, WorkspaceProjectsParams } from './types'
import { getNewProjectPath, toProjectRows } from './utils/helpers'
import { createProjectColumn } from './utils/createProjectColumn'

export function WorkspaceProjectsScreen() {
  const navigate = useNavigate()
  const { workspaceId } = useParams<WorkspaceProjectsParams>()
  const { data, loading, error } = useFetch(fetchProjects)

  const projectData = (data ?? []) as ApiProjectSummary[]
  const projects = toProjectRows(projectData)

  // const handleRowClick = (row: (typeof projects)[number]) => {
  //   if (!workspaceId) return
  //   const teamId = resolveTeamId(projectData, row.id, row.team)
  //   navigate(getProjectDetailPath(workspaceId, teamId, row.id))
  // }

  return (
    <View gap={4} className="flex w-full flex-col">
      <PageHeader
        title={'Workspace projects'}
        summary={'All projects in your workspace.'}
      />

      {workspaceId ? (
        <Button
          variant="glass"
          className="shrink-0"
          icon={<Plus size={16} />}
          onClick={() => navigate(getNewProjectPath(workspaceId))}
        >
          New Project
        </Button>
      ) : null}

      {error ? (
        <Alert
          variant="error"
          placement="inline"
          description={`Failed to load projects: ${error}`}
          className="w-full"
        />
      ) : null}
      {!loading ? (
        <Stack gap="100">
          <Inline gap="050">
            <Text variant="heading6">Projects</Text>
            <Badge variant="warning" size="small">
              {projects.length}
            </Badge>
          </Inline>
          <Table
            columns={createProjectColumn()}
            searchable={false}
            columnFilterable={false}
            data={projects}
          />
        </Stack>
      ) : null}
    </View>
  )
}
