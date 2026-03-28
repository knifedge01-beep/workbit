import styled from 'styled-components'
import { Alert } from '@thedatablitz/alert'
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
        <Alert
          variant="error"
          placement="inline"
          description={displayMessage}
          className="max-w-md text-left"
        />
      </Stack>
    </Container>
  )
}
