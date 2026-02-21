import { Heading, Stack, Text } from '@design-system'

type Props = { teamName: string }

export function TeamProjectsScreen({ teamName }: Props) {
  return (
    <Stack gap={4}>
      <Heading level={2}>{teamName} – Projects</Heading>
      <Text muted>Projects for this team.</Text>
    </Stack>
  )
}
