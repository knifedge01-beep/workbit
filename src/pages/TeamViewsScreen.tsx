import { PageHeader, Stack } from '@design-system'

type Props = { teamName: string }

export function TeamViewsScreen({ teamName }: Props) {
  return (
    <Stack gap={4}>
      <PageHeader title={`${teamName} – Views`} summary="Saved views for this team." />
    </Stack>
  )
}
