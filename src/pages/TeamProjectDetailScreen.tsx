import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Stack, Text } from '@design-system'
import type { ChatMessage, ChatUser } from '@design-system'
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
import {
  fetchTeamProject,
  postStatusUpdate,
  postComment,
  createMilestone,
  patchProject,
} from '../api/client'
import type { ApiStatusUpdate, ApiProjectProperties } from '../api/client'

type Props = { teamName: string; projectName: string; teamId: string }

const DEFAULT_CURRENT_USER: ChatUser = { name: 'You' }

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function apiUpdateToCard(u: ApiStatusUpdate): StatusUpdateCardData {
  return {
    id: u.id,
    status: u.status,
    authorName: u.author.name,
    timestamp: fmtDate(u.createdAt),
    content: u.content,
    commentCount: u.commentCount,
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  align-items: start;
  min-height: 0;
`

const MainContent = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PageTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const ProjectTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  flex: 1;
`

const SubTitle = styled.span`
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`

const PropertiesSidebar = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
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

export function TeamProjectDetailScreen({
  teamName,
  projectName,
  teamId,
}: Props) {
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

  useEffect(() => {
    if (!teamId) return
    setLoading(true)
    fetchTeamProject(teamId)
      .then((data) => {
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
        setActivity(data.project.activity)
        setProperties(data.project.properties)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [teamId])

  const handlePostUpdate = (content: string, status: ProjectStatus) => {
    if (!teamId) return
    void postStatusUpdate(teamId, content, status)
      .then((u) => setUpdates((prev) => [apiUpdateToCard(u), ...prev]))
      .catch(console.error)
  }

  const handleSendComment = (updateId: string) => (text: string) => {
    if (!teamId) return
    void postComment(teamId, updateId, text)
      .then((c) => {
        const msg: ChatMessage = {
          id: c.id,
          authorName: c.authorName,
          timestamp: fmtDate(c.timestamp),
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
      .catch(console.error)
  }

  const handleAddMilestone = () => {
    if (!teamId) return
    const name = window.prompt('Milestone name:')
    if (!name) return
    const targetDate = window.prompt('Target date (e.g. Mar 15):', '') ?? ''
    void createMilestone(teamId, { name, targetDate })
      .then((m) =>
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
      )
      .catch(console.error)
  }

  const handleStatusChange = (status: string) => {
    if (!teamId) return
    setProperties((p) => (p ? { ...p, status } : null))
    void patchProject(teamId, { status }).catch(console.error)
  }

  const handlePriorityChange = (priority: string) => {
    if (!teamId) return
    setProperties((p) => (p ? { ...p, priority } : null))
    void patchProject(teamId, { priority }).catch(console.error)
  }

  if (loading) {
    return (
      <Layout>
        <MainContent>
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
        <PageTitleRow>
          <div>
            <ProjectTitle>{projectName}</ProjectTitle>
            <SubTitle>in {teamName}</SubTitle>
          </div>
        </PageTitleRow>

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

        <MilestonesSection milestones={milestones} onAdd={handleAddMilestone} />
        <ActivitySection items={activity} />
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
    </Layout>
  )
}
