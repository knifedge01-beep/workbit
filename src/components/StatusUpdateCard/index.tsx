import { useState } from 'react'
import { MessageCircle, MoreHorizontal, SquarePen } from 'lucide-react'

import { Avatar, Menu, IconButton, EmojiSelector, Chat } from '@design-system'

import { STATUS_CONFIG } from '../../constants/projectStatus'
import { MarkdownPreview } from '@thedatablitz/markdown-editor'
import { ResourceSelector } from '../ResourceSelector'
import {
  Card,
  HeaderSection,
  HeaderRow,
  LatestLabel,
  MetaRow,
  StatusPill,
  AuthorName,
  Timestamp,
  MetaDivider,
  Body,
  Footer,
  CommentsButton,
  CommentsSection,
  ChatWrap,
} from './styles'
import type { StatusUpdateCardProps } from './types'
import { buildMoreItems } from './utils/buildMoreItems'
import { Button } from '@thedatablitz/button'

export type { StatusUpdateCardData } from './types'

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
}: StatusUpdateCardProps) {
  const [commentsExpanded, setCommentsExpanded] = useState(false)
  const config = STATUS_CONFIG[data.status]
  const StatusIcon = config.Icon

  const showCommentsWhenExpanded = comments.length > 0 || onSendComment != null
  const moreItems = buildMoreItems(onMore)

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
          <Avatar name={data.authorName} src={data.authorAvatarSrc} size={24} />
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

      <Body>
        <MarkdownPreview value={data.content ?? ''} />
      </Body>

      {commentsExpanded && showCommentsWhenExpanded && (
        <CommentsSection>
          <ChatWrap>
            <Chat
              messages={comments}
              currentUser={currentUser}
              placeholder="Add a comment..."
              onSend={onSendComment}
              attachSlot={
                onChooseFile || onCreateDocument || onAddLink ? (
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
            setCommentsExpanded((expanded) => !expanded)
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
