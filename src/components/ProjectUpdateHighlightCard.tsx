import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  MessageSquare,
  ThumbsUp,
  Heart,
  Rocket,
  Flame,
  Send,
} from 'lucide-react'
import { Avatar } from '@design-system'
import { STATUS_CONFIG } from '../constants/projectStatus'
import type { UpdateItem } from './UpdatesTree'
import { MarkdownContent } from './MarkdownContent'

type Props = {
  update?: UpdateItem
  onAddComment?: (item: UpdateItem, content: string) => Promise<void> | void
  onViewFullThread?: () => void
  className?: string
}

const Card = styled.article`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-left: 3px solid ${(p) => p.theme.colors.primary};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

const Inner = styled.div`
  padding: 16px 20px;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const AuthorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const AuthorMeta = styled.div`
  min-width: 0;
`

const AuthorName = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
`

const Subtitle = styled.div`
  font-size: 0.82rem;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 1px;
`

const StatusPill = styled.span<{ $tone: 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  background: ${(p) =>
    p.$tone === 'warning'
      ? p.theme.colors.warningBg
      : p.$tone === 'error'
        ? p.theme.colors.errorBg
        : p.theme.colors.successBg};
  color: ${(p) =>
    p.$tone === 'warning'
      ? p.theme.colors.warning
      : p.$tone === 'error'
        ? p.theme.colors.error
        : p.theme.colors.success};
  white-space: nowrap;
`

const Body = styled.div`
  margin: 16px 0;
  color: ${(p) => p.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;

  .wmde-markdown {
    padding: 0;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

const Reactions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

const Reaction = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const CommentsToggle = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
`

const ViewThreadButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.86rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;
`

const CommentsSection = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 12px 20px 14px;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`

const CommentItem = styled.div<{ $depth: number }>`
  border-left: ${(p) =>
    p.$depth > 0 ? `1px solid ${p.theme.colors.border}` : 'none'};
  padding-left: ${(p) => (p.$depth > 0 ? '10px' : '0')};
  margin-left: ${(p) => p.$depth * 12}px;
`

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`

const CommentAuthor = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const CommentTime = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const CommentBody = styled.div`
  margin: 0;
  font-size: 0.84rem;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.45;

  .wmde-markdown {
    padding: 0;
    font-size: 0.84rem;
    line-height: 1.45;
  }
`

const Composer = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ComposerSend = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.surface};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    color: ${(p) => p.theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 1;
  }
`

const ComposerInput = styled.textarea`
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  resize: vertical;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.84rem;
  line-height: 1.4;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surface};

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

function countAllComments(item: UpdateItem): number {
  const direct = item.comments?.length ?? 0
  if (!item.comments || item.comments.length === 0) return direct
  return (
    direct +
    item.comments.reduce((acc, child) => acc + countAllComments(child), 0)
  )
}

function flattenComments(
  items: UpdateItem[],
  depth = 0
): Array<{ item: UpdateItem; depth: number }> {
  const out: Array<{ item: UpdateItem; depth: number }> = []
  for (const item of items) {
    out.push({ item, depth })
    if (item.comments && item.comments.length > 0) {
      out.push(...flattenComments(item.comments, depth + 1))
    }
  }
  return out
}

function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function ProjectUpdateHighlightCard({
  update,
  onAddComment,
  onViewFullThread,
  className,
}: Props) {
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const commentsCount = update ? countAllComments(update) : 0

  const flattened = useMemo(
    () => flattenComments(update?.comments ?? []),
    [update?.comments]
  )

  if (!update) return null

  const statusLabel = update.status
    ? STATUS_CONFIG[update.status].label
    : 'On track'

  const statusTone: 'success' | 'warning' | 'error' =
    update.status === 'at-risk'
      ? 'warning'
      : update.status === 'off-track'
        ? 'error'
        : 'success'

  const reactionCount = Object.values(update.reactions ?? {}).reduce(
    (acc, v) => acc + v,
    0
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submitComment()
  }

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
