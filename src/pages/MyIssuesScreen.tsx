import { useState } from 'react'
import { PageHeader, Stack, Text, Card, Flex, Avatar } from '@design-system'
import { StatusSelector, PrioritySelector } from '../components'
import { fetchMyIssues, updateIssue as apiUpdateIssue } from '../api/client'
import { useFetch } from '../hooks/useFetch'

export function MyIssuesScreen() {
  const { data, loading, error } = useFetch(fetchMyIssues)
  const [overrides, setOverrides] = useState<
    Record<string, { status?: string; priority?: string }>
  >({})

  const issues = (data ?? []).map((i) => ({
    ...i,
    status: overrides[i.id]?.status ?? i.status ?? 'todo',
    priority: overrides[i.id]?.priority ?? 'medium',
  }))

  const updateStatus = (issueId: string, status: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], status },
    }))
    void apiUpdateIssue(issueId, { status }).catch(console.error)
  }

  const updatePriority = (issueId: string, priority: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], priority },
    }))
  }

  return (
    <Stack gap={4}>
      <PageHeader
        title="My issues"
        summary="Issues assigned to you across all teams."
      />
      {error && (
        <Text size="sm" muted>
          Failed to load issues: {error}
        </Text>
      )}
      {!loading && (
        <Stack gap={1}>
          {issues.map((issue) => (
            <Card key={issue.id}>
              <Flex align="center" gap={2}>
                <PrioritySelector
                  triggerVariant="icon"
                  value={issue.priority}
                  onChange={(p) => updatePriority(issue.id, p)}
                />
                <StatusSelector
                  triggerVariant="icon"
                  value={issue.status}
                  onChange={(s) => updateStatus(issue.id, s)}
                />
                <Text size="sm">{issue.id}</Text>
                <span style={{ flex: 1 }}>
                  <Text size="sm" as="span">
                    {issue.title}
                  </Text>
                </span>
                {issue.team && (
                  <Text size="xs" muted>
                    {issue.team.name}
                  </Text>
                )}
                {issue.project && (
                  <Text size="xs" muted>
                    · {issue.project.name}
                  </Text>
                )}
                {issue.assignee ? (
                  <Avatar name={issue.assignee.name} size={24} />
                ) : (
                  <span style={{ width: 24 }} />
                )}
                <Text size="xs" muted>
                  {issue.date}
                </Text>
              </Flex>
            </Card>
          ))}
          {issues.length === 0 && (
            <Text size="sm" muted>
              No issues assigned to you.
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  )
}
