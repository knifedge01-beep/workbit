import styled from 'styled-components'
import { Table, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type ProjectTableRow = {
  id: string
  name: string
  team: string
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

function createColumns(): ColumnDef<ProjectTableRow, unknown>[] {
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
      id: 'team',
      accessorKey: 'team',
      header: 'Team',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.team}
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

type Props = {
  projects: ProjectTableRow[]
  className?: string
}

export function ProjectsTable({ projects, className }: Props) {
  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Projects</Title>
          <Count>{projects.length}</Count>
        </TitleBlock>
      </SectionHeader>
      <Table<ProjectTableRow>
        columns={columns}
        data={projects}
        enableSorting
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </section>
  )
}
