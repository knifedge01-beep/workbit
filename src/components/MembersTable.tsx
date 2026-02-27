import styled from 'styled-components'
import { Table, Avatar, Tags, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type MemberRow = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  teams: string
}

const TableContainer = styled.div`
  background: ${(p) => p.theme.colors.surface};\n  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.lg ?? 8}px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]}px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: ${(p) => p.theme.spacing[2]}px;
  }
`

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 0;
  overflow: hidden;
`

const MemberName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(p) => p.theme.colors.surfaceSecondary};
  color: ${(p) => p.theme.colors.textMuted};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  border: 1px solid ${(p) => p.theme.colors.border};
`

function createColumns(): ColumnDef<MemberRow, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      meta: { flex: 2 },
      cell: ({ row }) => {
        const { name, username, avatarSrc } = row.original
        return (
          <NameCell>
            <Avatar name={name} src={avatarSrc} size={36} />
            <NameBlock>
              <MemberName>{name}</MemberName>
              <Text size="xs" muted as="span">
                @{username}
              </Text>
            </NameBlock>
          </NameCell>
        )
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      meta: { flex: 1 },
      cell: ({ row }) => <StatusBadge>{row.original.status}</StatusBadge>,
    },
    {
      id: 'joined',
      accessorKey: 'joined',
      header: 'Joined',
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" muted as="span">
          {row.original.joined}
        </Text>
      ),
    },
    {
      id: 'teams',
      accessorKey: 'teams',
      header: 'Teams',
      meta: { flex: 1.2 },
      cell: ({ row }) => <Tags label={row.original.teams} size="small" />,
    },
  ]
}

const columns = createColumns()

type Props = {
  members: MemberRow[]
  className?: string
}

export function MembersTable({ members, className }: Props) {
  return (
    <TableContainer className={className}>
      <Table<MemberRow>
        columns={columns}
        data={members}
        enableSorting
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </TableContainer>
  )
}
