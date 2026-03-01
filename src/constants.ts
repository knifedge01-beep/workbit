export type Team = { id: string; name: string }

export type Issue = {
  id: string
  title: string
  assignee: string
  date: string
  selected?: boolean
  /** Status id for status selector (e.g. 'todo', 'in_progress', 'done'). */
  status?: string
  /** Priority id for priority selector (e.g. 'low', 'medium', 'high', 'urgent'). */
  priority?: string
}
