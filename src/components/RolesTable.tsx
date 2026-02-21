import styled from 'styled-components'
import { Table, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type RoleTableRow = {
  id: string
  role: string
  members: string
  description: string
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

function createColumns(): ColumnDef<RoleTableRow, unknown>[] {
  return [
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.role}
        </Text>
      ),
    },
    {
      id: 'members',
      accessorKey: 'members',
      header: 'Members',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.members}
        </Text>
      ),
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Description',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => (
        <Text size="sm" as="span" muted>
          {row.original.description}
        </Text>
      ),
    },
  ]
}

const columns = createColumns()

type Props = {
  roles: RoleTableRow[]
  className?: string
}

export function RolesTable({ roles, className }: Props) {
  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Roles</Title>
          <Count>{roles.length}</Count>
        </TitleBlock>
      </SectionHeader>
      <Table<RoleTableRow>
        columns={columns}
        data={roles}
        enableSorting
        initialState={{ sorting: [{ id: 'role', desc: false }] }}
      />
    </section>
  )
}
