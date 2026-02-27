import styled from 'styled-components'
import { AlertCircle } from 'lucide-react'
import { Stack } from '@design-system'

const Container = styled.div<{ $fullHeight?: boolean }>`
  padding: ${(p) => p.theme.spacing[9]}px;
  text-align: center;
  ${(p) =>
    p.$fullHeight &&
    `
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

const Message = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.error || '#ef4444'};
`

const IconWrapper = styled.div`
  color: ${(p) => p.theme.colors.error || '#ef4444'};
`

interface Props {
  message?: string
  error?: string | null
  fullHeight?: boolean
}

export function ErrorState({ message, error, fullHeight }: Props) {
  const displayMessage = error || message || 'An error occurred'

  return (
    <Container $fullHeight={fullHeight}>
      <Stack direction="vertical" gap={3}>
        <IconWrapper>
          <AlertCircle size={24} />
        </IconWrapper>
        <Message>{displayMessage}</Message>
      </Stack>
    </Container>
  )
}
