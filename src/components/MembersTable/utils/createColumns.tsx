import { Avatar, Tags, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

import { NameCell, NameBlock, MemberName, StatusBadge } from '../styles'
import type { MemberRow } from '../types'

export function createColumns(): ColumnDef<MemberRow, unknown>[] {
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
