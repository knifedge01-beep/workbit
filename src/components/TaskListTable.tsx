import React from 'react'

export interface TaskListItem {
  id: string
  title: string
  status: 'in-progress' | 'todo' | 'done' | 'backlog'
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'
  assignee: { id: string; name: string } | null
  timeLabel: string
}

interface TaskListTableProps {
  items: TaskListItem[]
  onRowClick?: (item: TaskListItem) => void
  isLoading?: boolean
}

const priorityColors: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-800',
  HIGH: 'bg-orange-100 text-orange-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  LOW: 'bg-gray-100 text-gray-800',
}

export const TaskListTable: React.FC<TaskListTableProps> = ({
  items,
  onRowClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">No items found</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onRowClick?.(item)}
          className={`flex items-center gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
            onRowClick ? 'cursor-pointer' : ''
          }`}
        >
          {/* Status indicator */}
          <div
            className={`h-2 w-2 rounded-full flex-shrink-0 ${
              item.status === 'done'
                ? 'bg-green-500'
                : item.status === 'in-progress'
                  ? 'bg-blue-500'
                  : item.status === 'backlog'
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
            }`}
          />

          {/* ID */}
          <div className="w-20 flex-shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {item.id.substring(0, 6)}
            </span>
          </div>

          {/* Title */}
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </p>
          </div>

          {/* Priority badge */}
          <div className="w-28 flex-shrink-0">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                priorityColors[item.priority] || priorityColors.MEDIUM
              }`}
            >
              {item.priority}
            </span>
          </div>

          {/* Assignee */}
          <div className="w-32 flex-shrink-0">
            <span className="text-sm text-gray-600">
              {item.assignee?.name || '—'}
            </span>
          </div>

          {/* Time */}
          <div className="w-24 flex-shrink-0 text-right">
            <span className="text-xs text-gray-500">{item.timeLabel}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
