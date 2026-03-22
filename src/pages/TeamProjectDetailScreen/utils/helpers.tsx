import {
  Circle,
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
} from 'lucide-react'
import type {
  StatusUpdateCardData,
  UpdateItem,
  PriorityOption,
} from '../../../components'
import type { ApiStatusUpdate, ApiSubIssue } from '../../../api/client'
import { formatDateTime } from '../../../utils/format'
import type { ProjectDetailIssueRow } from '../types'

export const DEFAULT_STATUS = 'todo'
export const DEFAULT_PRIORITY = 'none'

export const INLINE_PRIORITY_OPTIONS: PriorityOption[] = [
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

export function apiUpdateToCard(u: ApiStatusUpdate): StatusUpdateCardData {
  return {
    id: u.id,
    status: u.status,
    authorName: u.author.name,
    timestamp: formatDateTime(u.createdAt),
    content: u.content,
    commentCount: u.commentCount,
  }
}

export function subIssuesToProjectDetailRows(
  parentIssueId: string,
  subs: ApiSubIssue[],
  overrides: Record<string, { status?: string; priority?: string }>
): ProjectDetailIssueRow[] {
  return subs.map((s) => ({
    id: s.id,
    title: s.title,
    status: overrides[s.id]?.status ?? s.status ?? DEFAULT_STATUS,
    priority: overrides[s.id]?.priority ?? DEFAULT_PRIORITY,
    dateLabel: formatDateTime(s.date),
    assigneeInitials: '',
    parentIssueId,
    assignee: null,
    subIssueCount: 0,
    depth: 1,
    isSubtaskRow: true,
  }))
}

function projectDetailSubtaskPlaceholder(
  parentId: string
): ProjectDetailIssueRow {
  return {
    id: `${parentId}:__loading`,
    title: 'Loading…',
    status: DEFAULT_STATUS,
    priority: DEFAULT_PRIORITY,
    dateLabel: '',
    assigneeInitials: '',
    parentIssueId: parentId,
    assignee: null,
    subIssueCount: 0,
    depth: 1,
    isSubtaskRow: true,
    __placeholder: true,
  }
}

export function buildProjectIssueTreeData(
  roots: ProjectDetailIssueRow[],
  subtasksByParentId: Record<string, ApiSubIssue[] | undefined>,
  overrides: Record<string, { status?: string; priority?: string }>
): ProjectDetailIssueRow[] {
  return roots.map((root) => {
    const raw = subtasksByParentId[root.id]
    if (raw !== undefined) {
      const kids = subIssuesToProjectDetailRows(root.id, raw, overrides)
      return {
        ...root,
        subRows: kids.length > 0 ? kids : undefined,
      }
    }
    return {
      ...root,
      subRows: [projectDetailSubtaskPlaceholder(root.id)],
    }
  })
}

export function appendChildNode(
  nodes: UpdateItem[],
  parentId: string,
  child: UpdateItem
): UpdateItem[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        comments: [...(node.comments ?? []), child],
      }
    }

    if (!node.comments || node.comments.length === 0) return node

    return {
      ...node,
      comments: appendChildNode(node.comments, parentId, child),
    }
  })
}
