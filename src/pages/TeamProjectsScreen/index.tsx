import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Table } from '@thedatablitz/table'

import { useWorkspace } from '../../contexts/WorkspaceContext'
import { SectionHeader, TitleBlock } from './styles'
import type {
  TeamProjectColumnDef,
  TeamProjectRow,
  TeamProjectsParams,
  TeamProjectsScreenProps,
} from './types'
import {
  createColumns,
  getNewTeamProjectPath,
  getTeamProjectPath,
  toTeamProjects,
} from './utils/helpers'

export function TeamProjectsScreen({ teamName }: TeamProjectsScreenProps) {
  const { workspaceId, teamId } = useParams<TeamProjectsParams>()
  const navigate = useNavigate()
  const { projects: workspaceProjects } = useWorkspace()
  const projects = toTeamProjects(workspaceProjects, teamId)

  const handleRowClick = useCallback(
    (row: TeamProjectRow) => {
      if (workspaceId && teamId) {
        navigate(getTeamProjectPath(workspaceId, teamId, row.id))
      }
    },
    [navigate, teamId, workspaceId]
  )

  const columns = useMemo<TeamProjectColumnDef[]>(
    () => createColumns(handleRowClick),
    [handleRowClick]
  )

  const handleNewProject = () => {
    if (workspaceId && teamId) {
      navigate(getNewTeamProjectPath(workspaceId, teamId))
    }
  }

  return (
    <Stack gap="400">
      <Inline align="center" justify="space-between" fullWidth>
        <Stack gap="050">
          <Text as="h1" variant="heading4">
            {`${teamName} - Projects`}
          </Text>
          <Text variant="body2" color="color.text.subtle">
            Projects for this team.
          </Text>
        </Stack>
        <Button variant="primary" onClick={handleNewProject}>
          <Plus size={16} />
          New Project
        </Button>
      </Inline>

      <section>
        <SectionHeader>
          <TitleBlock>
            <Text as="h2" variant="heading6">
              Projects
            </Text>
            <Text variant="body3" color="color.text.subtle">
              {projects.length}
            </Text>
          </TitleBlock>
        </SectionHeader>
        <Table
          columns={columns}
          data={projects}
          size="medium"
          searchable
          columnFilterable
          emptyMessage="No projects found"
          renderExpandedRow={(row) => (
            <Text variant="body3" color="color.text.subtle">
              Project ID: {row.original.id}
            </Text>
          )}
        />
      </section>
    </Stack>
  )
}
