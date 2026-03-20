import { useMemo, useState, type FormEvent } from 'react'
import {
  MessageSquare,
  ThumbsUp,
  Heart,
  Rocket,
  Flame,
  Send,
} from 'lucide-react'

import { Avatar } from '@design-system'

import { MarkdownContent } from '../MarkdownContent'
import type { ProjectUpdateHighlightCardProps } from './types'
import {
  avatarInitials,
  countAllComments,
  flattenComments,
} from './utils/commentHelpers'
import { getReactionCount, getStatusLabel, getStatusTone } from './utils/status'
import {
  Card,
  Inner,
  TopRow,
  AuthorWrap,
  AuthorMeta,
  AuthorName,
  Subtitle,
  StatusPill,
  Body,
  Footer,
  Reactions,
  Reaction,
  CommentsToggle,
  ViewThreadButton,
  CommentsSection,
  CommentList,
  CommentItem,
  CommentHeader,
  CommentAuthor,
  CommentTime,
  CommentBody,
  Composer,
  ComposerInput,
  ComposerSend,
} from './styles'

export function ProjectUpdateHighlightCard({
  update,
  onAddComment,
  onViewFullThread,
  className,
}: ProjectUpdateHighlightCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const commentsCount = update ? countAllComments(update) : 0

  const flattened = useMemo(
    () => flattenComments(update?.comments ?? []),
    [update?.comments]
  )

  if (!update) return null

  const statusLabel = getStatusLabel(update)
  const statusTone = getStatusTone(update)
  const reactionCount = getReactionCount(update)

  const submitComment = async () => {
    const content = draft.trim()
    if (!content || !onAddComment) return
    setSubmitting(true)
    try {
      await onAddComment(update, content)
      setDraft('')
      setShowComments(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submitComment()
  }

  return (
    <Card className={className}>
      <Inner>
        <TopRow>
          <AuthorWrap>
            <Avatar name={avatarInitials(update.author)} size={32} />
            <AuthorMeta>
              <AuthorName>{update.author}</AuthorName>
              <Subtitle>{update.timestamp} • Project update</Subtitle>
            </AuthorMeta>
          </AuthorWrap>

          <StatusPill $tone={statusTone}>{statusLabel}</StatusPill>
        </TopRow>

        <Body>
          <MarkdownContent content={update.content} />
        </Body>

        <Footer>
          <Reactions>
            <Reaction>
              <ThumbsUp size={13} />
            </Reaction>
            <Reaction>
              <Heart size={13} />
            </Reaction>
            <Reaction>
              <Rocket size={13} />
            </Reaction>
            <Reaction>
              <Flame size={13} />
            </Reaction>
            <CommentsToggle
              type="button"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageSquare size={14} />
              {commentsCount} Comments
            </CommentsToggle>
            {reactionCount > 0 && <Reaction>{reactionCount}</Reaction>}
          </Reactions>

          <ViewThreadButton type="button" onClick={onViewFullThread}>
            View Full Thread
          </ViewThreadButton>
        </Footer>
      </Inner>

      {showComments && (
        <CommentsSection>
          {flattened.length > 0 && (
            <CommentList>
              {flattened.map(({ item, depth }) => (
                <CommentItem key={item.id} $depth={depth}>
                  <CommentHeader>
                    <CommentAuthor>{item.author}</CommentAuthor>
                    <CommentTime>{item.timestamp}</CommentTime>
                  </CommentHeader>
                  <CommentBody>
                    <MarkdownContent content={item.content} />
                  </CommentBody>
                </CommentItem>
              ))}
            </CommentList>
          )}

          <Composer onSubmit={handleSubmit}>
            <ComposerInput
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment or reply..."
              aria-label="Create comment"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!submitting && draft.trim()) {
                    void submitComment()
                  }
                }
              }}
            />
            <ComposerSend
              type="submit"
              aria-label="Send comment"
              title="Send"
              disabled={submitting || !draft.trim()}
            >
              <Send size={14} />
            </ComposerSend>
          </Composer>
        </CommentsSection>
      )}
    </Card>
  )
}
