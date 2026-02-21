import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PageHeader, Stack, Table, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type TeamProjectRow = {
  id: string
  name: string
  status: string
}

/* Mock projects per team for demo. In production, fetch by teamId. */
const MOCK_TEAM_PROJECTS: Record<string, TeamProjectRow[]> = {
  Test94: [
    { id: 'tes', name: 'TES', status: 'Active' },
    { id: 'onboarding', name: 'Onboarding', status: 'In progress' },
  ],
  Design: [
    { id: 'design-system', name: 'Design system', status: 'Active' },
    { id: 'brand', name: 'Brand refresh', status: 'Planning' },
  ],
  Engineering: [
    { id: 'platform', name: 'Platform', status: 'In progress' },
    { id: 'api-v2', name: 'API v2', status: 'Active' },
  ],
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
  const projects = (teamId ? MOCK_TEAM_PROJECTS[teamId] : undefined) ?? []

  const handleRowClick = (row: TeamProjectRow) => {
    if (teamId) {
      navigate(`/team/${teamId}/projects/${row.id}`)
    }
  }

  return (
    <Stack gap={4}>
      <PageHeader title={`${teamName} – Projects`} summary="Projects for this team." />

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
