import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PageHeader, Stack, Text } from '@design-system'
import { Diamond, Box } from 'lucide-react'
import {
  fetchTeamLogs,
  type ApiTeamLog,
  type ApiTeamLogsResponse,
} from '../api/client'
import { useFetch } from '../hooks/useFetch'

type Props = { teamName: string }

const EMPTY_LOGS: ApiTeamLogsResponse = { nodes: [] }

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -8px;
    width: 1px;
    background: ${(p) => p.theme.colors.border};
  }
  &:last-child::before {
    display: none;
  }
`

const Dot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export function TeamLogsScreen({ teamName }: Props) {
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
                  · {item.timestamp}
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
