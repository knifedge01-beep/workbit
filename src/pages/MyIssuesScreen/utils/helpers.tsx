import {
  ArrowDownCircle,
  ArrowUpCircle,
  Circle,
  MinusCircle,
} from 'lucide-react'

import { formatDateTime } from '../../../utils/format'
import type {
  InlinePriorityOption,
  IssueOverrides,
  MyIssueApiItem,
  MyIssueRow,
  TeamLite,
} from '../types'

export const INLINE_PRIORITY_OPTIONS: InlinePriorityOption[] = [
  {
    id: 'none',
    label: 'Not set',
    icon: <Circle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'low',
    label: 'Low',
    icon: <ArrowDownCircle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'medium',
    label: 'Medium',
    icon: <MinusCircle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'high',
    label: 'High',
    icon: <ArrowUpCircle size={14} strokeWidth={2.2} />,
  },
]

export function toIssueRows(
  items: MyIssueApiItem[],
  overrides: IssueOverrides
): MyIssueRow[] {
  return items.map((issue) => ({
    ...issue,
    date: issue.date ? formatDateTime(issue.date) : '—',
    status: overrides[issue.id]?.status ?? issue.status ?? 'todo',
    priority: overrides[issue.id]?.priority ?? 'none',
    assigneeInitials: issue.assignee?.name
      ? issue.assignee.name.slice(0, 2).toUpperCase()
      : '',
  }))
}

export function toTeamSelectOptions(
  teams: TeamLite[]
): Array<{ value: string; label: string }> {
  return [
    { value: '', label: 'No team' },
    ...teams.map((team) => ({ value: team.id, label: team.name })),
  ]
}
