import type { ChatMessage, ChatUser } from '@design-system'

import type { ProjectStatus } from '../../../constants/projectStatus'

export type StatusUpdateCardData = {
  id: string
  status: ProjectStatus
  authorName: string
  authorAvatarSrc?: string
  timestamp: string
  content: string
  commentCount?: number
}

export type StatusUpdateCardProps = {
  data: StatusUpdateCardData
  /** Comments to show in the expandable chat thread. */
  comments?: ChatMessage[]
  /** Current user for the chat reply input. */
  currentUser?: ChatUser
  onNewUpdate?: () => void
  onCommentsClick?: () => void
  /** Called when the user sends a new comment. */
  onSendComment?: (text: string) => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
  onMore?: (action: 'edit' | 'delete') => void
  className?: string
}
