import {
  ArrowDownCircle,
  ArrowUpCircle,
  Circle,
  MinusCircle,
} from 'lucide-react'

import type { ApiSubIssue } from '../../../api/client'
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
    parentIssueId: issue.parentIssueId ?? null,
    subIssueCount: issue.subIssueCount ?? 0,
    depth: 0,
    isSubtaskRow: false,
  }))
}

export function subIssuesToTeamRows(
  parentIssueId: string,
  subs: ApiSubIssue[],
  overrides: TeamIssueOverrides
): TeamIssueRow[] {
  return subs.map((s) => ({
    id: s.id,
    title: s.title,
    assignee: '',
    assigneeInitials: '',
    date: formatDateTime(s.date),
    status: overrides[s.id]?.status ?? s.status ?? DEFAULT_STATUS,
    priority: overrides[s.id]?.priority ?? DEFAULT_PRIORITY,
    parentIssueId,
    subIssueCount: 0,
    depth: 1,
    isSubtaskRow: true,
  }))
}

function teamIssueSubtaskPlaceholder(parentId: string): TeamIssueRow {
  return {
    id: `${parentId}:__loading`,
    title: 'Loading…',
    assignee: '',
    assigneeInitials: '',
    date: '',
    status: DEFAULT_STATUS,
    priority: DEFAULT_PRIORITY,
    parentIssueId: parentId,
    subIssueCount: 0,
    depth: 1,
    isSubtaskRow: true,
    __placeholder: true,
  }
}

/** Tree roots for Table expandable; fetch subtasks on expand (see screen sync). */
export function buildTeamIssueTreeData(
  roots: TeamIssueRow[],
  subtasksByParentId: Record<string, ApiSubIssue[] | undefined>,
  overrides: TeamIssueOverrides
): TeamIssueRow[] {
  return roots.map((root) => {
    const raw = subtasksByParentId[root.id]
    if (raw !== undefined) {
      const kids = subIssuesToTeamRows(root.id, raw, overrides)
      return {
        ...root,
        subRows: kids.length > 0 ? kids : undefined,
      }
    }
    if ((root.subIssueCount ?? 0) > 0) {
      return {
        ...root,
        subRows: [teamIssueSubtaskPlaceholder(root.id)],
      }
    }
    return { ...root, subRows: undefined }
  })
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
