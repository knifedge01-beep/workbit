import { Table } from '@design-system'

import { TableContainer } from './styles'
import type { MemberRow, MembersTableProps } from './types'
import { createColumns } from './utils/createColumns'

export type { MemberRow } from './types'

const columns = createColumns()

export function MembersTable({ members, className }: MembersTableProps) {
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
