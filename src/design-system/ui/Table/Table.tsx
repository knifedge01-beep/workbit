import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState, Table as TanStackTableType } from '@tanstack/react-table'
import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'lucide-react'

const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[4]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.backgroundSubtle ?? p.theme.colors.background};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const HeaderCell = styled.div<{ $flex?: number }>`
  flex: ${(p) => p.$flex ?? 1};
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
`

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`

const BodyRow = styled.div<{ $clickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[4]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  min-height: 56px;
  ${(p) => p.$clickable && 'cursor: pointer;'}
  &:last-child {
    border-bottom: none;
  }
  ${(p) =>
    p.$clickable &&
    `
  &:hover {
    background: ${p.theme.colors.backgroundSubtle ?? p.theme.colors.background};
  }
  `}
`

const BodyCell = styled.div<{ $flex?: number }>`
  flex: ${(p) => p.$flex ?? 1};
  min-width: 0;
  display: flex;
  align-items: center;
`

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    flex?: number
  }
}

export type { ColumnDef, SortingState, TanStackTableType }

type TableProps<T> = {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  /** Enable sorting. When true, columns with enableSorting can toggle sort. */
  enableSorting?: boolean
  /** Initial sorting state. */
  initialState?: { sorting: SortingState }
  /** Called when a row is clicked. When provided, rows are visually clickable. */
  onRowClick?: (row: T) => void
  className?: string
}

export function Table<T>({
  columns,
  data,
  enableSorting = false,
  initialState,
  onRowClick,
  className,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting ?? [])

  const table = useReactTable({
    data,
    columns,
    state: enableSorting ? { sorting } : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
  })

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows

  return (
    <TableWrapper className={className} role="table">
      {headerGroups.map((headerGroup) => (
        <HeaderRow key={headerGroup.id} role="row">
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta
            const flex = meta?.flex ?? 1
            const canSort = enableSorting && header.column.getCanSort()
            const isSorted = header.column.getIsSorted()
            const content = flexRender(header.column.columnDef.header, header.getContext())

            return (
              <HeaderCell key={header.id} $flex={flex} role="columnheader">
                {canSort ? (
                  <SortButton
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    aria-sort={
                      isSorted === 'asc'
                        ? 'ascending'
                        : isSorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    {content}
                    {isSorted === 'asc' && <ChevronUp size={14} aria-hidden />}
                    {isSorted === 'desc' && <ChevronDown size={14} aria-hidden />}
                  </SortButton>
                ) : (
                  content
                )}
              </HeaderCell>
            )
          })}
        </HeaderRow>
      ))}
      <div role="rowgroup">
        {rows.map((row) => (
          <BodyRow
            key={row.id}
            role="row"
            $clickable={Boolean(onRowClick)}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          >
            {row.getVisibleCells().map((cell) => {
              const meta = cell.column.columnDef.meta
              const flex = meta?.flex ?? 1
              return (
                <BodyCell key={cell.id} $flex={flex} role="cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </BodyCell>
              )
            })}
          </BodyRow>
        ))}
      </div>
    </TableWrapper>
  )
}
