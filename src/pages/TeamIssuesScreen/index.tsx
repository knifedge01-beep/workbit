import { useState } from 'react'
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
import type {
  IssueTabId,
  TeamIssueApiItem,
  TeamIssueOverrides,
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
              workspaceId &&
              teamId &&
              navigate(getIssueDetailPath(workspaceId, teamId, issue.id))
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
