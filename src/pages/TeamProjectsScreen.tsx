import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import styled from 'styled-components'
import {
  PageHeader,
  Stack,
  Table,
  Text,
  Button,
  Flex,
  Modal,
  Input,
} from '@design-system'
import type { ColumnDef } from '@design-system'
import { createProject } from '../api/client'
import { useWorkspace } from '../contexts/WorkspaceContext'

export type TeamProjectRow = {
  id: string
  name: string
  status: string
}

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  padding-bottom: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Count = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

function createColumns(): ColumnDef<TeamProjectRow, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Project',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.name}
        </Text>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.status}
        </Text>
      ),
    },
  ]
}

const columns = createColumns()

type Props = { teamName: string }

export function TeamProjectsScreen({ teamName }: Props) {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const { projects: workspaceProjects, refreshTeamsAndProjects } =
    useWorkspace()
  const projects: TeamProjectRow[] = teamId
    ? workspaceProjects
        .filter((p) => p.team.id === teamId)
        .map((p) => ({ id: p.id, name: p.name, status: p.status }))
    : []
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')

  const handleRowClick = (row: TeamProjectRow) => {
    if (teamId) {
      navigate(`/team/${teamId}/projects/${row.id}`)
    }
  }

  const handleCreateProject = async () => {
    if (!teamId || !projectName.trim()) return

    setCreating(true)
    try {
      await createProject({ name: projectName, teamId, status: 'Active' })
      await refreshTeamsAndProjects()
      setShowModal(false)
      setProjectName('')
    } catch (err) {
      alert(`Failed to create project: ${err}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Stack gap={4}>
      <Flex align="center" justify="space-between">
        <PageHeader
          title={`${teamName} – Projects`}
          summary="Projects for this team."
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
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

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Project"
        primaryLabel="Create"
        onPrimary={handleCreateProject}
        secondaryLabel="Cancel"
        onSecondary={() => setShowModal(false)}
      >
        <Stack gap={3}>
          <div>
            <Text
              as="label"
              size="sm"
              weight="medium"
              style={{ display: 'block', marginBottom: '8px' }}
            >
              Project Name
            </Text>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              disabled={creating}
            />
          </div>
        </Stack>
      </Modal>
    </Stack>
  )
}
