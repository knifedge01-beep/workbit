import { Table } from '@design-system'

import { SectionHeader, TitleBlock, Title, Count } from './styles'
import type { ViewTableRow, ViewsTableProps } from './types'
import { createColumns } from './utils/createColumns'

export type { ViewTableRow } from './types'

const columns = createColumns()

export function ViewsTable({ views, className }: ViewsTableProps) {
  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Views</Title>
          <Count>{views.length}</Count>
        </TitleBlock>
      </SectionHeader>
      <Table<ViewTableRow>
        columns={columns}
        data={views}
        enableSorting
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </section>
  )
}
