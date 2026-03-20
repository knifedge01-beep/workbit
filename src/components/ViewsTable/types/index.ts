export type ViewTableRow = {
  id: string
  name: string
  type: string
  owner: string
}

export type ViewsTableProps = {
  views: ViewTableRow[]
  className?: string
}
