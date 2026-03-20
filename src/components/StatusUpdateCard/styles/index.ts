import styled from 'styled-components'

import { Button } from '@design-system'

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  overflow: hidden;
`

export const HeaderSection = styled.header`
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[3]}px
    ${(p) => p.theme.spacing[2]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) =>
    p.theme.colors.backgroundSubtle ?? p.theme.colors.background};
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

export const LatestLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.textMuted};
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  flex-wrap: wrap;
`

export const StatusPill = styled.span<{
  $color: 'success' | 'warning' | 'error'
}>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors[p.$color]};
`

export const AuthorName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
`

export const Timestamp = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
`

export const MetaDivider = styled.span`
  width: 1px;
  height: 12px;
  background: ${(p) => p.theme.colors.border};
  align-self: center;
  flex-shrink: 0;
`

export const Body = styled.div`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  line-height: 1.5;
  word-break: break-word;

  .wmde-markdown {
    padding: 0;
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

export const CommentsButton = styled(Button)`
  font-size: 0.8125rem;
`

export const CommentsSection = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  min-height: 120px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
`

export const ChatWrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`
