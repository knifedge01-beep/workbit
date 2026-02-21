import { Heading, Stack, Text } from '@design-system'

export function WorkspaceProjectsScreen() {
  return (
    <Stack gap={4}>
      <Heading level={2}>Workspace projects</Heading>
      <Text muted>All projects in your workspace.</Text>
    </Stack>
  )
}
