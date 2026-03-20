export type ProjectTableRow = {
  id: string
  name: string
  team: string
  status: string
}

export type ProjectsTableProps = {
  projects: ProjectTableRow[]
  className?: string
  onRowClick?: (row: ProjectTableRow) => void
}
