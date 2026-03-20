import { useParams } from 'react-router-dom'
import { PageHeader, Stack, Text } from '@design-system'
import { Diamond, Box } from 'lucide-react'
import { fetchTeamLogs, type ApiTeamLog } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { formatDateTime } from '../../utils/format'
import { Timeline, TimelineItem, Dot } from './styles'
import type { TeamLogsScreenProps } from './types'
import { EMPTY_LOGS } from './utils'

export function TeamLogsScreen({ teamName }: TeamLogsScreenProps) {
  const { teamId } = useParams<{ teamId: string }>()
  const { data, loading, error } = useFetch(
    () => (teamId ? fetchTeamLogs(teamId) : Promise.resolve(EMPTY_LOGS)),
    [teamId]
  )
  const logs = data?.nodes ?? []

  return (
    <Stack gap={4}>
      <PageHeader
        title={`${teamName} – Logs`}
        summary="Activity and logs for this team."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load logs: {error}
        </Text>
      )}
      {!loading && (
        <Timeline>
          {logs.map((item: ApiTeamLog) => (
            <TimelineItem key={item.id}>
              <Dot>
                {item.action === 'milestone' ? (
                  <Diamond size={8} />
                ) : (
                  <Box size={8} />
                )}
              </Dot>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" as="span">
                  {item.details}
                </Text>{' '}
                <Text size="xs" muted as="span">
                  · {formatDateTime(item.timestamp)}
                </Text>
              </div>
            </TimelineItem>
          ))}
          {logs.length === 0 && (
            <Text size="sm" muted>
              No activity yet.
            </Text>
          )}
        </Timeline>
      )}
    </Stack>
  )
}
