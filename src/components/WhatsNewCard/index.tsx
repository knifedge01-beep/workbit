import { Heading, Text } from '@design-system'

import { StyledCard } from './styles'
import type { WhatsNewCardProps } from './types'

export function WhatsNewCard({ inline = false }: WhatsNewCardProps) {
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
