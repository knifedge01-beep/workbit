import { Card, Heading, Text } from '@design-system'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.border};
  padding: ${(p) => p.theme.spacing[3]}px;
  opacity: 0.95;

  &:hover {
    opacity: 1;
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

type Props = {
  /** When true, render only content (no Card wrapper). Use inside Popup or other containers that already provide surface. */
  inline?: boolean
}

export function WhatsNewCard({ inline = false }: Props) {
  const content = (
    <>
      <Heading level={5} style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
        What&apos;s new
      </Heading>
      <Text size="xs" muted>
        Advanced filters and share issues in private teams
      </Text>
    </>
  )
  if (inline) return <>{content}</>
  return <StyledCard>{content}</StyledCard>
}
