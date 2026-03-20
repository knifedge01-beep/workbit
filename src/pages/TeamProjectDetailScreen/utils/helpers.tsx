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
import type { ApiStatusUpdate } from '../../../api/client'
import { formatDateTime } from '../../../utils/format'

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
