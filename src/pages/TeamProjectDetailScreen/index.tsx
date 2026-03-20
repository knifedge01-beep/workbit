import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Stack,
  Text,
  Tabs,
  Modal,
  Input,
  Button,
  Flex,
  Avatar,
} from '@design-system'
import type { TabItem } from '@design-system'
import {
  StatusUpdateComposer,
  MilestonesSection,
  ActivitySection,
  PropertiesSection,
  ProjectUpdateHighlightCard,
  UpdatesTree,
  DecisionTab,
} from '../../components'
import type {
  StatusUpdateCardData,
  UpdateItem,
  ProjectStatus,
  MilestoneItem,
  ActivityItem,
} from '../../components'
import { noop } from '../../utils/noop'
import { formatDateTime } from '../../utils/format'
import { logError } from '../../utils/errorHandling'
import {
  fetchTeamProject,
  fetchTeamProjectIssues,
  fetchStatusUpdateComments,
  postStatusUpdate,
  postComment,
  createMilestone,
  patchProject,
  generateProjectSummary,
  updateIssue as apiUpdateIssue,
} from '../../api/client'
import type { ApiProjectProperties } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import {
  TableWrap,
  HeadRow,
  DataRow,
  NameCol,
  IssueId,
  IssueTitle,
  MetaText,
  PriorityInline,
  StatusInline,
} from './styles'
import type { TeamProjectDetailScreenProps } from './types'
import {
  DEFAULT_STATUS,
  DEFAULT_PRIORITY,
  INLINE_PRIORITY_OPTIONS,
  apiUpdateToCard,
  appendChildNode,
} from './utils/helpers'

export function TeamProjectDetailScreen({
  projectName,
  teamId,
}: TeamProjectDetailScreenProps) {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string
    projectId: string
  }>()
  const navigate = useNavigate()

  const [updates, setUpdates] = useState<StatusUpdateCardData[]>([])
  const [milestones, setMilestones] = useState<MilestoneItem[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [properties, setProperties] = useState<ApiProjectProperties | null>(
    null
  )
  const [commentsByUpdateId, setCommentsByUpdateId] = useState<
    Record<string, UpdateItem[]>
  >({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [milestoneName, setMilestoneName] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [projectSummary, setProjectSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [issueOverrides, setIssueOverrides] = useState<
    Record<string, { status?: string; priority?: string }>
  >({})

  const { data: projectIssues, loading: issuesLoading } = useFetch(
    () =>
      teamId
        ? fetchTeamProjectIssues(teamId, 'all', projectId)
        : Promise.resolve([]),
    [teamId, projectId]
  )
  const issues = (projectIssues ?? []).map((issue) => ({
    ...issue,
    status: issueOverrides[issue.id]?.status ?? issue.status ?? DEFAULT_STATUS,
    priority: issueOverrides[issue.id]?.priority ?? DEFAULT_PRIORITY,
    dateLabel: formatDateTime(issue.date),
    assigneeInitials: issue.assignee?.name
      ? issue.assignee.name.slice(0, 2).toUpperCase()
      : '',
  }))

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'updates', label: 'Updates' },
    { id: 'issues', label: 'Issues' },
    { id: 'decisions', label: 'Decisions' },
  ]

  const updatesTreeItems: UpdateItem[] = updates.map((update) => ({
    id: update.id,
    kind: 'update',
    updateId: update.id,
    parentId: null,
    content: update.content,
    author: update.authorName,
    timestamp: update.timestamp,
    status: update.status,
    comments: commentsByUpdateId[update.id] ?? [],
  }))

  const featuredUpdate = updatesTreeItems[0]

  useEffect(() => {
    if (!teamId) return
    setLoading(true)
    fetchTeamProject(teamId)
      .then((data) => {
        if (!data.project) {
          setUpdates([])
          setCommentsByUpdateId({})
          setMilestones([])
          setActivity([])
          setProperties({})
          return
        }

        const nextUpdates =
          data.project.statusUpdates.nodes.map(apiUpdateToCard)
        setUpdates(nextUpdates)

        if (nextUpdates.length > 0) {
          void Promise.all(
            nextUpdates.map(async (update) => {
              const comments = await fetchStatusUpdateComments(
                teamId,
                update.id
              )
              const mapped: UpdateItem[] = comments.map((comment) => ({
                id: `${update.id}:comment:${comment.id}`,
                kind: 'comment',
                updateId: update.id,
                parentId: update.id,
                content: comment.content,
                author: comment.authorName,
                timestamp: formatDateTime(comment.timestamp),
                status: update.status,
                comments: [],
                reactions: {},
              }))
              return [update.id, mapped] as const
            })
          )
            .then((entries) => {
              setCommentsByUpdateId(Object.fromEntries(entries))
            })
            .catch((e) => logError(e, 'TeamProjectDetail.commentsLoad'))
        } else {
          setCommentsByUpdateId({})
        }

        setMilestones(
          data.project.milestones.map((milestone) => ({
            id: milestone.id,
            name: milestone.name,
            progress: milestone.progress,
            total: milestone.total,
            targetDate: milestone.targetDate,
          }))
        )
        setActivity(
          data.project.activity.map((item) => ({
            ...item,
            date: formatDateTime(item.date),
          }))
        )
        setProperties(data.project.properties)
      })
      .catch((e) => logError(e, 'TeamProjectDetail'))
      .finally(() => setLoading(false))
  }, [teamId])

  const handlePostUpdate = (content: string, status: ProjectStatus) => {
    if (!teamId) return
    void postStatusUpdate(
      teamId,
      content,
      status,
      projectId ? { projectId } : undefined
    )
      .then((update) =>
        setUpdates((prev) => [apiUpdateToCard(update), ...prev])
      )
      .catch((e) => logError(e, 'TeamProjectDetail'))
  }

  const handleAddComment = async (item: UpdateItem, content: string) => {
    if (!teamId) return

    const updateId = item.updateId

    if (item.kind === 'update') {
      await postComment(teamId, updateId, content)
        .then((comment) => {
          const created: UpdateItem = {
            id: `${updateId}:comment:${comment.id}`,
            kind: 'comment',
            updateId,
            parentId: updateId,
            content: comment.content,
            author: comment.authorName,
            timestamp: formatDateTime(comment.timestamp),
            status: item.status,
            comments: [],
            reactions: {},
          }

          setCommentsByUpdateId((prev) => ({
            ...prev,
            [updateId]: [...(prev[updateId] ?? []), created],
          }))

          setUpdates((prev) =>
            prev.map((update) =>
              update.id === updateId
                ? { ...update, commentCount: (update.commentCount ?? 0) + 1 }
                : update
            )
          )
        })
        .catch((e) => {
          logError(e, 'TeamProjectDetail.postComment')
          throw e
        })
      return
    }

    const localReply: UpdateItem = {
      id: `${updateId}:local:${Date.now()}:${Math.random().toString(16).slice(2, 8)}`,
      kind: 'comment',
      updateId,
      parentId: item.id,
      content,
      author: 'You',
      timestamp: formatDateTime(new Date().toISOString()),
      status: item.status,
      comments: [],
      reactions: {},
    }

    setCommentsByUpdateId((prev) => ({
      ...prev,
      [updateId]: appendChildNode(prev[updateId] ?? [], item.id, localReply),
    }))
  }

  const handleAddMilestone = () => {
    setShowMilestoneModal(true)
  }

  const handleCreateMilestone = () => {
    if (!teamId || !milestoneName.trim()) return
    void createMilestone(teamId, {
      name: milestoneName,
      targetDate: milestoneDate,
    })
      .then((milestone) => {
        setMilestones((prev) => [
          ...prev,
          {
            id: milestone.id,
            name: milestone.name,
            progress: milestone.progress,
            total: milestone.total,
            targetDate: milestone.targetDate,
          },
        ])
        setShowMilestoneModal(false)
        setMilestoneName('')
        setMilestoneDate('')
      })
      .catch((e) => logError(e, 'TeamProjectDetail'))
  }

  const handleStatusChange = (status: string) => {
    if (!teamId) return
    setProperties((prev) => (prev ? { ...prev, status } : null))
    void patchProject(teamId, { status }).catch((e) =>
      logError(e, 'TeamProjectDetail')
    )
  }

  const handlePriorityChange = (priority: string) => {
    if (!teamId) return
    setProperties((prev) => (prev ? { ...prev, priority } : null))
    void patchProject(teamId, { priority }).catch((e) =>
      logError(e, 'TeamProjectDetail')
    )
  }

  const handleGenerateSummary = () => {
    if (!teamId) return
    setSummaryLoading(true)
    setSummaryError(null)
    generateProjectSummary(teamId)
      .then((update) => {
        setProjectSummary(update.content)
        setSummaryError(null)
        setUpdates((prev) => [apiUpdateToCard(update), ...prev])
      })
      .catch((e) => {
        logError(e, 'TeamProjectDetail')
        setSummaryError((e as Error).message)
      })
      .finally(() => setSummaryLoading(false))
  }

  const updateIssuePriority = (issueId: string, priority: string) => {
    setIssueOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], priority },
    }))
  }

  const updateIssueStatus = (issueId: string, status: string) => {
    setIssueOverrides((prev) => ({
      ...prev,
      [issueId]: { ...prev[issueId], status },
    }))
    void apiUpdateIssue(issueId, { status }).catch((e) =>
      logError(e, 'TeamProjectDetail.updateIssueStatus')
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_330px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Text size="sm" muted>
            Loading project...
          </Text>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_330px]">
        <section className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Projects</span>
            <span>&gt;</span>
            <span className="font-medium text-slate-800">{projectName}</span>
          </div>

          <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
            <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
          </div>

          {activeTab === 'overview' && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                    {projectName[0]?.toUpperCase() ?? 'P'}
                  </div>
                  <h1 className="mb-1 text-2xl font-semibold text-slate-900">
                    {projectName}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Add a short summary...
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
                  {summaryLoading ? 'Generating…' : 'Generate Summary'}
                </Button>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Properties</span>
                <span>{properties?.status ?? 'Backlog'}</span>
                <span>{properties?.priority ?? 'No priority'}</span>
                <span>Lead</span>
                <span>Target date</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                  {teamId}
                </span>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700"
                >
                  ...
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Resources</span>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700"
                >
                  + Add document or link...
                </button>
              </div>

              {projectSummary !== null ? (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {projectSummary}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => {
                        setProjectSummary(null)
                        setSummaryError(null)
                      }}
                      className="underline"
                    >
                      Show latest updates
                    </button>
                    {' · '}
                    <button
                      type="button"
                      onClick={handleGenerateSummary}
                      disabled={summaryLoading}
                      className="underline"
                    >
                      {summaryLoading ? 'Generating…' : 'Regenerate summary'}
                    </button>
                  </div>
                </div>
              ) : summaryError ? (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                  <Text size="sm">{summaryError}</Text>
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      onClick={handleGenerateSummary}
                      disabled={summaryLoading}
                    >
                      Try again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4 space-y-2">
                  {updates.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                      Write the first project update to get started
                    </div>
                  ) : (
                    <>
                      <ProjectUpdateHighlightCard
                        update={featuredUpdate}
                        onAddComment={handleAddComment}
                        onViewFullThread={() => setActiveTab('updates')}
                      />
                      <UpdatesTree
                        updates={updatesTreeItems}
                        enableSearch={false}
                        onAddComment={handleAddComment}
                        onReact={noop}
                      />
                    </>
                  )}

                  <StatusUpdateComposer
                    placeholder="Write first project update"
                    onPost={handlePostUpdate}
                    onChooseFile={noop}
                    onCreateDocument={noop}
                    onAddLink={noop}
                  />
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-1 text-sm font-semibold text-slate-700">
                  Description
                </h3>
                <button
                  type="button"
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Add description...
                </button>
              </div>

              <MilestonesSection
                milestones={milestones}
                onAdd={handleAddMilestone}
              />

              <div className="mt-6">
                <ActivitySection items={activity} />
              </div>
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Stack gap={3}>
                <UpdatesTree
                  updates={updatesTreeItems}
                  enableSearch={false}
                  onAddComment={handleAddComment}
                  onReact={noop}
                />
                <StatusUpdateComposer
                  placeholder="Write a project update..."
                  onPost={handlePostUpdate}
                  onChooseFile={noop}
                  onCreateDocument={noop}
                  onAddLink={noop}
                />
              </Stack>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Stack gap={3}>
                <Flex align="center" justify="space-between">
                  <Text size="sm" muted>
                    {issuesLoading
                      ? 'Loading issues...'
                      : `${issues.length} issue${issues.length === 1 ? '' : 's'}`}
                  </Text>
                  {workspaceId && teamId && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/workspace/${workspaceId}/team/${teamId}/issues/new`,
                          projectId ? { state: { projectId } } : undefined
                        )
                      }
                    >
                      Create new issue
                    </Button>
                  )}
                </Flex>

                {issuesLoading ? (
                  <Text size="sm" muted>
                    Loading...
                  </Text>
                ) : issues.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                    <Text size="sm" muted>
                      No issues in this project yet
                    </Text>
                  </div>
                ) : (
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
                        onClick={() => {
                          if (workspaceId && teamId) {
                            navigate(
                              `/workspace/${workspaceId}/team/${teamId}/issue/${issue.id}`
                            )
                          }
                        }}
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
                            onChange={(priority) =>
                              updateIssuePriority(issue.id, priority)
                            }
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
                            onChange={(status) =>
                              updateIssueStatus(issue.id, status)
                            }
                            placeholder="Set status"
                          />
                        </div>

                        <MetaText>{issue.dateLabel}</MetaText>

                        {issue.assignee ? (
                          <Avatar
                            name={issue.assigneeInitials || issue.assignee.name}
                            size={20}
                          />
                        ) : (
                          <MetaText>-</MetaText>
                        )}
                      </DataRow>
                    ))}
                  </TableWrap>
                )}
              </Stack>
            </div>
          )}

          {activeTab === 'decisions' && projectId && (
            <DecisionTab
              projectId={projectId}
              issues={issues.map((issue) => ({
                id: issue.id,
                title: issue.title,
              }))}
              milestones={milestones.map((milestone) => ({
                id: milestone.id,
                name: milestone.name,
              }))}
              isActive={activeTab === 'decisions'}
            />
          )}
        </section>

        <aside className="space-y-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>Properties</span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600"
              >
                +
              </button>
            </div>
            <PropertiesSection
              key={`${properties?.status}-${properties?.priority}`}
              contentOnly
              defaultStatus={properties?.status}
              defaultPriority={properties?.priority}
              defaultStartDate={
                properties?.startDate
                  ? new Date(properties.startDate)
                  : undefined
              }
              defaultEndDate={
                properties?.endDate ? new Date(properties.endDate) : undefined
              }
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>Milestones</span>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="text-slate-400 hover:text-slate-600"
              >
                +
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Add milestones to organize work into granular stages.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>Activity</span>
              <button
                type="button"
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                See all
              </button>
            </div>
            {activity.length > 0 ? (
              <p className="text-sm text-slate-600">
                {activity.length} recent activit
                {activity.length === 1 ? 'y' : 'ies'}
              </p>
            ) : (
              <p className="text-sm text-slate-500">No activity yet</p>
            )}
          </div>
        </aside>
      </div>

      <Modal
        open={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        title="Create New Milestone"
        primaryLabel="Create"
        onPrimary={handleCreateMilestone}
        secondaryLabel="Cancel"
        onSecondary={() => setShowMilestoneModal(false)}
      >
        <Stack gap={3}>
          <div>
            <Text as="div" size="sm" className="block mb-2">
              Milestone Name
            </Text>
            <Input
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Enter milestone name"
            />
          </div>
          <div>
            <Text as="div" size="sm" className="block mb-2">
              Target Date
            </Text>
            <Input
              value={milestoneDate}
              onChange={(e) => setMilestoneDate(e.target.value)}
              placeholder="e.g. Mar 15"
            />
          </div>
        </Stack>
      </Modal>
    </>
  )
}
