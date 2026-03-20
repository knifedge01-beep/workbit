import {
  ArrowDownCircle,
  ArrowUpCircle,
  Circle,
  MinusCircle,
} from 'lucide-react'

import { formatDateTime } from '../../../utils'
import type {
  InlinePriorityOption,
  IssueTab,
  IssueTabId,
  TeamIssueApiItem,
  TeamIssueOverrides,
  TeamIssueRow,
} from '../types'

export const DEFAULT_STATUS = 'todo'
export const DEFAULT_PRIORITY = 'none'

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

export const ISSUE_TABS: readonly IssueTab[] = [
  { id: 'all', label: 'All issues' },
  { id: 'active', label: 'Active' },
  { id: 'backlog', label: 'Backlog' },
]

const ISSUE_TAB_IDS: readonly IssueTabId[] = ISSUE_TABS.map((tab) => tab.id)

export const CREATE_ISSUE_CHIPS = [
  'Todo',
  'Priority',
  'Assignee',
  'Project',
  'Labels',
  'More',
]

export function isValidTab(tab: string | undefined): tab is IssueTabId {
  return tab != null && ISSUE_TAB_IDS.includes(tab as IssueTabId)
}

export function toIssueRows(
  apiIssues: TeamIssueApiItem[],
  overrides: TeamIssueOverrides
): TeamIssueRow[] {
  return apiIssues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    assignee: issue.assignee?.name ?? '',
    assigneeInitials: issue.assignee?.name
      ? issue.assignee.name.slice(0, 2).toUpperCase()
      : '',
    date: formatDateTime(issue.date),
    status: overrides[issue.id]?.status ?? issue.status ?? DEFAULT_STATUS,
    priority: overrides[issue.id]?.priority ?? DEFAULT_PRIORITY,
  }))
}

export function getIssuesTabPath(
  workspaceId: string,
  teamId: string,
  tab: IssueTabId
): string {
  return `/workspace/${workspaceId}/team/${teamId}/issues/${tab}`
}

export function getIssueDetailPath(
  workspaceId: string,
  teamId: string,
  issueId: string
): string {
  return `/workspace/${workspaceId}/team/${teamId}/issue/${issueId}`
}
