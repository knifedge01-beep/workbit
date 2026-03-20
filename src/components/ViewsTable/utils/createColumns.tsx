import { Text } from '@design-system'
import type { ColumnDef } from '@design-system'

import type { ViewTableRow } from '../types'

export function createColumns(): ColumnDef<ViewTableRow, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.name}
        </Text>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.type}
        </Text>
      ),
    },
    {
      id: 'owner',
      accessorKey: 'owner',
      header: 'Owner',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" as="span">
          {row.original.owner}
        </Text>
      ),
    },
  ]
}
