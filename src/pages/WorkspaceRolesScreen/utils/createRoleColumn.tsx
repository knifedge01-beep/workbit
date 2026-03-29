import { Text } from '@design-system'
import type { ColumnDef } from '@design-system'

export type RoleTableRow = {
  id: string
  role: string
  members: string
  description: string
}

export function createRoleColumn(): ColumnDef<RoleTableRow, unknown>[] {
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
