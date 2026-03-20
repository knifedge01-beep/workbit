import { useMemo, useState, type FormEvent } from 'react'
import {
  MessageSquare,
  ThumbsUp,
  Heart,
  Rocket,
  Flame,
  Send,
} from 'lucide-react'

import { Avatar } from '@thedatablitz/avatar'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Card } from '@thedatablitz/card'
import { TextInput } from '@thedatablitz/text-input'

import { MarkdownContent } from '../MarkdownContent'
import type { ProjectUpdateHighlightCardProps } from './types'
import {
  avatarInitials,
  countAllComments,
  flattenComments,
} from './utils/commentHelpers'
import { getReactionCount, getStatusLabel, getStatusTone } from './utils/status'
import {
  Inner,
  TopRow,
  AuthorWrap,
  AuthorMeta,
  Body,
  Footer,
  Reactions,
  Reaction,
  CommentsSection,
  CommentList,
  CommentItem,
  CommentHeader,
  CommentBody,
  Composer,
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
  const statusBadgeVariant =
    statusTone === 'success'
      ? 'success'
      : statusTone === 'warning'
        ? 'warning'
        : 'danger'

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
    <Card border className={className}>
      <Inner>
        <TopRow>
          <Inline align="center" justify="space-between" fullWidth>
            <AuthorWrap>
              <Avatar name={avatarInitials(update.author)} size="medium" />
              <AuthorMeta>
                <Stack gap="025">
                  <Text variant="body3" style={{ fontWeight: 600 }}>
                    {update.author}
                  </Text>
                  <Text variant="caption2" color="color.text.subtle">
                    {update.timestamp} • Project update
                  </Text>
                </Stack>
              </AuthorMeta>
            </AuthorWrap>

            <Badge
              size="small"
              variant={statusBadgeVariant}
              label={statusLabel}
            />
          </Inline>
        </TopRow>

        <Body>
          <MarkdownContent content={update.content} />
        </Body>

        <Footer>
          <Inline align="center" justify="space-between" fullWidth>
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
              <Button
                buttonType="link"
                size="small"
                icon={<MessageSquare size={14} />}
                onClick={() => setShowComments((prev) => !prev)}
              >
                {commentsCount} Comments
              </Button>
              {reactionCount > 0 && (
                <Box>
                  <Text variant="caption2" color="color.text.subtle">
                    {reactionCount}
                  </Text>
                </Box>
              )}
            </Reactions>

            <Button buttonType="link" size="small" onClick={onViewFullThread}>
              View Full Thread
            </Button>
          </Inline>
        </Footer>
      </Inner>

      {showComments && (
        <CommentsSection>
          {flattened.length > 0 && (
            <CommentList>
              {flattened.map(({ item, depth }) => (
                <CommentItem key={item.id} $depth={depth}>
                  <CommentHeader>
                    <Inline align="center" gap="100">
                      <Text variant="caption1" style={{ fontWeight: 600 }}>
                        {item.author}
                      </Text>
                      <Text variant="caption2" color="color.text.subtle">
                        {item.timestamp}
                      </Text>
                    </Inline>
                  </CommentHeader>
                  <CommentBody>
                    <MarkdownContent content={item.content} />
                  </CommentBody>
                </CommentItem>
              ))}
            </CommentList>
          )}

          <Composer onSubmit={handleSubmit}>
            <TextInput
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
            <Button
              buttonType="icon"
              size="small"
              icon={<Send size={14} />}
              onClick={() => void submitComment()}
              aria-label="Send comment"
              title="Send"
              disabled={submitting || !draft.trim()}
            />
          </Composer>
        </CommentsSection>
      )}
    </Card>
  )
}
