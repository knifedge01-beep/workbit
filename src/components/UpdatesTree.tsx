import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  ChevronRight,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  Flame,
  Zap,
  Smile,
} from 'lucide-react'
import { Avatar, Badge, Button, Input, Text } from '@design-system'
import { STATUS_CONFIG, type ProjectStatus } from '../constants/projectStatus'
import { MarkdownContent } from './MarkdownContent'

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

type Props = {
  updates: UpdateItem[]
  className?: string
  enableSearch?: boolean
  onAddComment?: (item: UpdateItem, content: string) => Promise<void> | void
  onAddReaction?: (item: UpdateItem, emoji: string) => Promise<void> | void
  onReply?: (item: UpdateItem) => void
  onReact?: (item: UpdateItem) => void
}

const Wrap = styled.section`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

const SearchRow = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const Head = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) 120px 120px;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceSecondary};

  @media (max-width: 980px) {
    grid-template-columns: minmax(280px, 1fr) 110px 100px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`

const HeadCol = styled.div`
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.textMuted};
`

const TreeList = styled.div`
  display: flex;
  flex-direction: column;
`

const TreeNode = styled.div<{ $depth: number }>`
  position: relative;
  margin-left: ${(p) => p.$depth * 18}px;
  padding-left: ${(p) => (p.$depth > 0 ? '12px' : '0')};
  border-top: 1px solid ${(p) => p.theme.colors.border};

  ${(p) =>
    p.$depth > 0 &&
    `
      border-left: 1px solid ${p.theme.colors.border};
    `}
`

const NodeCard = styled.div<{ $expanded: boolean }>`
  border-radius: 0;
  background: ${(p) =>
    p.$expanded ? p.theme.colors.surfaceSecondary : p.theme.colors.surface};
  transition: background 0.15s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
  }
`

const NodeHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) 120px 120px;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;

  @media (max-width: 980px) {
    grid-template-columns: minmax(280px, 1fr) 110px 100px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`

const LeftMain = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ExpandToggle = styled.button<{ $open: boolean }>`
  border: none;
  background: transparent;
  padding: 0;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    transform: ${(p) => (p.$open ? 'rotate(90deg)' : 'rotate(0deg)')};
    transition: transform 0.15s ease;
  }
`

const NodeBody = styled.div`
  min-width: 0;
  flex: 1;
`

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const Author = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const MessagePreview = styled.span`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StatusCol = styled.div`
  display: flex;
  align-items: center;
`

const TimeCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`

const TimeText = styled.span`
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const CommentMeta = styled.span`
  font-size: 0.76rem;
  color: ${(p) => p.theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const Collapsible = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${(p) => (p.$open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.18s ease;
`

const CollapsibleInner = styled.div`
  overflow: hidden;
`

const NodeContent = styled.div`
  margin: 0;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.5;

  .wmde-markdown {
    padding: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`

const ExpandedBody = styled.div`
  padding: 0 12px 12px 40px;
`

const ActionRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    color: ${(p) => p.theme.colors.text};
  }
`

const ReactionsRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const ReactionButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  border-radius: 999px;
  font-size: 0.75rem;
  padding: 4px 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceSecondary};
  }
`

const Composer = styled.form`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const ComposerAvatar = styled.div`
  flex-shrink: 0;
`

const ComposerInput = styled.textarea`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
  line-height: 1.4;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
  min-height: 40px;
`

const ChildrenWrap = styled.div`
  margin-top: 10px;
  border-left: 1px solid ${(p) => p.theme.colors.border};
  padding-left: 8px;
`

function firstLine(input: string): string {
  return (input ?? '').split('\n')[0] || ''
}

function countAllComments(item: UpdateItem): number {
  const direct = item.comments?.length ?? 0
  if (!item.comments || item.comments.length === 0) return direct
  return direct + item.comments.reduce((acc, c) => acc + countAllComments(c), 0)
}

function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function filterRecursive(item: UpdateItem, term: string): UpdateItem | null {
  if (term.trim() === '') return item
  const q = term.trim().toLowerCase()
  const hit =
    item.content.toLowerCase().includes(q) ||
    item.author.toLowerCase().includes(q) ||
    item.timestamp.toLowerCase().includes(q) ||
    (item.status
      ? STATUS_CONFIG[item.status].label.toLowerCase().includes(q)
      : false)
  const filteredChildren = (item.comments ?? [])
    .map((child) => filterRecursive(child, q))
    .filter((child): child is UpdateItem => child != null)

  if (hit || filteredChildren.length > 0) {
    return { ...item, comments: filteredChildren }
  }
  return null
}

export function UpdatesTree({
  updates,
  className,
  enableSearch = true,
  onAddComment,
  onAddReaction,
  onReply,
  onReact,
}: Props) {
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

  const quickEmojis = ['thumbs-up', 'fire', 'zap', 'smile'] as const

  const emojiIcon = {
    'thumbs-up': <ThumbsUp size={13} />,
    fire: <Flame size={13} />,
    zap: <Zap size={13} />,
    smile: <Smile size={13} />,
  }

  const emojiLabel = {
    'thumbs-up': 'Like',
    fire: 'Fire',
    zap: 'Zap',
    smile: 'Smile',
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
                    {quickEmojis.map((emoji) => (
                      <ReactionButton
                        key={`${item.id}-${emoji}`}
                        type="button"
                        onClick={() => handleReaction(emoji)}
                        aria-label={`React ${emojiLabel[emoji]}`}
                      >
                        {emojiIcon[emoji]} {mergedReactions[emoji] ?? 0}
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
