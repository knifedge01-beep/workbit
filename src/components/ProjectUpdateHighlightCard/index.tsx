import { useMemo, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import {
  CommentThread,
  type CommentItem,
  type CommentSubmitPayload,
} from '@thedatablitz/comment'

import { Avatar } from '@thedatablitz/avatar'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'

import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Card } from '@thedatablitz/card'

import { MarkdownPreview } from '@thedatablitz/markdown-editor'
import type { ProjectUpdateHighlightCardProps } from './types'
import {
  avatarInitials,
  countAllComments,
  flattenComments as flattenTreeComments,
} from './utils/commentHelpers'
import { getReactionCount, getStatusLabel, getStatusTone } from './utils/status'

import { Button } from '@thedatablitz/button'

export function ProjectUpdateHighlightCard({
  update,
  onAddComment,
}: ProjectUpdateHighlightCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const commentsCount = update ? countAllComments(update) : 0

  const flattened = useMemo(
    () => flattenTreeComments(update?.comments ?? []),
    [update?.comments]
  )
  const commentItems = useMemo<CommentItem[]>(
    () =>
      flattened.map(({ item }) => ({
        commentId: item.id,
        commentText: item.content,
        commentDate: item.timestamp,
        commentAuthor: item.author,
        commentAuthorAvatar: '',
        parentCommentId:
          !item.parentId || item.parentId === update?.id ? null : item.parentId,
        likes: 0,
        mentionAuthorIds: [],
      })),
    [flattened, update?.id]
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

  const submitComment = async (payload: CommentSubmitPayload) => {
    const content = payload.commentText.trim()
    if (!content || !onAddComment) return
    setSubmitting(true)
    try {
      await onAddComment(update, content)
      setShowComments(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack gap="050">
      <Text variant="heading6" color="color.text.information">
        Latest Project Update
      </Text>
      <Card>
        <Box>
          <Inline align="center" justify="space-between" fullWidth>
            <Inline align="center" gap="100">
              <Avatar name={avatarInitials(update.author)} size="medium" />
              <Box>
                <Stack gap="025">
                  <Text variant="body3" style={{ fontWeight: 600 }}>
                    {update.author}
                  </Text>
                  <Text variant="caption2" color="color.text.subtle">
                    {update.timestamp} • Project update
                  </Text>
                </Stack>
              </Box>
            </Inline>

            <Badge
              size="small"
              variant={statusBadgeVariant}
              label={statusLabel}
            />
          </Inline>
        </Box>

        <MarkdownPreview value={update.content ?? ''} />

        <Inline align="center" gap="100">
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
        </Inline>

        {showComments && (
          <CommentThread
            comments={commentItems}
            onSubmitComment={(payload) => {
              void submitComment(payload)
            }}
            placeholder="Add a comment or reply..."
            submitButtonText="Post"
            loading={false}
            disabled={submitting}
            error={false}
          />
        )}
      </Card>
    </Stack>
  )
}
