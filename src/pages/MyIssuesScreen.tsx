import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  PageHeader,
  Stack,
  Text,
  Flex,
  Avatar,
  Button,
  Modal,
  Input,
  Select,
  Alert,
} from '@design-system'
import {
  Circle,
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
} from 'lucide-react'
import {
  PrioritySelector,
  type PriorityOption,
} from '../components/PrioritySelector'
import { StatusSelector } from '../components/StatusSelector'
import {
  fetchMyIssues,
  updateIssue as apiUpdateIssue,
  createIssue,
  fetchWorkspaceTeams,
} from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { formatDateTime } from '../utils/format'
import { logError, getErrorMessage } from '../utils/errorHandling'
import styled from 'styled-components'

const INLINE_PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'none',
    label: 'Not set',
    icon: <Circle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'low',
    label: 'Low',
    icon: <ArrowDownCircle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'medium',
    label: 'Medium',
    icon: <MinusCircle size={14} strokeWidth={2.2} />,
  },
  {
    id: 'high',
    label: 'High',
    icon: <ArrowUpCircle size={14} strokeWidth={2.2} />,
  },
]

const TableWrap = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

const HeadRow = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 120px;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
`

const DataRow = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 120px;
  gap: ${(p) => p.theme.spacing[2]}px;
  align-items: center;
  min-height: 46px;
  transition: background 0.12s ease;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const NameCol = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const IssueId = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.75rem;
  flex-shrink: 0;
`

const IssueTitle = styled.span`
  color: ${(p) => p.theme.colors.text};
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MetaText = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const PriorityInline = styled(PrioritySelector)`
  min-width: 0;

  button {
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    gap: 6px;
    transition: background 0.12s ease;
  }

  button:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const StatusInline = styled(StatusSelector)`
  min-width: 0;

  button {
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    gap: 6px;
    transition: background 0.12s ease;
  }

  button:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

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
  const [overrides, setOverrides] = useState<
    Record<string, { status?: string; priority?: string }>
  >({})
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [issueTitle, setIssueTitle] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const issues = (data ?? []).map((i) => ({
    ...i,
    date: i.date ? formatDateTime(i.date) : '—',
    status: overrides[i.id]?.status ?? i.status ?? 'todo',
    priority: overrides[i.id]?.priority ?? 'none',
    assigneeInitials: i.assignee?.name
      ? i.assignee.name.slice(0, 2).toUpperCase()
      : '',
  }))

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
              options={[
                { value: '', label: 'No team' },
                ...(teams ?? []).map((team) => ({
                  value: team.id,
                  label: team.name,
                })),
              ]}
            />
          </div>
        </Stack>
      </Modal>
    </Stack>
  )
}
