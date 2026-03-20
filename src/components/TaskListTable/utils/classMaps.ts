import type { TaskListItem } from '../types'

export const PRIORITY_COLORS: Record<TaskListItem['priority'], string> = {
  URGENT: 'bg-red-100 text-red-800',
  HIGH: 'bg-orange-100 text-orange-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  LOW: 'bg-gray-100 text-gray-800',
}

export const STATUS_DOT_COLORS: Record<TaskListItem['status'], string> = {
  done: 'bg-green-500',
  'in-progress': 'bg-blue-500',
  backlog: 'bg-yellow-500',
  todo: 'bg-gray-400',
}
