export type TaskListItem = {
  id: string
  title: string
  status: 'in-progress' | 'todo' | 'done' | 'backlog'
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
  assignee: { id: string; name: string } | null
  timeLabel: string
}

export type TaskListTableProps = {
  items: TaskListItem[]
  onRowClick?: (item: TaskListItem) => void
  isLoading?: boolean
}
