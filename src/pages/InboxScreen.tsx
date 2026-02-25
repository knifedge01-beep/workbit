import styled from 'styled-components'
import { PageHeader, Stack, Text } from '@design-system'
import { fetchNotifications } from '../api/client'
import { useFetch } from '../hooks/useFetch'

const NotifCard = styled.div<{ $unread?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${(p) =>
    p.$unread ? p.theme.colors.backgroundSubtle : 'transparent'};
  border: 1px solid
    ${(p) => (p.$unread ? p.theme.colors.border : 'transparent')};
  cursor: default;
  transition: background 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.backgroundSubtle};
  }
`

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
  margin-top: 4px;
`

export function InboxScreen() {
  const { data, loading, error } = useFetch(fetchNotifications)

  return (
    <Stack gap={4}>
      <PageHeader
        title="Inbox"
        summary="Your notifications and updates will appear here."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load notifications: {error}
        </Text>
      )}
      {!loading && (
        <Stack gap={1}>
          {(data ?? []).map((n) => (
            <NotifCard key={n.id} $unread={!n.read}>
              {!n.read && <UnreadDot />}
              <div
                style={{ flex: 1, minWidth: 0, paddingLeft: n.read ? 20 : 0 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{ fontWeight: n.read ? 400 : 600, fontSize: 14 }}
                  >
                    {n.title}
                  </span>
                  <Text size="xs" muted as="span">
                    · {n.createdAt}
                  </Text>
                </div>
                {n.body && (
                  <Text size="xs" muted>
                    {n.body}
                  </Text>
                )}
                {n.actor && (
                  <Text size="xs" muted>
                    From: {n.actor.name}
                  </Text>
                )}
              </div>
            </NotifCard>
          ))}
          {data?.length === 0 && (
            <Text size="sm" muted>
              No new notifications.
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  )
}
