import { useState } from 'react'
import styled from 'styled-components'
import { MessageCircle, MoreHorizontal, SquarePen } from 'lucide-react'
import { Avatar, Button, Menu, IconButton, EmojiSelector, Chat } from '@design-system'
import type { ChatMessage, ChatUser } from '@design-system'
import { STATUS_CONFIG } from '../constants/projectStatus'
import { ResourceSelector } from './ResourceSelector'
import type { ProjectStatus } from '../constants/projectStatus'

const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
`

const HeaderSection = styled.header`
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[2]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.backgroundSubtle ?? p.theme.colors.background};
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

const LatestLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.textMuted};
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  flex-wrap: wrap;
`

const StatusPill = styled.span<{ $color: 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors[p.$color]};
`

const AuthorName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`

const Timestamp = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const MetaDivider = styled.span`
  width: 1px;
  height: 12px;
  background: ${(p) => p.theme.colors.border};
  align-self: center;
  flex-shrink: 0;
`

const Body = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

const CommentsButton = styled(Button)`
  font-size: 0.8125rem;
`

const CommentsSection = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  min-height: 120px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
`

const ChatWrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

export type StatusUpdateCardData = {
  id: string
  status: ProjectStatus
  authorName: string
  authorAvatarSrc?: string
  timestamp: string
  content: string
  commentCount?: number
}

type Props = {
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

export function StatusUpdateCard({
  data,
  comments = [],
  currentUser,
  onNewUpdate,
  onCommentsClick,
  onSendComment,
  onChooseFile,
  onCreateDocument,
  onAddLink,
  onMore,
  className,
}: Props) {
  const [commentsExpanded, setCommentsExpanded] = useState(false)
  const config = STATUS_CONFIG[data.status]
  const StatusIcon = config.Icon

  const showCommentsWhenExpanded =
    comments.length > 0 || onSendComment != null

  const moreItems = onMore
    ? [
        { id: 'edit', label: 'Edit', onClick: () => onMore('edit') },
        { id: 'delete', label: 'Delete', onClick: () => onMore('delete') },
      ]
    : []

  return (
    <Card className={className}>
      <HeaderSection>
        <HeaderRow>
          <LatestLabel>Latest update</LatestLabel>
          {onNewUpdate && (
            <Button variant="ghost" size="sm" onClick={onNewUpdate}>
              <SquarePen size={16} style={{ flexShrink: 0 }} />
              New update
            </Button>
          )}
        </HeaderRow>
        <MetaRow>
          <StatusPill $color={config.color as 'success' | 'warning' | 'error'}>
            <StatusIcon size={14} />
            {config.label}
          </StatusPill>
          <MetaDivider aria-hidden />
          <Avatar
            name={data.authorName}
            src={data.authorAvatarSrc}
            size={24}
          />
          <AuthorName>{data.authorName}</AuthorName>
          <Timestamp>{data.timestamp}</Timestamp>
          {moreItems.length > 0 && (
            <Menu
              trigger={
                <IconButton aria-label="More options for this update">
                  <MoreHorizontal size={16} />
                </IconButton>
              }
              items={moreItems}
            />
          )}
        </MetaRow>
      </HeaderSection>

      <Body>{data.content}</Body>

      {commentsExpanded && showCommentsWhenExpanded && (
        <CommentsSection>
          <ChatWrap>
            <Chat
              messages={comments}
              currentUser={currentUser}
              placeholder="Add a comment..."
              onSend={onSendComment}
              attachSlot={
                (onChooseFile || onCreateDocument || onAddLink) ? (
                  <ResourceSelector
                    label=""
                    triggerLabel=""
                    onChooseFile={onChooseFile}
                    onCreateDocument={onCreateDocument}
                    onAddLink={onAddLink}
                  />
                ) : undefined
              }
            />
          </ChatWrap>
        </CommentsSection>
      )}

      <Footer>
        <CommentsButton
          variant="outline"
          size="sm"
          onClick={() => {
            setCommentsExpanded((e) => !e)
            onCommentsClick?.()
          }}
          aria-label={`${data.commentCount ?? comments.length ?? 0} comments`}
          aria-expanded={commentsExpanded}
        >
          <MessageCircle size={14} style={{ marginRight: 4 }} />
          {data.commentCount ?? comments.length} comments
        </CommentsButton>
        <EmojiSelector placement="top" />
      </Footer>
    </Card>
  )
}
