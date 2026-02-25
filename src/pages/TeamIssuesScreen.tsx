import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageHeader,
  Text,
  Avatar,
  Card,
  Flex,
  Stack,
  Tabs,
} from '@design-system'
import { StatusSelector, PrioritySelector } from '../components'
import { STATUS_OPTIONS } from '../components/StatusSelector'
import type { StatusOption } from '../components'
import { fetchTeamIssues, updateIssue as apiUpdateIssue } from '../api/client'
import { useFetch } from '../hooks/useFetch'

const ISSUE_TAB_IDS = ['all', 'active', 'backlog'] as const
type IssueTabId = (typeof ISSUE_TAB_IDS)[number]

function isValidTab(tab: string | undefined): tab is IssueTabId {
  return tab != null && ISSUE_TAB_IDS.includes(tab as IssueTabId)
}

type Props = { teamName: string }

export function TeamIssuesScreen({ teamName }: Props) {
  const { teamId, tab: tabParam } = useParams<{ teamId: string; tab: string }>()
  const navigate = useNavigate()
  const activeTab = isValidTab(tabParam) ? tabParam : 'active'

  const { data: apiIssues } = useFetch(
    () => (teamId ? fetchTeamIssues(teamId, activeTab) : Promise.resolve([])),
    [teamId, activeTab]
  )

  // local overrides for optimistic status / priority (priority not in API)
  const [overrides, setOverrides] = useState<
    Record<string, { status?: string; priority?: string }>
  >({})

  const issues = (apiIssues ?? []).map((i) => ({
    id: i.id,
    title: i.title,
    assignee: i.assignee?.name ?? '',
    date: i.date,
    status: overrides[i.id]?.status ?? i.status ?? 'todo',
    priority: overrides[i.id]?.priority ?? 'medium',
  }))

  const updateIssueStatus = (issueId: string, status: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], status },
    }))
    void apiUpdateIssue(issueId, { status }).catch(console.error)
  }

  const updateIssuePriority = (issueId: string, priority: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], priority },
    }))
  }

  const handleTabChange = (id: string) => {
    if (teamId && isValidTab(id)) {
      navigate(`/team/${teamId}/issues/${id}`)
    }
  }

  const statusCounts = issues.reduce<Record<string, number>>((acc, issue) => {
    const status = issue.status ?? 'todo'
    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  const statusSummary = STATUS_OPTIONS.filter(
    (opt: StatusOption) => (statusCounts[opt.id] ?? 0) > 0
  ).map((opt: StatusOption) => `${statusCounts[opt.id]} ${opt.label}`)

  return (
    <Stack gap={4}>
      <PageHeader title={teamName} />
      <Flex align="center" gap={2}>
        <Tabs
          tabs={[
            { id: 'all', label: 'All issues' },
            { id: 'active', label: 'Active' },
            { id: 'backlog', label: 'Backlog' },
          ]}
          activeId={activeTab}
          onChange={handleTabChange}
        />
      </Flex>

      <Flex align="center" gap={2} wrap>
        {statusSummary.map((part: string, i: number) => (
          <Flex key={i} align="center" gap={1}>
            {i > 0 && (
              <Text size="sm" muted>
                ·
              </Text>
            )}
            <Text size="sm" muted>
              {part}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Stack gap={1}>
        {issues.map((issue) => (
          <Card key={issue.id}>
            <Flex align="center" gap={2}>
              <PrioritySelector
                triggerVariant="icon"
                value={issue.priority ?? 'medium'}
                onChange={(priority) => updateIssuePriority(issue.id, priority)}
              />
              <StatusSelector
                triggerVariant="icon"
                value={issue.status ?? 'todo'}
                onChange={(status) => updateIssueStatus(issue.id, status)}
              />
              <Text size="sm">{issue.id}</Text>
              <span style={{ flex: 1 }}>
                <Text size="sm" as="span">
                  {issue.title}
                </Text>
              </span>
              {issue.assignee ? (
                <Avatar name={issue.assignee} size={24} />
              ) : (
                <span style={{ width: 24 }} />
              )}
              <Text size="xs" muted>
                {issue.date}
              </Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
