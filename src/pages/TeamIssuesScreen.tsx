import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Plus } from 'lucide-react'
import {
  PageHeader,
  Text,
  Avatar,
  Flex,
  Stack,
  Tabs,
  Button,
  Input,
  Alert,
  RichText,
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
import { STATUS_OPTIONS, StatusSelector } from '../components/StatusSelector'
import {
  fetchTeamIssues,
  updateIssue as apiUpdateIssue,
  createIssue,
} from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime, logError, getErrorMessage, countBy } from '../utils'

const DEFAULT_STATUS = 'todo'
const DEFAULT_PRIORITY = 'none'

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

const ISSUE_TABS = [
  { id: 'all', label: 'All issues' },
  { id: 'active', label: 'Active' },
  { id: 'backlog', label: 'Backlog' },
] as const
type IssueTabId = (typeof ISSUE_TABS)[number]['id']
const ISSUE_TAB_IDS: readonly IssueTabId[] = ISSUE_TABS.map((t) => t.id)

const TableWrap = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

const HeadRow = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 92px;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 500;
`

const DataRow = styled.div`
  width: 100%;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: minmax(320px, 2fr) 110px 120px 120px 92px;
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

function isValidTab(tab: string | undefined): tab is IssueTabId {
  return tab != null && ISSUE_TAB_IDS.includes(tab as IssueTabId)
}

type Props = { teamName: string }

export function TeamIssuesScreen({ teamName }: Props) {
  const {
    workspaceId,
    teamId,
    tab: tabParam,
  } = useParams<{
    workspaceId: string
    teamId: string
    tab: string
  }>()
  const navigate = useNavigate()
  const activeTab = isValidTab(tabParam) ? tabParam : 'active'

  const { data: apiIssues, reload } = useFetch(
    () => (teamId ? fetchTeamIssues(teamId, activeTab) : Promise.resolve([])),
    [teamId, activeTab]
  )

  // local overrides for optimistic status / priority (priority not in API)
  const [overrides, setOverrides] = useState<
    Record<string, { status?: string; priority?: string }>
  >({})
  const [creating, setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [createMore, setCreateMore] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createStatus = activeTab === 'backlog' ? 'backlog' : 'todo'

  const issues = (apiIssues ?? []).map((i) => ({
    id: i.id,
    title: i.title,
    assignee: i.assignee?.name ?? '',
    assigneeInitials: i.assignee?.name
      ? i.assignee.name.slice(0, 2).toUpperCase()
      : '',
    date: formatDateTime(i.date),
    status: overrides[i.id]?.status ?? i.status ?? DEFAULT_STATUS,
    priority: overrides[i.id]?.priority ?? DEFAULT_PRIORITY,
  }))

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
      navigate(`/workspace/${workspaceId}/team/${teamId}/issues/${id}`)
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

      <TableWrap>
        <HeadRow>
          <span>Name</span>
          <span>Priority</span>
          <span>List</span>
          <span>Due date</span>
          <span>Assignee</span>
        </HeadRow>

        {issues.map((issue) => (
          <DataRow
            key={issue.id}
            onClick={() =>
              navigate(
                `/workspace/${workspaceId}/team/${teamId}/issue/${issue.id}`
              )
            }
          >
            <NameCol>
              <IssueId>{issue.id}</IssueId>
              <IssueTitle>{issue.title}</IssueTitle>
            </NameCol>

            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <PriorityInline
                value={issue.priority}
                onChange={(priority) => updateIssuePriority(issue.id, priority)}
                options={INLINE_PRIORITY_OPTIONS}
                placeholder="Not set"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <StatusInline
                value={issue.status}
                onChange={(status) => updateIssueStatus(issue.id, status)}
                placeholder="Set status"
              />
            </div>
            <MetaText>{issue.date}</MetaText>

            {issue.assignee ? (
              <Avatar
                name={issue.assigneeInitials || issue.assignee}
                size={20}
              />
            ) : (
              <MetaText>—</MetaText>
            )}
          </DataRow>
        ))}
      </TableWrap>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 p-4 pt-24">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-5 items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[11px] font-semibold text-slate-600">
                  {teamName.slice(0, 3).toUpperCase()}
                </span>
                <span>&gt;</span>
                <span className="font-medium text-slate-700">New issue</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCreateModal}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                x
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <Input
                id="create-issue-title"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="Issue title"
                disabled={creating}
                className="text-lg font-semibold"
              />

              <Text size="sm" muted>
                Create in {createStatus === 'backlog' ? 'Backlog' : 'Active'}
                {createStatus === 'backlog' ? ' tab' : ' workflow'}.
              </Text>

              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                {[
                  'Todo',
                  'Priority',
                  'Assignee',
                  'Project',
                  'Labels',
                  'More',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-2">
                <RichText
                  value={issueDescription}
                  onChange={setIssueDescription}
                  placeholder="Write a description, acceptance criteria, or notes..."
                  disabled={creating}
                  minHeight={170}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  className="rounded border-slate-300"
                  checked={createMore}
                  onChange={(e) => setCreateMore(e.target.checked)}
                  disabled={creating}
                />
                Create more
              </label>

              <div className="flex items-center gap-2">
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
