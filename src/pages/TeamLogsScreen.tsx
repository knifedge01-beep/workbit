import { PageHeader, Stack } from '@design-system'

type Props = { teamName: string }

export function TeamLogsScreen({ teamName }: Props) {
  return (
    <Stack gap={4}>
      <PageHeader title={`${teamName} – Logs`} summary="Activity and logs for this team." />
    </Stack>
  )
}
