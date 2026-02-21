import { PageHeader, Stack } from '@design-system'

export function MyIssuesScreen() {
  return (
    <Stack gap={4}>
      <PageHeader title="My issues" summary="Issues assigned to you across all teams." />
    </Stack>
  )
}
