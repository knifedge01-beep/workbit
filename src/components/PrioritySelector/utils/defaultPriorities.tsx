import {
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
  AlertCircle,
} from 'lucide-react'

import type { PriorityOption } from '../types'

export const DEFAULT_PRIORITIES: PriorityOption[] = [
  { id: 'low', label: 'Low', icon: <ArrowDownCircle size={16} /> },
  { id: 'medium', label: 'Medium', icon: <MinusCircle size={16} /> },
  { id: 'high', label: 'High', icon: <ArrowUpCircle size={16} /> },
  {
    id: 'urgent',
    label: 'Urgent',
    icon: (
      <AlertCircle
        size={16}
        style={{ color: 'var(--priority-urgent, #EF4444)' }}
      />
    ),
  },
]
