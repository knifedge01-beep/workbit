import { useState } from 'react'
import { Plus } from 'lucide-react'

import {
  Alert,
  Avatar,
  Flex,
  Input,
  Modal,
  PageHeader,
  Select,
  Stack,
  Text,
} from '@design-system'

import {
  fetchMyIssues,
  fetchWorkspaceTeams,
  createIssue,
  updateIssue as apiUpdateIssue,
} from '../../api/client'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import { getErrorMessage, logError } from '../../utils/errorHandling'
import {
  DataRow,
  HeadRow,
  IssueId,
  IssueTitle,
  MetaText,
  NameCol,
  PriorityInline,
  StatusInline,
  TableWrap,
} from './styles'
import type { IssueOverrides, MyIssueApiItem, TeamLite } from './types'
import {
  INLINE_PRIORITY_OPTIONS,
  toIssueRows,
  toTeamSelectOptions,
} from './utils/helpers'
import { Button } from '@thedatablitz/button'

export function MyIssuesScreen() {
  const { currentWorkspace } = useWorkspace()
  const { data, loading, error, reload } = useFetch(fetchMyIssues)
  const { data: teams } = useFetch(
    () =>
      currentWorkspace
        ? fetchWorkspaceTeams(currentWorkspace.id)
        : Promise.resolve([]),
    [currentWorkspace?.id]
  )
  const [overrides, setOverrides] = useState<IssueOverrides>({})
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [issueTitle, setIssueTitle] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const issues = toIssueRows((data ?? []) as MyIssueApiItem[], overrides)

  const updatePriority = (issueId: string, priority: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], priority },
    }))
  }

  const updateStatus = (issueId: string, status: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], status },
    }))
    void apiUpdateIssue(issueId, { status }).catch((e) =>
      logError(e, 'MyIssues')
    )
  }

  const handleCreateIssue = async () => {
    if (!issueTitle.trim()) return

    setCreateError(null)
    setCreating(true)
    try {
      const teamIdOptional =
        selectedTeam && selectedTeam.trim() ? selectedTeam : undefined
      await createIssue(teamIdOptional, { title: issueTitle, status: 'todo' })
      await reload()
      setShowModal(false)
      setIssueTitle('')
      setSelectedTeam('')
    } catch (err) {
      logError(err, 'MyIssues')
      setCreateError(getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Stack gap={4}>
      {createError && <Alert variant="error">{createError}</Alert>}
      <Flex align="center" justify="space-between">
        <PageHeader
          title="My issues"
          summary="Issues assigned to you across all teams."
        />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          New Issue
        </Button>
      </Flex>
      {error && (
        <Text size="sm" muted>
          Failed to load issues: {error}
        </Text>
      )}
      {!loading && (
        <Stack gap={1}>
          <TableWrap>
            <HeadRow>
              <span>Name</span>
              <span>Priority</span>
              <span>List</span>
              <span>Due date</span>
              <span>Assignee</span>
            </HeadRow>

            {issues.map((issue) => (
              <DataRow key={issue.id}>
                <NameCol>
                  <IssueId>{issue.id}</IssueId>
                  <IssueTitle>{issue.title}</IssueTitle>
                </NameCol>

                <PriorityInline
                  value={issue.priority}
                  onChange={(p) => updatePriority(issue.id, p)}
                  options={INLINE_PRIORITY_OPTIONS}
                  placeholder="Not set"
                />
                <StatusInline
                  value={issue.status}
                  onChange={(s) => updateStatus(issue.id, s)}
                  placeholder="Set status"
                />
                <MetaText>{issue.date}</MetaText>
                {issue.assignee ? (
                  <Avatar
                    name={issue.assigneeInitials || issue.assignee.name}
                    size={20}
                  />
                ) : (
                  <MetaText>—</MetaText>
                )}
              </DataRow>
            ))}
          </TableWrap>

          {issues.length === 0 && (
            <Text size="sm" muted>
              No issues assigned to you.
            </Text>
          )}
        </Stack>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Issue"
        primaryLabel="Create"
        onPrimary={handleCreateIssue}
        secondaryLabel="Cancel"
        onSecondary={() => setShowModal(false)}
      >
        <Stack gap={3}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <Text as="span" size="sm">
                Issue Title
              </Text>
            </div>
            <Input
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Enter issue title"
              disabled={creating}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <Text as="span" size="sm">
                Team (optional)
              </Text>
            </div>
            <Select
              value={selectedTeam}
              onChange={setSelectedTeam}
              options={toTeamSelectOptions((teams ?? []) as TeamLite[])}
            />
          </div>
        </Stack>
      </Modal>
    </Stack>
  )
}
