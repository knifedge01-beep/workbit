import styled from 'styled-components'
import { Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Stack } from '@design-system'

const Container = styled.div<{ $padding?: number }>`
  padding: ${(p) =>
    p.$padding != null ? p.theme.spacing[p.$padding] : p.theme.spacing[5]}px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Message = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.textMuted};
`

const IconWrapper = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
`

interface Props {
  message: string
  icon?: LucideIcon
  iconSize?: number
  padding?: number
}

export function EmptyState({
  message,
  icon: Icon = Inbox,
  iconSize = 24,
  padding,
}: Props) {
  return (
    <Container $padding={padding}>
      <Stack direction="vertical" gap={3}>
        <IconWrapper>
          <Icon size={iconSize} strokeWidth={1.5} />
        </IconWrapper>
        <Message>{message}</Message>
      </Stack>
    </Container>
  )
}
