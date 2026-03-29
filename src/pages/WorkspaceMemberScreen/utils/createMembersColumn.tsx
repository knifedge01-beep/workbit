import { Inline } from '@thedatablitz/inline'
import { Avatar } from '@thedatablitz/avatar'
import { Text } from '@thedatablitz/text'
import type { ColumnDef } from '@thedatablitz/table'
import { Badge } from '@thedatablitz/badge'

export type MemberRow = {
  id: string
  name: string
  username: string
  avatarSrc?: string
  status: string
  joined: string
  teams: string
}

export function createMembersColumn(): ColumnDef<MemberRow, unknown>[] {
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
          <Inline gap="050">
            <Avatar name={name} src={avatarSrc} size="medium" />
            <Text variant="body3" as="span">
              {username}
            </Text>
          </Inline>
        )
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Badge variant="default" size="small">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'joined',
      accessorKey: 'joined',
      header: 'Joined',
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text variant="body3" color="color.text.subtle" as="span">
          {row.original.joined}
        </Text>
      ),
    },
    {
      id: 'teams',
      accessorKey: 'teams',
      header: 'Teams',
      meta: { flex: 1.2 },
      cell: ({ row }) => (
        <Badge variant="default" size="small">
          {row.original.teams}
        </Badge>
      ),
    },
  ]
}
