import { Table } from '@thedatablitz/table'
import type { ProjectTableRow, ProjectsTableProps } from './types'
import { createColumns } from './utils/createColumns'
import { Text } from '@thedatablitz/text'
import { Inline } from '@thedatablitz/inline'
import { Badge } from '@thedatablitz/badge'
import { Stack } from '@thedatablitz/stack'

export type { ProjectTableRow } from './types'

const columns = createColumns()

export function ProjectsTable({ projects, className }: ProjectsTableProps) {
  return (
    <Stack gap="100" className={className}>
      <Inline gap="050">
        <Text variant="heading6">Projects</Text>
        <Badge variant="warning" size="small">
          {projects.length}
        </Badge>
      </Inline>
      <Table<ProjectTableRow>
        columns={columns}
        searchable={false}
        columnFilterable={false}
        data={projects}
      />
    </Stack>
  )
}
