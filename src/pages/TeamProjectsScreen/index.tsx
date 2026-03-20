import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { Button, Flex, PageHeader, Stack, Table } from '@design-system'

import { useWorkspace } from '../../contexts/WorkspaceContext'
import { Count, SectionHeader, Title, TitleBlock } from './styles'
import type {
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

const columns = createColumns()

export function TeamProjectsScreen({ teamName }: TeamProjectsScreenProps) {
  const { workspaceId, teamId } = useParams<TeamProjectsParams>()
  const navigate = useNavigate()
  const { projects: workspaceProjects } = useWorkspace()
  const projects = toTeamProjects(workspaceProjects, teamId)

  const handleRowClick = (row: TeamProjectRow) => {
    if (workspaceId && teamId) {
      navigate(getTeamProjectPath(workspaceId, teamId, row.id))
    }
  }

  const handleNewProject = () => {
    if (workspaceId && teamId) {
      navigate(getNewTeamProjectPath(workspaceId, teamId))
    }
  }

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title={`${teamName} – Projects`}
          summary="Projects for this team."
        />
        <Button variant="primary" onClick={handleNewProject}>
          <Plus size={16} />
          New Project
        </Button>
      </Flex>

      <section>
        <SectionHeader>
          <TitleBlock>
            <Title>Projects</Title>
            <Count>{projects.length}</Count>
          </TitleBlock>
        </SectionHeader>
        <Table<TeamProjectRow>
          columns={columns}
          data={projects}
          enableSorting
          onRowClick={handleRowClick}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </section>
    </Stack>
  )
}
