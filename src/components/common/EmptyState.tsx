import styled from 'styled-components'
import { Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const Container = styled.div<{ padding?: string }>`
  padding: ${(p) => p.padding || '20px'};
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const Message = styled.div`
  line-height: 1.5;
`

interface Props {
  message: string
  icon?: LucideIcon
  iconSize?: number
  padding?: string
}

export function EmptyState({
  message,
  icon: Icon = Inbox,
  iconSize = 24,
  padding,
}: Props) {
  return (
    <Container padding={padding}>
      <Icon size={iconSize} strokeWidth={1.5} />
      <Message>{message}</Message>
    </Container>
  )
}
