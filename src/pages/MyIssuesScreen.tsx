import { Heading, Stack, Text } from '@design-system'

export function MyIssuesScreen() {
  return (
    <Stack gap={4}>
      <Heading level={2}>My issues</Heading>
      <Text muted>Issues assigned to you across all teams.</Text>
    </Stack>
  )
}
