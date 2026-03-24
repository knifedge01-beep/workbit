import { useMemo, useState } from 'react'
import { Flame, Heart, MessageSquare, Rocket, ThumbsUp } from 'lucide-react'
import {
  CommentThread,
  type CommentItem,
  type CommentSubmitPayload,
} from '@thedatablitz/comment'

import { Tree } from '@thedatablitz/tree'
import { Avatar } from '@thedatablitz/avatar'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'

import { Inline } from '@thedatablitz/inline'
import { Card } from '@thedatablitz/card'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { TextInput } from '@thedatablitz/text-input'
import { STATUS_CONFIG } from '../../constants/projectStatus'
import { MarkdownPreview } from '@thedatablitz/markdown-editor'
import type { UpdateItem, UpdatesTreeProps } from './types'
import {
  avatarInitials,
  countAllComments,
  filterRecursive,
  QUICK_EMOJIS,
} from './utils/treeHelpers'
import { Button } from '@thedatablitz/button'

export type { UpdateItem } from './types'

type UpdatesTreeNode = {
  id: string
  label: React.ReactNode
  children?: UpdatesTreeNode[]
}

function flattenComments(items: UpdateItem[]): CommentItem[] {
  const out: CommentItem[] = []
  const walk = (nodes: UpdateItem[], parentCommentId: string | null) => {
    for (const node of nodes) {
      out.push({
        commentId: node.id,
        commentText: node.content,
        commentDate: node.timestamp,
        commentAuthor: node.author,
        commentAuthorAvatar: '',
        parentCommentId,
        likes: 0,
        mentionAuthorIds: [],
      })
      if (node.comments?.length) walk(node.comments, node.id)
    }
  }
  walk(items, null)
  return out
}

export function UpdatesTree({
  updates,
  className,
  enableSearch = true,
  onAddComment,
  onAddReaction,
  onReply,
  onReact,
}: UpdatesTreeProps) {
  const safeUpdates = useMemo(
    () => (Array.isArray(updates) ? updates : []),
    [updates]
  )

  const statusBadgeVariant = (status: NonNullable<UpdateItem['status']>) => {
    if (status === 'on-track') return 'success'
    if (status === 'at-risk') return 'warning'
    return 'danger'
  }

  const [query, setQuery] = useState('')
  const [composerById, setComposerById] = useState<Record<string, boolean>>({})
  const [submittingById, setSubmittingById] = useState<Record<string, boolean>>(
    {}
  )
  const [localReactionsByNodeId, setLocalReactionsByNodeId] = useState<
    Record<string, Record<string, number>>
  >({})

  const filteredUpdates = useMemo(() => {
    const result = !query.trim()
      ? safeUpdates
      : safeUpdates
          .map((u) => filterRecursive(u, query))
          .filter((u): u is UpdateItem => u != null)
    return result.slice(1)
  }, [safeUpdates, query])

  const isComposerOpen = (id: string) => composerById[id] ?? false

  const openComposer = (id: string) => {
    setComposerById((prev) => ({ ...prev, [id]: true }))
  }

  const toTreeNode = (item: UpdateItem, depth = 0): UpdatesTreeNode => {
    const comments = item.comments ?? []
    const isChildNode = depth > 0
    const isUpdate = item.kind === 'update'
    const allComments = countAllComments(item)
    const existingReactions = item.reactions ?? {}
    const localReactions = localReactionsByNodeId[item.id] ?? {}

    const mergedReactions = Object.keys({
      ...existingReactions,
      ...localReactions,
    }).reduce<Record<string, number>>((acc, emoji) => {
      acc[emoji] =
        (existingReactions[emoji] ?? 0) + (localReactions[emoji] ?? 0)
      return acc
    }, {})

    const reactionCount = Object.values(mergedReactions).reduce(
      (total, count) => total + count,
      0
    )

    const handleReaction = (emoji: string) => {
      setLocalReactionsByNodeId((prev) => ({
        ...prev,
        [item.id]: {
          ...(prev[item.id] ?? {}),
          [emoji]: (prev[item.id]?.[emoji] ?? 0) + 1,
        },
      }))
      void onAddReaction?.(item, emoji)
      onReact?.(item)
    }

    const submitComment = async (payload: CommentSubmitPayload) => {
      const text = payload.commentText.trim()
      if (!text) return

      if (!onAddComment) {
        onReply?.(item)
        return
      }

      setSubmittingById((prev) => ({ ...prev, [item.id]: true }))
      try {
        await onAddComment(item, text)
      } finally {
        setSubmittingById((prev) => ({ ...prev, [item.id]: false }))
      }
    }

    return {
      id: item.id,
      label: (
        <Stack>
          {isChildNode ? (
            <div
              style={{
                borderLeft: '1px solid var(--db-color-border-default)',
                paddingLeft: 10,
              }}
            >
              <Stack gap="050">
                <Inline align="center" gap="100" wrap>
                  <Text variant="caption1" style={{ fontWeight: 600 }}>
                    {item.author}
                  </Text>
                  <Text variant="caption2" color="color.text.subtle">
                    {item.timestamp}
                  </Text>
                </Inline>
                <div style={{ margin: '2px 0 4px' }}>
                  <Box>
                    <MarkdownPreview value={item.content ?? ''} />
                  </Box>
                </div>
              </Stack>
            </div>
          ) : (
            <div style={{ padding: '16px 20px' }}>
              <Stack gap="150">
                <Inline align="center" justify="space-between" fullWidth>
                  <Inline align="center" gap="100">
                    <Avatar name={avatarInitials(item.author)} size="medium" />
                    <Stack>
                      <Text variant="body3" style={{ fontWeight: 600 }}>
                        {item.author}
                      </Text>
                      <Text variant="caption2" color="color.text.subtle">
                        {item.timestamp} • Project update
                      </Text>
                    </Stack>
                  </Inline>

                  {item.status && (
                    <Badge
                      variant={statusBadgeVariant(item.status)}
                      size="small"
                      label={STATUS_CONFIG[item.status].label}
                    />
                  )}
                </Inline>

                <Box>
                  <MarkdownPreview value={item.content ?? ''} />
                </Box>

                <div
                  style={{
                    borderTop: '1px solid var(--db-color-border-default)',
                    paddingTop: 8,
                  }}
                >
                  <Inline align="center" justify="space-between" fullWidth>
                    <Inline align="center" gap="100" wrap>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReaction(QUICK_EMOJIS[0])
                        }}
                        aria-label="Like"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: 'var(--db-color-text-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ThumbsUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReaction(QUICK_EMOJIS[1])
                        }}
                        aria-label="Love"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: 'var(--db-color-text-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Heart size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReaction(QUICK_EMOJIS[2])
                        }}
                        aria-label="Rocket"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: 'var(--db-color-text-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Rocket size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReaction(QUICK_EMOJIS[3])
                        }}
                        aria-label="Fire"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: 'var(--db-color-text-subtle)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Flame size={13} />
                      </button>
                      <Button
                        buttonType="link"
                        size="small"
                        icon={<MessageSquare size={14} />}
                        onClick={() => openComposer(item.id)}
                        aria-label="Comment"
                      >
                        {allComments} Comments
                      </Button>
                      {reactionCount > 0 && (
                        <Text variant="caption2" color="color.text.subtle">
                          {reactionCount}
                        </Text>
                      )}
                    </Inline>

                    <Button
                      buttonType="link"
                      size="small"
                      onClick={() => openComposer(item.id)}
                    >
                      View Full Thread
                    </Button>
                  </Inline>
                </div>
              </Stack>
            </div>
          )}

          {isComposerOpen(item.id) && onAddComment && (
            <Box className="max-w-[260px]!">
              <CommentThread
                comments={flattenComments(item.comments ?? [])}
                onSubmitComment={(payload) => {
                  void submitComment(payload)
                }}
                placeholder={isUpdate ? 'Add a comment...' : 'Reply...'}
                submitButtonText="Post"
                disabled={submittingById[item.id] === true}
                loading={false}
                error={false}
              />
            </Box>
          )}
        </Stack>
      ),
      children: comments.map((child) => toTreeNode(child, depth + 1)),
    }
  }

  if (safeUpdates.length === 0) {
    return (
      <Text variant="body3" color="color.text.subtle">
        No updates yet.
      </Text>
    )
  }

  if (filteredUpdates?.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      {enableSearch && (
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid var(--db-color-border-default)',
          }}
        >
          <TextInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search updates and comments"
            aria-label="Search updates"
            fullWidth
          />
        </div>
      )}

      <Box>
        <Inline align="center" justify="space-between" fullWidth wrap>
          <Text
            variant="caption2"
            color="color.text.subtle"
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Contributor & message
          </Text>
          <Text
            variant="caption2"
            color="color.text.subtle"
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Status
          </Text>
          <Text
            variant="caption2"
            color="color.text.subtle"
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Timeline
          </Text>
        </Inline>
      </Box>
      <Tree size="medium" nodes={filteredUpdates.map((u) => toTreeNode(u))} />
    </Card>
  )
}
