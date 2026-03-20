import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Alert,
  Avatar,
  Flex,
  PageHeader,
  RichText,
  Stack,
} from '@design-system'
import { Badge } from '@thedatablitz/badge'
import { Modal } from '@thedatablitz/modal'
import { Tabs } from '@thedatablitz/tabs'
import { Text } from '@thedatablitz/text'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { TextInput } from '@thedatablitz/text-input'
import { Table, type ColumnDef } from '@thedatablitz/table'
import { STATUS_OPTIONS } from '../../components/StatusSelector'
import {
  createIssue,
  fetchTeamIssues,
  updateIssue as apiUpdateIssue,
} from '../../api/client'
import { countBy, getErrorMessage, logError } from '../../utils'
import { useFetch } from '../../hooks/useFetch'
import { MetaText, NameCol, PriorityInline, StatusInline } from './styles'
import type {
  IssueTabId,
  TeamIssueApiItem,
  TeamIssueOverrides,
  TeamIssueRow,
  TeamIssuesParams,
  TeamIssuesScreenProps,
} from './types'
import {
  CREATE_ISSUE_CHIPS,
  INLINE_PRIORITY_OPTIONS,
  getIssueDetailPath,
  getIssuesTabPath,
  isValidTab,
  ISSUE_TABS,
  toIssueRows,
} from './utils/helpers'

export function TeamIssuesScreen({ teamName }: TeamIssuesScreenProps) {
  const { workspaceId, teamId, tab: tabParam } = useParams<TeamIssuesParams>()
  const navigate = useNavigate()
  const activeTab: IssueTabId = isValidTab(tabParam) ? tabParam : 'active'

  const { data: apiIssues, reload } = useFetch(
    () => (teamId ? fetchTeamIssues(teamId, activeTab) : Promise.resolve([])),
    [teamId, activeTab]
  )

  const [overrides, setOverrides] = useState<TeamIssueOverrides>({})
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [createMore, setCreateMore] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createStatus = activeTab === 'backlog' ? 'backlog' : 'todo'

  const issues = toIssueRows((apiIssues ?? []) as TeamIssueApiItem[], overrides)

  const handleNavigateToIssue = (issueId: string) => {
    if (workspaceId && teamId) {
      navigate(getIssueDetailPath(workspaceId, teamId, issueId))
    }
  }

  const columns = useMemo<ColumnDef<TeamIssueRow, unknown>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'id',
        header: 'Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleNavigateToIssue(row.original.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              color: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <NameCol>
              <Badge variant="brand" size="small">
                {row.original.id}
              </Badge>
              <Text
                variant="body2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.original.title}
              </Text>
            </NameCol>
          </button>
        ),
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <PriorityInline
              value={row.original.priority}
              onChange={(priority) =>
                updateIssuePriority(row.original.id, priority)
              }
              options={INLINE_PRIORITY_OPTIONS}
              placeholder="Not set"
            />
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'List',
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusInline
              value={row.original.status}
              onChange={(status) => updateIssueStatus(row.original.id, status)}
              placeholder="Set status"
            />
          </div>
        ),
      },
      {
        id: 'date',
        accessorKey: 'date',
        header: 'Due date',
        cell: ({ row }) => <MetaText>{row.original.date}</MetaText>,
      },
      {
        id: 'assignee',
        accessorKey: 'assignee',
        header: 'Assignee',
        cell: ({ row }) =>
          row.original.assignee ? (
            <Avatar
              name={row.original.assigneeInitials || row.original.assignee}
              size={20}
            />
          ) : (
            <MetaText>—</MetaText>
          ),
      },
    ],
    []
  )

  const updateIssuePriority = (issueId: string, priority: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], priority },
    }))
  }

  const updateIssueStatus = (issueId: string, status: string) => {
    setOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], status },
    }))
    void apiUpdateIssue(issueId, { status }).catch((e) =>
      logError(e, 'Update issue status')
    )
  }

  const handleTabChange = (id: string) => {
    if (workspaceId && teamId && isValidTab(id)) {
      navigate(getIssuesTabPath(workspaceId, teamId, id))
    }
  }

  const statusCounts = countBy(issues, (issue) => issue.status)

  const statusSummary = STATUS_OPTIONS.filter(
    (opt) => (statusCounts[opt.id] ?? 0) > 0
  ).map((opt) => ({
    count: statusCounts[opt.id],
    label: opt.label,
    icon: opt.icon,
  }))

  const handleCreateIssue = async () => {
    if (!teamId || !issueTitle.trim()) return

    setCreateError(null)
    setCreating(true)
    try {
      await createIssue(teamId, {
        title: issueTitle.trim(),
        description: issueDescription.trim() || undefined,
        status: createStatus,
      })
      await reload()
      setIssueTitle('')
      setIssueDescription('')
      if (!createMore) {
        setShowModal(false)
      }
    } catch (err) {
      logError(err, 'TeamIssues')
      setCreateError(getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  const handleOpenCreateModal = () => {
    setCreateError(null)
    setShowModal(true)
  }

  const handleCloseCreateModal = () => {
    if (creating) return
    setShowModal(false)
    setIssueTitle('')
    setIssueDescription('')
    setCreateMore(false)
  }

  return (
    <Stack gap={4}>
      {createError && <Alert variant="error">{createError}</Alert>}
      <Flex align="center" justify="space-between">
        <PageHeader title={teamName} />
        <Button
          icon={<Plus size={16} />}
          variant="primary"
          onClick={handleOpenCreateModal}
        >
          New Issue
        </Button>
      </Flex>

      <Tabs
        items={[...ISSUE_TABS]}
        value={activeTab}
        onChange={handleTabChange}
      />

      <Flex align="center" gap={2} wrap>
        {statusSummary.map((part) => (
          <Badge
            key={part.label}
            icon={part.icon}
            size="medium"
            variant="default"
          >
            {part.count} - {part.label}
          </Badge>
        ))}
      </Flex>

      <Table<TeamIssueRow>
        data={issues}
        columns={columns}
        size="medium"
        searchable
        columnFilterable
        emptyMessage="No issues found"
      />

      <Modal
        open={showModal}
        onClose={handleCloseCreateModal}
        title="New issue"
        size="large"
        footer={
          <Flex justify="flex-end" gap={2}>
            <Button
              variant="danger"
              onClick={handleCloseCreateModal}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void handleCreateIssue()}
              disabled={!issueTitle.trim() || creating}
            >
              {creating ? 'Creating…' : 'Create issue'}
            </Button>
          </Flex>
        }
      >
        <Stack gap={3}>
          <TextInput
            id="create-issue-title"
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
            placeholder="Issue title"
            disabled={creating}
          />

          <Text variant="body3" color="color.text.subtle">
            Create in {createStatus === 'backlog' ? 'Backlog' : 'Active'}
            {createStatus === 'backlog' ? ' tab' : ' workflow'}.
          </Text>

          <Inline gap="100" wrap fullWidth>
            {CREATE_ISSUE_CHIPS.map((chip) => (
              <Badge key={chip} icon={<Plus size={12} />} size="small">
                {chip}
              </Badge>
            ))}
          </Inline>

          <RichText
            value={issueDescription}
            onChange={setIssueDescription}
            placeholder="Write a description, acceptance criteria, or notes..."
            disabled={creating}
            minHeight={170}
          />
        </Stack>
      </Modal>
    </Stack>
  )
}
