import type { TaskListItem } from './TaskListTable'

export type TaskStatus = 'in-progress' | 'todo' | 'done' | 'backlog'
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'

type IssueLike = {
  id: string
  title: string
  status: string
  date: string
  assignee?: { id: string; name: string } | null
}

function mapApiStatusToUi(value: string): TaskStatus {
  const normalized = value.toLowerCase()
  if (normalized === 'in progress' || normalized === 'in-progress') {
    return 'in-progress'
  }
  if (normalized === 'done') return 'done'
  if (normalized === 'backlog') return 'backlog'
  return 'todo'
}

export function mapPriorityFromStatus(status: string): TaskPriority {
  const uiStatus = mapApiStatusToUi(status)
  if (uiStatus === 'in-progress') return 'HIGH'
  if (uiStatus === 'todo') return 'MEDIUM'
  if (uiStatus === 'backlog') return 'LOW'
  return 'LOW'
}

export function mapStatusForTaskList(status: string): TaskStatus {
  return mapApiStatusToUi(status)
}

export function mapPriorityForTaskList(priority?: string): TaskPriority {
  if (!priority) return 'MEDIUM'
  const normalized = priority.toLowerCase()
  if (normalized === 'urgent') return 'URGENT'
  if (normalized === 'high') return 'HIGH'
  if (normalized === 'low') return 'LOW'
  return 'MEDIUM'
}

export function mapIssueToTaskListItem(
  issue: IssueLike,
  options?: { priority?: string; timeLabel?: string }
): TaskListItem {
  return {
    id: issue.id,
    title: issue.title,
    status: mapStatusForTaskList(issue.status),
    priority: options?.priority
      ? mapPriorityForTaskList(options.priority)
      : mapPriorityFromStatus(issue.status),
    assignee: issue.assignee ?? null,
    timeLabel: options?.timeLabel ?? issue.date,
  }
}
