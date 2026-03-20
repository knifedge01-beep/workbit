import type { UpdateItem } from '../../UpdatesTree'

export type ProjectUpdateHighlightCardProps = {
  update?: UpdateItem
  onAddComment?: (item: UpdateItem, content: string) => Promise<void> | void
  onViewFullThread?: () => void
}

export type CommentTreeItem = {
  item: UpdateItem
  depth: number
}

export type StatusTone = 'success' | 'warning' | 'error'
