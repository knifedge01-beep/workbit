import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Alert,
  Avatar,
  Button,
  Flex,
  Input,
  PageHeader,
  RichText,
  Stack,
  Tabs,
  Text,
} from '@design-system'

import { Table, type ColumnDef } from '@thedatablitz/table'
import { STATUS_OPTIONS } from '../../components/StatusSelector'
import {
  createIssue,
  fetchTeamIssues,
  updateIssue as apiUpdateIssue,
} from '../../api/client'
import { countBy, getErrorMessage, logError } from '../../utils'
import { useFetch } from '../../hooks/useFetch'
import { modalClasses } from './styles/classes'
import {
  IssueId,
  IssueTitle,
  MetaText,
  NameCol,
  PriorityInline,
  StatusInline,
} from './styles'
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
              <IssueId>{row.original.id}</IssueId>
              <IssueTitle>{row.original.title}</IssueTitle>
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
    [handleNavigateToIssue]
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
  ).map((opt) => `${statusCounts[opt.id]} ${opt.label}`)

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
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <Plus size={16} />
          New Issue
        </Button>
      </Flex>
      <Flex align="center" gap={2}>
        <Tabs
          tabs={[...ISSUE_TABS]}
          activeId={activeTab}
          onChange={handleTabChange}
        />
      </Flex>

      <Flex align="center" gap={2} wrap>
        {statusSummary.map((part, i) => (
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

      <Table<TeamIssueRow>
        data={issues}
        columns={columns}
        size="medium"
        searchable
        columnFilterable
        emptyMessage="No issues found"
      />

      {showModal && (
        <div className={modalClasses.overlay}>
          <div className={modalClasses.container}>
            <div className={modalClasses.header}>
              <div className={modalClasses.headerTrail}>
                <span className={modalClasses.teamBadge}>
                  {teamName.slice(0, 3).toUpperCase()}
                </span>
                <span>&gt;</span>
                <span className={modalClasses.headerTitle}>New issue</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCreateModal}
                className={modalClasses.closeButton}
                aria-label="Close"
              >
                x
              </button>
            </div>

            <div className={modalClasses.body}>
              <Input
                id="create-issue-title"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="Issue title"
                disabled={creating}
                className={modalClasses.titleInput}
              />

              <Text size="sm" muted>
                Create in {createStatus === 'backlog' ? 'Backlog' : 'Active'}
                {createStatus === 'backlog' ? ' tab' : ' workflow'}.
              </Text>

              <div className={modalClasses.chipsWrap}>
                {CREATE_ISSUE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={modalClasses.chip}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className={modalClasses.editorWrap}>
                <RichText
                  value={issueDescription}
                  onChange={setIssueDescription}
                  placeholder="Write a description, acceptance criteria, or notes..."
                  disabled={creating}
                  minHeight={170}
                />
              </div>
            </div>

            <div className={modalClasses.footer}>
              <label className={modalClasses.createMoreLabel}>
                <input
                  type="checkbox"
                  className={modalClasses.checkbox}
                  checked={createMore}
                  onChange={(e) => setCreateMore(e.target.checked)}
                  disabled={creating}
                />
                Create more
              </label>

              <div className={modalClasses.footerActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseCreateModal}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateIssue}
                  disabled={!issueTitle.trim() || creating}
                >
                  {creating ? 'Creating…' : 'Create issue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Stack>
  )
}
