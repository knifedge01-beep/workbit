import { useState } from 'react'
import {
  Heading,
  Text,
  Button,
  IconButton,
  Avatar,
  Card,
  Flex,
  Stack,
  Tabs,
} from '@design-system'
import { Circle, Filter, LayoutGrid, MoreHorizontal, Plus } from 'lucide-react'
import { StatusSelector } from '../components'
import { DEMO_ISSUES } from '../constants'
import type { Issue } from '../constants'

type Props = { teamName: string }

export function TeamIssuesScreen({ teamName }: Props) {
  const [issues, setIssues] = useState<Issue[]>(DEMO_ISSUES)

  const updateIssueStatus = (issueId: string, status: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status } : i))
    )
  }

  return (
    <Stack gap={4}>
      <Heading level={2}>{teamName}</Heading>
      <Flex align="center" gap={2}>
        <Tabs
          tabs={[
            { id: 'all', label: 'All issues' },
            { id: 'active', label: 'Active' },
            { id: 'backlog', label: 'Backlog' },
          ]}
          activeId="active"
          onChange={() => {}}
        />
        <IconButton aria-label="Add view">
          <Plus size={16} />
        </IconButton>
      </Flex>
      <Flex justify="space-between" align="center">
        <div />
        <Flex gap={2}>
          <Button variant="ghost" size="sm">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <LayoutGrid size={16} />
            Display
          </Button>
        </Flex>
      </Flex>

      <Flex align="center" gap={2}>
        <Circle size={16} style={{ opacity: 0.6 }} />
        <Text size="sm">Todo</Text>
        <Text size="sm" muted>{issues.length}</Text>
      </Flex>

      <Stack gap={1}>
        {issues.map((issue) => (
          <Card key={issue.id}>
            <Flex align="center" gap={2}>
              <IconButton aria-label="Menu">
                <MoreHorizontal size={16} />
              </IconButton>
              <StatusSelector
                triggerVariant="icon"
                value={issue.status ?? 'todo'}
                onChange={(status) => updateIssueStatus(issue.id, status)}
              />
              <Text size="sm">{issue.id}</Text>
              <span style={{ flex: 1 }}>
                <Text size="sm" as="span">{issue.title}</Text>
              </span>
              {issue.assignee ? (
                <Avatar name={issue.assignee} size={24} />
              ) : (
                <span style={{ width: 24 }} />
              )}
              <Text size="xs" muted>{issue.date}</Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
