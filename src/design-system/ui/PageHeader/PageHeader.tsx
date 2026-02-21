import styled from 'styled-components'
import { Box } from 'lucide-react'

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing[3]}px;
  padding: ${(p) => p.theme.spacing[4]}px;
  color: #000000;
  /* Only break out horizontally so the header isn't clipped by overflow on the scroll container */
  margin: 0 -24px 24px -24px;
`

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.08);
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  color: rgba(0, 0, 0, 0.9);
`

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 0;
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: #000000;
`

const Summary = styled.p<{ $placeholder?: boolean }>`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.6);
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

export function PageHeader({
  title,
  summary = '',
  icon,
  className,
}: Props) {
  const showPlaceholder = summary.trim() === ''
  const displaySummary = showPlaceholder ? SUMMARY_PLACEHOLDER : summary

  return (
    <Header className={className}>
      <IconWrap>
        {icon ?? <Box size={24} strokeWidth={1.5} />}
      </IconWrap>
      <TextBlock>
        <Title>{title}</Title>
        <Summary $placeholder={showPlaceholder}>{displaySummary}</Summary>
      </TextBlock>
    </Header>
  )
}
