import { useState } from 'react'
import styled from 'styled-components'
import { Search, SortAsc, Folder } from 'lucide-react'
import { Table, Text, Badge } from '@design-system'
import type { ColumnDef } from '@design-system'

export type ProjectTableRow = {
  id: string
  name: string
  team: string
  status: string
}

const statusColorMap: Record<
  string,
  'blue' | 'green' | 'grey' | 'orange' | 'red'
> = {
  active: 'blue',
  completed: 'green',
  planned: 'grey',
  paused: 'orange',
  cancelled: 'red',
}

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: 5px ${(p) => p.theme.spacing[2]}px;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  flex: 1;
  max-width: 260px;
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    width: 100%;
    &::placeholder {
      color: ${(p) => p.theme.colors.textMuted};
    }
  }
  svg {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
`

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

const ProjectNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .proj-icon {
    color: ${(p) => p.theme.colors.primary};
    flex-shrink: 0;
  }
`

function createColumns(): ColumnDef<ProjectTableRow, unknown>[] {
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

const columns = createColumns()

type Props = {
  projects: ProjectTableRow[]
  className?: string
  onRowClick?: (row: ProjectTableRow) => void
}

export function ProjectsTable({ projects, className, onRowClick }: Props) {
  const [query, setQuery] = useState('')
  const filtered = query
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.team.toLowerCase().includes(query.toLowerCase())
      )
    : projects

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
