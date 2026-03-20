import type { ProjectStatus } from '../../../constants/projectStatus'

export type UpdateItem = {
  id: string
  kind: 'update' | 'comment'
  updateId: string
  parentId?: string | null
  content: string
  author: string
  timestamp: string
  status?: ProjectStatus
  reactions?: Record<string, number>
  comments?: UpdateItem[]
}

export type UpdatesTreeProps = {
  updates: UpdateItem[]
  className?: string
  enableSearch?: boolean
  onAddComment?: (item: UpdateItem, content: string) => Promise<void> | void
  onAddReaction?: (item: UpdateItem, emoji: string) => Promise<void> | void
  onReply?: (item: UpdateItem) => void
  onReact?: (item: UpdateItem) => void
}
