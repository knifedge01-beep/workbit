import {
  Loader2,
  Circle,
  CircleDot,
  CheckCircle2,
  XCircle,
  Copy,
} from 'lucide-react'

import type { StatusOption } from '../types'

/** Exported for status count summaries (e.g. issue list headers). */
export const STATUS_OPTIONS: StatusOption[] = [
  { id: 'backlog', label: 'Backlog', icon: <Loader2 size={16} />, shortcut: 1 },
  { id: 'todo', label: 'Todo', icon: <Circle size={16} />, shortcut: 2 },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: (
      <CircleDot
        size={16}
        style={{ color: 'var(--status-in-progress, #F59E0B)' }}
      />
    ),
    shortcut: 3,
  },
  {
    id: 'done',
    label: 'Done',
    icon: (
      <CheckCircle2
        size={16}
        style={{ color: 'var(--status-done, #8B5CF6)' }}
      />
    ),
    shortcut: 4,
  },
  {
    id: 'canceled',
    label: 'Canceled',
    icon: (
      <XCircle size={16} style={{ color: 'var(--status-canceled, #EF4444)' }} />
    ),
    shortcut: 5,
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: (
      <Copy size={16} style={{ color: 'var(--status-duplicate, #6B7280)' }} />
    ),
    shortcut: 6,
  },
]
