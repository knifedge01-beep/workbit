import { useMemo, useState } from 'react'
import { ChevronRight, MessageCircle, MessageSquare } from 'lucide-react'

import { Avatar, Badge, Button, Input, Text } from '@design-system'

import { STATUS_CONFIG } from '../../constants/projectStatus'
import { MarkdownContent } from '../MarkdownContent'
import {
  Wrap,
  SearchRow,
  Head,
  HeadCol,
  TreeList,
  TreeNode,
  NodeCard,
  NodeHeader,
  LeftMain,
  ExpandToggle,
  NodeBody,
  HeaderMeta,
  Author,
  MessagePreview,
  StatusCol,
  TimeCol,
  TimeText,
  CommentMeta,
  Collapsible,
  CollapsibleInner,
  NodeContent,
  ExpandedBody,
  ActionRow,
  ActionButton,
  ReactionsRow,
  ReactionButton,
  Composer,
  ComposerAvatar,
  ComposerInput,
  ChildrenWrap,
} from './styles'
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

export function UpdatesTree({
  updates,
  className,
  enableSearch = true,
  onAddComment,
  onAddReaction,
  onReply,
  onReact,
}: UpdatesTreeProps) {
  const [query, setQuery] = useState('')
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({})
  const [composerById, setComposerById] = useState<Record<string, boolean>>({})
  const [draftById, setDraftById] = useState<Record<string, string>>({})
  const [submittingById, setSubmittingById] = useState<Record<string, boolean>>(
    {}
  )
  const [localReactionsByNodeId, setLocalReactionsByNodeId] = useState<
    Record<string, Record<string, number>>
  >({})

  const filteredUpdates = useMemo(() => {
    if (!query.trim()) return updates
    return updates
      .map((u) => filterRecursive(u, query))
      .filter((u): u is UpdateItem => u != null)
  }, [updates, query])

  const isExpanded = (id: string) => expandedById[id] ?? false
  const isComposerOpen = (id: string) => composerById[id] ?? false

  const toggle = (id: string) => {
    setExpandedById((prev) => ({ ...prev, [id]: !isExpanded(id) }))
  }

  const openComposer = (id: string) => {
    setExpandedById((prev) => ({ ...prev, [id]: true }))
    setComposerById((prev) => ({ ...prev, [id]: true }))
  }

  const renderNode = (item: UpdateItem, depth = 0, isComment = false) => {
    const open = isExpanded(item.id)
    const comments = item.comments ?? []
    const hasChildren = comments.length > 0
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

    return (
      <TreeNode key={item.id} $depth={depth}>
        <NodeCard $expanded={open}>
          <NodeHeader>
            <LeftMain>
              <ExpandToggle
                type="button"
                $open={open}
                onClick={() => toggle(item.id)}
                aria-expanded={open}
                aria-label={`Toggle ${item.kind} ${item.id}`}
              >
                <ChevronRight size={15} />
              </ExpandToggle>

              {!isComment && (
                <Avatar name={avatarInitials(item.author)} size={22} />
              )}

              <NodeBody>
                <HeaderMeta>
                  <Author>{item.author}</Author>
                  <MessagePreview title={preview}>
                    {preview || 'No content'}
                  </MessagePreview>
                </HeaderMeta>
              </NodeBody>
            </LeftMain>

            <StatusCol>
              {item.status && (
                <Badge
                  variant="light"
                  color={
                    item.status === 'on-track'
                      ? 'green'
                      : item.status === 'at-risk'
                        ? 'orange'
                        : 'red'
                  }
                  size="small"
                >
                  {STATUS_CONFIG[item.status].label.toUpperCase()}
                </Badge>
              )}
            </StatusCol>

            <TimeCol>
              <TimeText>{item.timestamp}</TimeText>
              <CommentMeta>
                <MessageSquare size={13} />
                {allComments}
              </CommentMeta>
            </TimeCol>
          </NodeHeader>

          <Collapsible $open={open}>
            <CollapsibleInner>
              <ExpandedBody>
                <NodeContent>
                  <MarkdownContent content={item.content} />
                </NodeContent>

                <ActionRow>
                  <ActionButton
                    type="button"
                    onClick={() => openComposer(item.id)}
                    aria-label={item.kind === 'update' ? 'Comment' : 'Reply'}
                  >
                    <MessageCircle size={13} />
                    {item.kind === 'update' ? 'Comment' : 'Reply'}
                  </ActionButton>

                  <ReactionsRow>
                    {QUICK_EMOJIS.map((emoji) => (
                      <ReactionButton
                        key={`${item.id}-${emoji}`}
                        type="button"
                        onClick={() => handleReaction(emoji)}
                        aria-label={`React ${EMOJI_LABEL[emoji]}`}
                      >
                        {EMOJI_ICON[emoji]} {mergedReactions[emoji] ?? 0}
                      </ReactionButton>
                    ))}
                  </ReactionsRow>

                  <ActionButton
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-label="Collapse"
                  >
                    Collapse
                  </ActionButton>
                </ActionRow>

                {(open || isComposerOpen(item.id)) && onAddComment && (
                  <Composer onSubmit={handleSubmitComposer}>
                    <ComposerAvatar>
                      <Avatar name="ME" size={18} />
                    </ComposerAvatar>
                    <ComposerInput
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
                      aria-label={`Compose ${item.kind === 'update' ? 'comment' : 'reply'}`}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        submittingById[item.id] === true ||
                        !(draftById[item.id] ?? '').trim()
                      }
                    >
                      {submittingById[item.id] === true ? 'Posting...' : 'Post'}
                    </Button>
                  </Composer>
                )}

                {hasChildren && (
                  <ChildrenWrap>
                    <TreeList>
                      {comments.map((child) =>
                        renderNode(child, depth + 1, child.kind === 'comment')
                      )}
                    </TreeList>
                  </ChildrenWrap>
                )}
              </ExpandedBody>
            </CollapsibleInner>
          </Collapsible>
        </NodeCard>
      </TreeNode>
    )
  }

  if (updates.length === 0) {
    return (
      <Text size="sm" muted>
        No updates yet.
      </Text>
    )
  }

  return (
    <Wrap className={className}>
      {enableSearch && (
        <SearchRow>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search updates and comments"
            aria-label="Search updates"
          />
        </SearchRow>
      )}

      <Head>
        <HeadCol>Contributor & message</HeadCol>
        <HeadCol>Status</HeadCol>
        <HeadCol>Timeline</HeadCol>
      </Head>

      <TreeList role="tree">
        {filteredUpdates.map((u) => renderNode(u, 0))}
      </TreeList>
    </Wrap>
  )
}
