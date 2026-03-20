import { Circle, CircleDot, CheckCircle2, PauseCircle } from 'lucide-react'

import type { StatusOption } from '../../StatusSelector'

export const projectStatusOptions: StatusOption[] = [
  { id: 'planned', label: 'Planned', icon: <Circle size={16} /> },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: (
      <CircleDot
        size={16}
        style={{ color: 'var(--status-in-progress, #F59E0B)' }}
      />
    ),
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: (
      <CheckCircle2
        size={16}
        style={{ color: 'var(--status-done, #8B5CF6)' }}
      />
    ),
  },
  {
    id: 'on_hold',
    label: 'On hold',
    icon: (
      <PauseCircle size={16} style={{ color: 'var(--text-muted, #64748b)' }} />
    ),
  },
]
