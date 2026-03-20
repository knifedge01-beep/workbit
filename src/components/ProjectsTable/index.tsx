import { useState } from 'react'
import { Search, SortAsc } from 'lucide-react'

import { Table } from '@design-system'

import {
  Toolbar,
  SearchBox,
  FilterBtn,
  SectionHeader,
  TitleBlock,
  Title,
  Count,
} from './styles'
import type { ProjectTableRow, ProjectsTableProps } from './types'
import { createColumns } from './utils/createColumns'
import { filterProjects } from './utils/filterProjects'

export type { ProjectTableRow } from './types'

const columns = createColumns()

export function ProjectsTable({
  projects,
  className,
  onRowClick,
}: ProjectsTableProps) {
  const [query, setQuery] = useState('')
  const filtered = filterProjects(projects, query)

  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Projects</Title>
          <Count>{projects.length}</Count>
        </TitleBlock>
      </SectionHeader>
      <Toolbar>
        <SearchBox>
          <Search size={13} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter projects..."
          />
        </SearchBox>
        <FilterBtn>
          <SortAsc size={13} />
          Sort
        </FilterBtn>
      </Toolbar>
      <Table<ProjectTableRow>
        columns={columns}
        data={filtered}
        enableSorting
        onRowClick={onRowClick}
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </section>
  )
}
