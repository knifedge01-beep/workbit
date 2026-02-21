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

export const DEMO_TEAMS: Team[] = [
  { id: 'Test94', name: 'Test94' },
  { id: 'Design', name: 'Design' },
  { id: 'Engineering', name: 'Engineering' },
]

export const DEMO_ISSUES: Issue[] = [
  {
    id: 'TES-1',
    title: 'Get familiar with Linear',
    assignee: 'You',
    date: 'Feb 11',
    selected: true,
    status: 'todo',
    priority: 'medium',
  },
  { id: 'TES-2', title: 'Connect your tools', assignee: '', date: 'Feb 11', status: 'todo', priority: 'low' },
  { id: 'TES-3', title: 'Invite your team', assignee: '', date: 'Feb 10', status: 'todo', priority: 'urgent' },
  { id: 'TES-4', title: 'Create a project', assignee: '', date: 'Feb 9', status: 'todo', priority: 'high' },
]
