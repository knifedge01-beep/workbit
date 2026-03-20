import { Folder } from 'lucide-react'

import { Badge, Text } from '@design-system'
import type { ColumnDef } from '@design-system'

import { ProjectNameCell } from '../styles'
import type { ProjectTableRow } from '../types'
import { statusColorMap } from './statusColorMap'

export function createColumns(): ColumnDef<ProjectTableRow, unknown>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Project',
      enableSorting: true,
      meta: { flex: 1.5 },
      cell: ({ row }) => (
        <ProjectNameCell>
          <Folder size={14} className="proj-icon" />
          <Text size="sm" as="span">
            {row.original.name}
          </Text>
        </ProjectNameCell>
      ),
    },
    {
      id: 'team',
      accessorKey: 'team',
      header: 'Team',
      enableSorting: true,
      meta: { flex: 1 },
      cell: ({ row }) => (
        <Text size="sm" muted as="span">
          {row.original.team}
        </Text>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      meta: { flex: 0.8 },
      cell: ({ row }) => {
        const color =
          statusColorMap[row.original.status.toLowerCase()] ?? 'grey'
        return (
          <Badge variant="light" color={color} size="small">
            {row.original.status}
          </Badge>
        )
      },
    },
  ]
}
