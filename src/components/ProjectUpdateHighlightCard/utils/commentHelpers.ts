import type { UpdateItem } from '../../UpdatesTree'
import type { CommentTreeItem } from '../types'

export function countAllComments(item: UpdateItem): number {
  const direct = item.comments?.length ?? 0
  if (!item.comments || item.comments.length === 0) return direct
  return (
    direct +
    item.comments.reduce((acc, child) => acc + countAllComments(child), 0)
  )
}

export function flattenComments(
  items: UpdateItem[],
  depth = 0
): CommentTreeItem[] {
  const out: CommentTreeItem[] = []
  for (const item of items) {
    out.push({ item, depth })
    if (item.comments && item.comments.length > 0) {
      out.push(...flattenComments(item.comments, depth + 1))
    }
  }
  return out
}

export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
