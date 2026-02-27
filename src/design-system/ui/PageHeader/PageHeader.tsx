import styled from 'styled-components'
import { Box } from 'lucide-react'

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing[4]}px;
  padding: 0;
  margin-bottom: ${(p) => p.theme.spacing[6]}px;
`

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.primaryBg};
  border-radius: ${(p) => p.theme.radii?.lg ?? 8}px;
  color: ${(p) => p.theme.colors.primary};
`

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 0;
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${(p) => p.theme.colors.text};
`

const Summary = styled.p<{ $placeholder?: boolean }>`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.textMuted};
  font-style: ${(p) => (p.$placeholder ? 'italic' : 'normal')};
`

type Props = {
  title: string
  /** Short summary or description. When empty, shows placeholder "Add a short summary..." */
  summary?: string
  /** Custom icon. Defaults to a project/box icon. */
  icon?: React.ReactNode
  className?: string
}

const SUMMARY_PLACEHOLDER = 'Add a short summary...'

export function PageHeader({ title, summary = '', icon, className }: Props) {
  const showPlaceholder = summary.trim() === ''
  const displaySummary = showPlaceholder ? SUMMARY_PLACEHOLDER : summary

  return (
    <Header className={className}>
      <IconWrap>{icon ?? <Box size={24} strokeWidth={1.5} />}</IconWrap>
      <TextBlock>
        <Title>{title}</Title>
        <Summary $placeholder={showPlaceholder}>{displaySummary}</Summary>
      </TextBlock>
    </Header>
  )
}
