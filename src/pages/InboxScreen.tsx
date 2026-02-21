import { Heading, Stack, Text } from '@design-system'

export function InboxScreen() {
  return (
    <Stack gap={4}>
      <Heading level={2}>Inbox</Heading>
      <Text muted>Your notifications and updates will appear here.</Text>
    </Stack>
  )
}
