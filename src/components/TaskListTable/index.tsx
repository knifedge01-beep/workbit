import type { FC } from 'react'

import { tableClasses } from './styles/classes'
import type { TaskListItem, TaskListTableProps } from './types'
import { PRIORITY_COLORS, STATUS_DOT_COLORS } from './utils/classMaps'

export type { TaskListItem } from './types'

export const TaskListTable: FC<TaskListTableProps> = ({
  items,
  onRowClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={tableClasses.loadingWrap}>
        <div className={tableClasses.loadingText}>Loading...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={tableClasses.loadingWrap}>
        <div className={tableClasses.loadingText}>No items found</div>
      </div>
    )
  }

  return (
    <div className={tableClasses.listWrap}>
      {items.map((item: TaskListItem) => (
        <div
          key={item.id}
          onClick={() => onRowClick?.(item)}
          className={`${tableClasses.rowBase} ${onRowClick ? 'cursor-pointer' : ''}`}
        >
          <div
            className={`${tableClasses.statusDot} ${STATUS_DOT_COLORS[item.status]}`}
          />

          <div className={tableClasses.idWrap}>
            <span className={tableClasses.idText}>
              {item.id.substring(0, 6)}
            </span>
          </div>

          <div className={tableClasses.titleWrap}>
            <p className={tableClasses.titleText}>{item.title}</p>
          </div>

          <div className={tableClasses.priorityWrap}>
            <span
              className={`${tableClasses.priorityText} ${PRIORITY_COLORS[item.priority]}`}
            >
              {item.priority}
            </span>
          </div>

          <div className={tableClasses.assigneeWrap}>
            <span className={tableClasses.assigneeText}>
              {item.assignee?.name || '—'}
            </span>
          </div>

          <div className={tableClasses.timeWrap}>
            <span className={tableClasses.timeText}>{item.timeLabel}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
