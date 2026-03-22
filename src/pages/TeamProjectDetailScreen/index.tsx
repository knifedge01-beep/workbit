import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box } from '@thedatablitz/box'
import { Badge } from '@thedatablitz/badge'

import { Inline } from '@thedatablitz/inline'
import { Modal } from '@thedatablitz/modal'
import { Stack } from '@thedatablitz/stack'
import { Tabs } from '@thedatablitz/tabs'
import { Text } from '@thedatablitz/text'
import { Avatar } from '@thedatablitz/avatar'
import { TextInput as Input } from '@thedatablitz/text-input'
import { TextEditor } from '@thedatablitz/text-editor'
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
  fetchProjectDocumentation,
  updateProjectDocumentation,
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
import { Plus } from 'lucide-react'
import { Banner } from '@thedatablitz/banner'
import { Button } from '@thedatablitz/button'

export function TeamProjectDetailScreen({
  projectName,
  teamId,
  initialTab = 'overview',
}: TeamProjectDetailScreenProps) {
  type ProjectDetailTab =
    | 'overview'
    | 'updates'
    | 'issues'
    | 'documentation'
    | 'decisions'
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
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>(initialTab)
  const [docContent, setDocContent] = useState('')
  const [savedDocContent, setSavedDocContent] = useState('')
  const [docLoading, setDocLoading] = useState(false)
  const [docSaving, setDocSaving] = useState(false)
  const [docError, setDocError] = useState<string | null>(null)
  const [docLastUpdatedAt, setDocLastUpdatedAt] = useState<string | null>(null)
  const [docLastUpdatedBy, setDocLastUpdatedBy] = useState<string | null>(null)
  /** Bump to remount TextEditor after load so `defaultEditorState` applies cleanly. */
  const [docEditorMountKey, setDocEditorMountKey] = useState(0)
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'updates', label: 'Updates' },
    { id: 'issues', label: 'Issues' },
    { id: 'documentation', label: 'Documentation' },
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

  useEffect(() => {
    if (!projectId) return
    setDocLoading(true)
    setDocError(null)
    fetchProjectDocumentation(projectId)
      .then((doc) => {
        const content = doc.content ?? ''
        setDocContent(content)
        setSavedDocContent(content)
        setDocLastUpdatedAt(doc.updatedAt)
        setDocLastUpdatedBy(doc.updatedBy)
      })
      .catch((e) => {
        logError(e, 'TeamProjectDetail.fetchProjectDocumentation')
        setDocError((e as Error).message)
      })
      .finally(() => {
        setDocLoading(false)
        setDocEditorMountKey((k) => k + 1)
      })
  }, [projectId])

  const hasDocChanges = docContent !== savedDocContent

  const handleSaveDocumentation = () => {
    if (!projectId || docSaving || !hasDocChanges) return
    setDocSaving(true)
    setDocError(null)
    updateProjectDocumentation(projectId, docContent)
      .then((doc) => {
        const content = doc.content ?? ''
        setDocContent(content)
        setSavedDocContent(content)
        setDocLastUpdatedAt(doc.updatedAt)
        setDocLastUpdatedBy(doc.updatedBy)
      })
      .catch((e) => {
        logError(e, 'TeamProjectDetail.updateProjectDocumentation')
        setDocError((e as Error).message)
      })
      .finally(() => setDocSaving(false))
  }

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
        <Box border padding="400" className="rounded-xl bg-white">
          <Text variant="body3" color="color.text.subtle">
            Loading project...
          </Text>
        </Box>
        <Box border padding="300" className="rounded-xl bg-white" />
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

          <Tabs
            items={tabs}
            value={activeTab}
            onChange={(nextTab) => {
              setActiveTab(nextTab as ProjectDetailTab)
              if (!workspaceId || !teamId || !projectId) return
              if (nextTab === 'documentation') {
                navigate(
                  `/workspace/${workspaceId}/team/${teamId}/projects/${projectId}/documentation`
                )
                return
              }
              if (activeTab === 'documentation') {
                navigate(
                  `/workspace/${workspaceId}/team/${teamId}/projects/${projectId}`
                )
              }
            }}
          />

          {activeTab === 'overview' && (
            <Box border padding="400">
              <div className="mb-4 flex items-start justify-between gap-4">
                <Stack gap="200">
                  <Inline align="center" gap="100">
                    <Avatar name={projectName[0]?.toUpperCase() ?? 'P'} />
                    <Text variant="heading4">{projectName}</Text>
                  </Inline>
                  <Inline fullWidth>
                    <Button
                      icon={<Plus size={16} />}
                      variant="warning"
                      size="small"
                      onClick={noop}
                    >
                      Add document or link
                    </Button>
                    <Button
                      variant="info"
                      size="small"
                      onClick={handleGenerateSummary}
                      disabled={summaryLoading}
                      icon={<Plus size={16} />}
                    >
                      {summaryLoading ? 'Generating…' : 'Generate Summary'}
                    </Button>
                  </Inline>
                </Stack>
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
                  <Text variant="body3">{summaryError}</Text>
                  <div className="mt-2">
                    <Button
                      variant="glass"
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
                    <Banner
                      size="small"
                      variant="default"
                      title="Write the first project update to get started"
                    />
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
            </Box>
          )}

          {activeTab === 'updates' && (
            <Box border padding="400">
              <Stack gap="300">
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
            </Box>
          )}

          {activeTab === 'issues' && (
            <Box border padding="400">
              <Stack gap="300">
                <Inline align="center" justify="space-between" fullWidth>
                  {issuesLoading ? (
                    <Text variant="body3" color="color.text.subtle">
                      Loading issues...
                    </Text>
                  ) : (
                    <Badge size="small" variant="default">
                      {`${issues.length} issue${issues.length === 1 ? '' : 's'}`}
                    </Badge>
                  )}
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
                </Inline>

                {issuesLoading ? (
                  <Text variant="body3" color="color.text.subtle">
                    Loading...
                  </Text>
                ) : issues.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                    <Text variant="body3" color="color.text.subtle">
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
                            size="small"
                          />
                        ) : (
                          <MetaText>-</MetaText>
                        )}
                      </DataRow>
                    ))}
                  </TableWrap>
                )}
              </Stack>
            </Box>
          )}

          {activeTab === 'documentation' && (
            <Box border padding="400">
              <Stack gap="200">
                <Inline align="center" justify="space-between" fullWidth>
                  <Text variant="heading5">Project documentation</Text>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSaveDocumentation}
                    disabled={docSaving || !hasDocChanges}
                  >
                    {docSaving ? 'Saving...' : 'Save'}
                  </Button>
                </Inline>

                {docLastUpdatedAt ? (
                  <Text variant="caption2" color="color.text.subtle">
                    Updated {formatDateTime(docLastUpdatedAt)}
                    {docLastUpdatedBy ? ` by ${docLastUpdatedBy}` : ''}
                  </Text>
                ) : (
                  <Text variant="caption2" color="color.text.subtle">
                    No documentation saved yet.
                  </Text>
                )}

                {docError ? (
                  <Stack gap="100">
                    <Banner variant="danger" size="small" title={docError} />
                    <Inline>
                      <Button
                        variant="glass"
                        size="small"
                        onClick={handleSaveDocumentation}
                        disabled={docSaving || !hasDocChanges}
                      >
                        Retry
                      </Button>
                    </Inline>
                  </Stack>
                ) : null}

                {docLoading ? (
                  <Text variant="body3" color="color.text.subtle">
                    Loading documentation...
                  </Text>
                ) : (
                  <div className="min-w-0 overflow-visible">
                    <TextEditor
                      key={`doc-editor-${docEditorMountKey}`}
                      onChange={setDocContent}
                      autoFocus={false}
                    />
                  </div>
                )}
              </Stack>
            </Box>
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
              isActive
            />
          )}
        </section>

        <aside>
          <Stack gap="100">
            <Box border padding="300">
              <Inline align="center" justify="space-between" fullWidth>
                <Text variant="body3">Properties</Text>
              </Inline>
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
            </Box>

            <Box border padding="300">
              <Inline align="center" justify="space-between" fullWidth>
                <Text variant="heading4">Milestones</Text>
                <Button
                  size="small"
                  onClick={handleAddMilestone}
                  icon={<Plus size={14} />}
                >
                  Create
                </Button>
              </Inline>
              <Text variant="caption2" color="color.text.subtle">
                Add milestones to organize work into granular stages.
              </Text>
            </Box>

            <Box border padding="300">
              <Inline align="center" justify="space-between" fullWidth>
                <Text variant="body3">Activity</Text>
                <Button buttonType="link" size="small" onClick={noop}>
                  See all
                </Button>
              </Inline>
              {activity.length > 0 ? (
                <Text variant="body3" color="color.text.subtle">
                  {activity.length} recent activit
                  {activity.length === 1 ? 'y' : 'ies'}
                </Text>
              ) : (
                <Text variant="body3" color="color.text.subtle">
                  No activity yet
                </Text>
              )}
            </Box>
          </Stack>
        </aside>
      </div>

      <Modal
        open={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        title="Create New Milestone"
        size="medium"
        footer={
          <Inline justify="flex-end" gap="100" fullWidth>
            <Button
              variant="glass"
              onClick={() => setShowMilestoneModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateMilestone}>
              Create
            </Button>
          </Inline>
        }
      >
        <Stack gap="300">
          <div>
            <Text as="div" variant="body3" style={{ marginBottom: 8 }}>
              Milestone Name
            </Text>
            <Input
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Enter milestone name"
            />
          </div>
          <div>
            <Text as="div" variant="body3" style={{ marginBottom: 8 }}>
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
