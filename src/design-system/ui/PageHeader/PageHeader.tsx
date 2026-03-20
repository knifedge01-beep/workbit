import styled from 'styled-components'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Avatar } from '@thedatablitz/avatar'

const Header = styled.header`
  padding: 0;
  margin-bottom: ${(p) => p.theme.spacing[6]}px;
`

const IconWrap = styled.span`
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

type Props = {
  title: string
  /** Short summary or description. When empty, does not show */
  summary?: string
  /** Custom icon. Defaults to a project/box icon. */
  icon?: React.ReactNode
  className?: string
}

export function PageHeader({ title, summary = '', icon, className }: Props) {
  return (
    <Header className={className}>
      <Inline align="flex-start" gap="200" fullWidth>
        <IconWrap>{icon ?? <Avatar name="WB" size="medium" />}</IconWrap>
        <Stack gap="025" fullWidth>
          <Text as="h1" variant="heading3">
            {title}
          </Text>
          {summary ? (
            <Text as="p" variant="body2" color="color.text.subtle">
              {summary}
            </Text>
          ) : null}
        </Stack>
      </Inline>
    </Header>
  )
}
