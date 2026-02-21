import { useState } from 'react'
import styled from 'styled-components'
import { PageHeader, Stack } from '@design-system'
import type { ChatMessage, ChatUser } from '@design-system'
import {
  MilestoneForm,
  ProjectStatusPanel,
  StatusUpdateCard,
  StatusUpdateComposer,
} from '../components'
import type { StatusUpdateCardData, ProjectStatus } from '../components'
import { noop } from '../utils/noop'

type Props = { teamName: string; projectName: string }

const DEFAULT_CURRENT_USER: ChatUser = { name: 'You' }

/* Break out of main's top/bottom padding so the panel can fill full viewport height */
const MAIN_PADDING = 24

const Layout = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing[4]}px;
  flex: 1;
  min-height: calc(100% + ${MAIN_PADDING * 2}px);
  margin: -${MAIN_PADDING}px 0;
  align-items: stretch;
`

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 0;
  padding: ${MAIN_PADDING}px;
`

const ScrollableContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

const BottomForm = styled.div`
  flex-shrink: 0;
  padding-top: ${(p) => p.theme.spacing[4]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

const Sidebar = styled.aside`
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-left: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.backgroundSubtle ?? p.theme.colors.background};
  overflow-y: auto;
  padding: ${(p) => MAIN_PADDING + p.theme.spacing[4]}px ${(p) => p.theme.spacing[3]}px ${MAIN_PADDING}px;
`

export function TeamProjectDetailScreen({ teamName, projectName }: Props) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined)
  const [latestUpdate, setLatestUpdate] = useState<StatusUpdateCardData | null>(null)
  const [commentsByUpdateId, setCommentsByUpdateId] = useState<Record<string, ChatMessage[]>>({})

  const handlePostUpdate = (content: string, status: ProjectStatus) => {
    const id = `update-${Date.now()}`
    setLatestUpdate({
      id,
      status,
      authorName: 'You',
      timestamp: 'just now',
      content,
      commentCount: 0,
    })
  }

  const handleSendComment = (updateId: string) => (text: string) => {
    const newComment: ChatMessage = {
      id: `comment-${Date.now()}`,
      authorName: DEFAULT_CURRENT_USER.name,
      timestamp: 'just now',
      content: text,
    }
    setCommentsByUpdateId((prev) => ({
      ...prev,
      [updateId]: [...(prev[updateId] ?? []), newComment],
    }))
    setLatestUpdate((prev) =>
      prev && prev.id === updateId
        ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 }
        : prev
    )
  }

  return (
    <Layout>
      <MainContent>
        <ScrollableContent>
          <Stack gap={4}>
            <PageHeader title={projectName} summary={`Project in ${teamName}.`} />

            <Stack gap={3}>
              {latestUpdate && (
                <StatusUpdateCard
                  data={latestUpdate}
                  comments={commentsByUpdateId[latestUpdate.id]}
                  currentUser={DEFAULT_CURRENT_USER}
                  onSendComment={handleSendComment(latestUpdate.id)}
                  onMore={noop}
                />
              )}
              <StatusUpdateComposer
                placeholder="Write a project update..."
                onPost={handlePostUpdate}
                onChooseFile={noop}
                onCreateDocument={noop}
                onAddLink={noop}
              />
            </Stack>
          </Stack>
        </ScrollableContent>

        <BottomForm>
          <MilestoneForm
            targetDate={targetDate}
            onTargetDateChange={setTargetDate}
          />
        </BottomForm>
      </MainContent>

      <Sidebar>
        <ProjectStatusPanel />
      </Sidebar>
    </Layout>
  )
}
