import { Card, Heading, Text } from '@design-system'

type Props = {
  /** When true, render only content (no Card wrapper). Use inside Popup or other containers that already provide surface. */
  inline?: boolean
}

export function WhatsNewCard({ inline = false }: Props) {
  const content = (
    <>
      <Heading level={5}>What&apos;s new</Heading>
      <Text size="xs" muted>
        Advanced filters and share issues in private teams
      </Text>
    </>
  )
  if (inline) return <>{content}</>
  return <Card>{content}</Card>
}
