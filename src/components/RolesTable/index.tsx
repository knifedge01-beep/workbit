import { Table } from '@thedatablitz/table'

import { SectionHeader, TitleBlock, Title, Count } from './styles'
import type { RoleTableRow, RolesTableProps } from './types'
import { createColumns } from './utils/createColumns'

export type { RoleTableRow } from './types'

const columns = createColumns()

export function RolesTable({ roles, className }: RolesTableProps) {
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
