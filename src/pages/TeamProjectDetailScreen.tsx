import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Stack,
  Text,
  Tabs,
  Modal,
  Input,
  Button,
  Card,
  Flex,
  Avatar,
} from '@design-system'
import type { ChatMessage, ChatUser, TabItem } from '@design-system'
import {
  StatusUpdateCard,
  StatusUpdateComposer,
  MilestonesSection,
  ActivitySection,
  PropertiesSection,
} from '../components'
import type {
  StatusUpdateCardData,
  ProjectStatus,
  MilestoneItem,
  ActivityItem,
} from '../components'
import { noop } from '../utils/noop'
import { formatDateTime } from '../utils/format'
import { logError } from '../utils/errorHandling'
import {
  fetchTeamProject,
  fetchTeamProjectIssues,
  postStatusUpdate,
  postComment,
  createMilestone,
  patchProject,
  generateProjectSummary,
} from '../api/client'
import type { ApiStatusUpdate, ApiProjectProperties } from '../api/client'
import { useFetch } from '../hooks/useFetch'

const ContentSection = styled.div`
  padding: 24px 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
`

const ClickableCardWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.95;
  }
`

const CenterMessage = styled.div`
  text-align: center;
  padding: 48px 0;
`

type Props = { projectName: string; teamId: string }

const DEFAULT_CURRENT_USER: ChatUser = { name: 'You' }

function apiUpdateToCard(u: ApiStatusUpdate): StatusUpdateCardData {
  return {
    id: u.id,
    status: u.status,
    authorName: u.author.name,
    timestamp: formatDateTime(u.createdAt),
    content: u.content,
    commentCount: u.commentCount,
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
  min-height: 0;
`

const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 16px;
  span {
    color: ${(p) => p.theme.colors.text};
  }
`

const TabsContainer = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  margin-bottom: 24px;
`

const PageHeader = styled.div`
  text-align: center;
  padding: 32px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  margin-bottom: 24px;
`

const ProjectIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-weight: 600;
  font-size: 18px;
`

const MainContent = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`

const ProjectTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const ProjectSummary = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
`

const HeaderActions = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const SummaryBlock = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  margin-bottom: 24px;
`

const SummaryText = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 12px;
`

const SummaryActions = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`

const PropertiesSidebar = styled.aside`
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  overflow: hidden;
`

const SidebarSection = styled.div`
  padding: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }
`

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

export function TeamProjectDetailScreen({ projectName, teamId }: Props) {
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
    Record<string, ChatMessage[]>
  >({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [milestoneName, setMilestoneName] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [projectSummary, setProjectSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const { data: projectIssues, loading: issuesLoading } = useFetch(
    () =>
      teamId
        ? fetchTeamProjectIssues(teamId, 'all', projectId)
        : Promise.resolve([]),
    [teamId, projectId]
  )
  const issues = projectIssues ?? []

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'updates', label: 'Updates' },
    { id: 'issues', label: 'Issues' },
  ]

  useEffect(() => {
    if (!teamId) return
    setLoading(true)
    fetchTeamProject(teamId)
      .then((data) => {
        if (!data.project) {
          setUpdates([])
          setMilestones([])
          setActivity([])
          setProperties({})
          return
        }
        setUpdates(data.project.statusUpdates.nodes.map(apiUpdateToCard))
        setMilestones(
          data.project.milestones.map((m) => ({
            id: m.id,
            name: m.name,
            progress: m.progress,
            total: m.total,
            targetDate: m.targetDate,
          }))
        )
        setActivity(
          data.project.activity.map((a) => ({
            ...a,
            date: formatDateTime(a.date),
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
      .then((u) => setUpdates((prev) => [apiUpdateToCard(u), ...prev]))
      .catch((e) => logError(e, 'TeamProjectDetail'))
  }

  const handleSendComment = (updateId: string) => (text: string) => {
    if (!teamId) return
    void postComment(teamId, updateId, text)
      .then((c) => {
        const msg: ChatMessage = {
          id: c.id,
          authorName: c.authorName,
          timestamp: formatDateTime(c.timestamp),
          content: c.content,
        }
        setCommentsByUpdateId((prev) => ({
          ...prev,
          [updateId]: [...(prev[updateId] ?? []), msg],
        }))
        setUpdates((prev) =>
          prev.map((u) =>
            u.id === updateId
              ? { ...u, commentCount: (u.commentCount ?? 0) + 1 }
              : u
          )
        )
      })
      .catch((e) => logError(e, 'TeamProjectDetail'))
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
      .then((m) => {
        setMilestones((prev) => [
          ...prev,
          {
            id: m.id,
            name: m.name,
            progress: m.progress,
            total: m.total,
            targetDate: m.targetDate,
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
    setProperties((p) => (p ? { ...p, status } : null))
    void patchProject(teamId, { status }).catch((e) =>
      logError(e, 'TeamProjectDetail')
    )
  }

  const handlePriorityChange = (priority: string) => {
    if (!teamId) return
    setProperties((p) => (p ? { ...p, priority } : null))
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

  if (loading) {
    return (
      <Layout>
        <MainContent>
          <Breadcrumb>
            Projects &gt; <span>{projectName}</span>
          </Breadcrumb>
          <Text size="sm" muted>
            Loading project...
          </Text>
        </MainContent>
        <PropertiesSidebar />
      </Layout>
    )
  }

  return (
    <Layout>
      <MainContent>
        <Breadcrumb>
          Projects &gt; <span>{projectName}</span>
        </Breadcrumb>

        <TabsContainer>
          <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
        </TabsContainer>

        {activeTab === 'overview' && (
          <>
            <PageHeader>
              <ProjectIcon>{projectName[0]?.toUpperCase() ?? 'P'}</ProjectIcon>
              <ProjectTitle>{projectName}</ProjectTitle>
              <ProjectSummary>
                Track progress, updates, and milestones for this project.
              </ProjectSummary>
              <HeaderActions>
                <Button
                  variant="secondary"
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                >
                  {summaryLoading ? 'Generating…' : 'Generate Summary'}
                </Button>
              </HeaderActions>
            </PageHeader>

            {projectSummary !== null ? (
              <SummaryBlock>
                <SummaryText>{projectSummary}</SummaryText>
                <SummaryActions>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectSummary(null)
                      setSummaryError(null)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: 'inherit',
                    }}
                  >
                    Show latest updates
                  </button>
                  {' · '}
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: summaryLoading ? 'not-allowed' : 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontSize: 'inherit',
                    }}
                  >
                    {summaryLoading ? 'Generating…' : 'Regenerate summary'}
                  </button>
                </SummaryActions>
              </SummaryBlock>
            ) : summaryError ? (
              <Stack gap={3}>
                <CenterMessage>
                  <Stack gap={2}>
                    <Text size="sm" muted>
                      {summaryError}
                    </Text>
                    <Button
                      variant="secondary"
                      onClick={handleGenerateSummary}
                      disabled={summaryLoading}
                    >
                      Try again
                    </Button>
                  </Stack>
                </CenterMessage>
                <StatusUpdateComposer
                  placeholder="Write a project update..."
                  onPost={handlePostUpdate}
                  onChooseFile={noop}
                  onCreateDocument={noop}
                  onAddLink={noop}
                />
              </Stack>
            ) : (
              <Stack gap={3}>
                {updates.length === 0 ? (
                  <CenterMessage>
                    <Text size="sm" muted>
                      Write the first project update to get started
                    </Text>
                  </CenterMessage>
                ) : (
                  updates.map((u) => (
                    <StatusUpdateCard
                      key={u.id}
                      data={u}
                      comments={commentsByUpdateId[u.id]}
                      currentUser={DEFAULT_CURRENT_USER}
                      onSendComment={handleSendComment(u.id)}
                      onMore={noop}
                    />
                  ))
                )}
                <StatusUpdateComposer
                  placeholder="Write a project update..."
                  onPost={handlePostUpdate}
                  onChooseFile={noop}
                  onCreateDocument={noop}
                  onAddLink={noop}
                />
              </Stack>
            )}

            <ContentSection>
              <MilestonesSection
                milestones={milestones}
                onAdd={handleAddMilestone}
              />
            </ContentSection>

            <ContentSection>
              <ActivitySection items={activity} />
            </ContentSection>
          </>
        )}

        {activeTab === 'updates' && (
          <ContentSection>
            <Stack gap={3}>
              {updates.map((u) => (
                <StatusUpdateCard
                  key={u.id}
                  data={u}
                  comments={commentsByUpdateId[u.id]}
                  currentUser={DEFAULT_CURRENT_USER}
                  onSendComment={handleSendComment(u.id)}
                  onMore={noop}
                />
              ))}
              <StatusUpdateComposer
                placeholder="Write a project update..."
                onPost={handlePostUpdate}
                onChooseFile={noop}
                onCreateDocument={noop}
                onAddLink={noop}
              />
            </Stack>
          </ContentSection>
        )}

        {activeTab === 'issues' && (
          <ContentSection>
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
                <EmptyState>
                  <Text size="sm" muted>
                    No issues in this project yet
                  </Text>
                </EmptyState>
              ) : (
                <Stack gap={1}>
                  {issues.map((issue) => (
                    <ClickableCardWrapper
                      key={issue.id}
                      onClick={() =>
                        workspaceId &&
                        teamId &&
                        navigate(
                          `/workspace/${workspaceId}/team/${teamId}/issue/${issue.id}`
                        )
                      }
                    >
                      <Card>
                        <Flex align="center" gap={2}>
                          <Text size="sm">{issue.id}</Text>
                          <span style={{ flex: 1 }}>
                            <Text size="sm" as="span">
                              {issue.title}
                            </Text>
                          </span>
                          {issue.assignee ? (
                            <Avatar name={issue.assignee.name} size={24} />
                          ) : (
                            <span style={{ width: 24 }} />
                          )}
                          <Text size="xs" muted>
                            {formatDateTime(issue.date)}
                          </Text>
                        </Flex>
                      </Card>
                    </ClickableCardWrapper>
                  ))}
                </Stack>
              )}
            </Stack>
          </ContentSection>
        )}
      </MainContent>

      <PropertiesSidebar>
        <SidebarSection>
          <SectionLabel>Properties</SectionLabel>
          <PropertiesSection
            key={`${properties?.status}-${properties?.priority}`}
            contentOnly
            defaultStatus={properties?.status}
            defaultPriority={properties?.priority}
            defaultStartDate={
              properties?.startDate ? new Date(properties.startDate) : undefined
            }
            defaultEndDate={
              properties?.endDate ? new Date(properties.endDate) : undefined
            }
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
        </SidebarSection>
      </PropertiesSidebar>

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
    </Layout>
  )
}
