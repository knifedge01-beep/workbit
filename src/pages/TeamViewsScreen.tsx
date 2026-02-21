import { Heading, Stack, Text } from '@design-system'

type Props = { teamName: string }

export function TeamViewsScreen({ teamName }: Props) {
  return (
    <Stack gap={4}>
      <Heading level={2}>{teamName} – Views</Heading>
      <Text muted>Saved views for this team.</Text>
    </Stack>
  )
}
