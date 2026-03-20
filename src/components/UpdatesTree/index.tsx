import { useMemo, useState } from 'react'
import { MessageCircle, MessageSquare } from 'lucide-react'

import { Tree } from '@thedatablitz/tree'
import { Avatar } from '@thedatablitz/avatar'
import { Badge } from '@thedatablitz/badge'
import { Box } from '@thedatablitz/box'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { TextInput as Input } from '@thedatablitz/text-input'
import { STATUS_CONFIG } from '../../constants/projectStatus'
import { MarkdownContent } from '../MarkdownContent'
import type { UpdateItem, UpdatesTreeProps } from './types'
import {
  avatarInitials,
  countAllComments,
  EMOJI_ICON,
  EMOJI_LABEL,
  filterRecursive,
  firstLine,
  QUICK_EMOJIS,
} from './utils/treeHelpers'

export type { UpdateItem } from './types'

type UpdatesTreeNode = {
  id: string
  label: React.ReactNode
  children?: UpdatesTreeNode[]
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
  const [draftById, setDraftById] = useState<Record<string, string>>({})
  const [submittingById, setSubmittingById] = useState<Record<string, boolean>>(
    {}
  )
  const [localReactionsByNodeId, setLocalReactionsByNodeId] = useState<
    Record<string, Record<string, number>>
  >({})

  const filteredUpdates = useMemo(() => {
    if (!query.trim()) return safeUpdates
    return safeUpdates
      .map((u) => filterRecursive(u, query))
      .filter((u): u is UpdateItem => u != null)
  }, [safeUpdates, query])

  const isComposerOpen = (id: string) => composerById[id] ?? false

  const openComposer = (id: string) => {
    setComposerById((prev) => ({ ...prev, [id]: true }))
  }

  const toTreeNode = (item: UpdateItem): UpdatesTreeNode => {
    const comments = item.comments ?? []
    const preview = firstLine(item.content)
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

    const handleSubmitComposer = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
      const text = (draftById[item.id] ?? '').trim()
      if (!text) return

      if (!onAddComment) {
        onReply?.(item)
        return
      }

      setSubmittingById((prev) => ({ ...prev, [item.id]: true }))
      try {
        await onAddComment(item, text)
        setDraftById((prev) => ({ ...prev, [item.id]: '' }))
      } finally {
        setSubmittingById((prev) => ({ ...prev, [item.id]: false }))
      }
    }

    return {
      id: item.id,
      label: (
        <Stack gap="100">
          <Inline align="center" justify="space-between" fullWidth>
            <Inline align="center" gap="100" fullWidth>
              <Avatar name={avatarInitials(item.author)} size="small" />
              <Stack gap="050" fullWidth>
                <Text variant="body3" style={{ fontWeight: 600 }}>
                  {item.author}
                </Text>
                <Text variant="body4" color="color.text.subtle" truncate>
                  {preview || 'No content'}
                </Text>
              </Stack>
            </Inline>

            <Inline align="center" gap="100">
              {item.status && (
                <Badge
                  variant={statusBadgeVariant(item.status)}
                  size="small"
                  label={STATUS_CONFIG[item.status].label.toUpperCase()}
                />
              )}
              <Text variant="caption2" color="color.text.subtle">
                {item.timestamp}
              </Text>
              <Inline align="center" gap="050">
                <MessageSquare size={13} />
                <Text variant="caption2" color="color.text.subtle">
                  {allComments}
                </Text>
              </Inline>
            </Inline>
          </Inline>

          <Box>
            <MarkdownContent content={item.content} />
          </Box>

          <Inline gap="100" wrap>
            <Button
              variant="glass"
              size="small"
              icon={<MessageCircle size={13} />}
              onClick={() => openComposer(item.id)}
              aria-label={item.kind === 'update' ? 'Comment' : 'Reply'}
            >
              {item.kind === 'update' ? 'Comment' : 'Reply'}
            </Button>

            <Inline gap="050" wrap>
              {QUICK_EMOJIS.map((emoji) => (
                <Button
                  key={`${item.id}-${emoji}`}
                  buttonType="link"
                  size="small"
                  onClick={() => handleReaction(emoji)}
                  aria-label={`React ${EMOJI_LABEL[emoji]}`}
                >
                  {EMOJI_ICON[emoji]} {mergedReactions[emoji] ?? 0}
                </Button>
              ))}
            </Inline>
          </Inline>

          {isComposerOpen(item.id) && onAddComment && (
            <form onSubmit={handleSubmitComposer}>
              <Inline align="center" gap="100" fullWidth>
                <Box>
                  <Avatar name="ME" size="small" />
                </Box>
                <Input
                  type="text"
                  value={draftById[item.id] ?? ''}
                  onChange={(e) =>
                    setDraftById((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder={
                    item.kind === 'update'
                      ? 'Add a comment or reply...'
                      : 'Reply...'
                  }
                  fullWidth
                  size="small"
                  aria-label={`Compose ${item.kind === 'update' ? 'comment' : 'reply'}`}
                />
                <Button
                  size="small"
                  disabled={
                    submittingById[item.id] === true ||
                    !(draftById[item.id] ?? '').trim()
                  }
                >
                  {submittingById[item.id] === true ? 'Posting...' : 'Post'}
                </Button>
              </Inline>
            </form>
          )}
        </Stack>
      ),
      children: comments.map((child) => toTreeNode(child)),
    }
  }

  if (safeUpdates.length === 0) {
    return (
      <Text variant="body3" color="color.text.subtle">
        No updates yet.
      </Text>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        border: '1px solid var(--db-color-border-default)',
        borderRadius: 12,
        background: 'var(--db-color-background-neutral)',
        overflow: 'hidden',
      }}
    >
      {enableSearch && (
        <div
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid var(--db-color-border-default)',
          }}
        >
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search updates and comments"
            aria-label="Search updates"
            fullWidth
          />
        </div>
      )}

      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid var(--db-color-border-default)',
          background: 'var(--db-color-background-subtle)',
        }}
      >
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
      </div>

      <Tree size="medium" nodes={filteredUpdates.map((u) => toTreeNode(u))} />
    </div>
  )
}
