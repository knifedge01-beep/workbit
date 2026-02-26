import styled from 'styled-components'
import { AlertCircle } from 'lucide-react'

const Container = styled.div<{ fullHeight?: boolean }>`
  padding: 40px;
  text-align: center;
  color: #ef4444;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  ${(p) => p.fullHeight && 'min-height: 200px; justify-content: center;'}
`

const Message = styled.div`
  font-weight: 500;
`

interface Props {
  message?: string
  error?: string | null
  fullHeight?: boolean
}

export function ErrorState({ message, error, fullHeight }: Props) {
  const displayMessage = error || message || 'An error occurred'

  return (
    <Container fullHeight={fullHeight}>
      <AlertCircle size={24} />
      <Message>{displayMessage}</Message>
    </Container>
  )
}
