import styled from 'styled-components'
import { Box } from '@thedatablitz/box'

export const Container = styled(Box)`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

export const Inner = styled.div`
  padding: 16px 20px;
`

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const AuthorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

export const AuthorMeta = styled.div`
  min-width: 0;
`

export const AuthorName = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.2;
`

export const Subtitle = styled.div`
  font-size: 0.82rem;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 1px;
`

export const StatusPill = styled.span<{
  $tone: 'success' | 'warning' | 'error'
}>`
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

export const Body = styled.div`
  margin: 16px 0;
  color: ${(p) => p.theme.colors.text};
  font-size: 1rem;
  line-height: 1.5;

  .wmde-markdown {
    padding: 0;
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

export const Reactions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const Reaction = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: ${(p) => p.theme.colors.textMuted};
`

export const CommentsToggle = styled.button`
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

export const ViewThreadButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.86rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
  cursor: pointer;
`

export const CommentsSection = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 12px 20px 14px;
`

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
`

export const CommentItem = styled.div<{ $depth: number }>`
  border-left: ${(p) =>
    p.$depth > 0 ? `1px solid ${p.theme.colors.border}` : 'none'};
  padding-left: ${(p) => (p.$depth > 0 ? '10px' : '0')};
  margin-left: ${(p) => p.$depth * 12}px;
`

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`

export const CommentAuthor = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

export const CommentTime = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
`

export const CommentBody = styled.div`
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

export const Composer = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ComposerSend = styled.button`
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

export const ComposerInput = styled.textarea`
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
