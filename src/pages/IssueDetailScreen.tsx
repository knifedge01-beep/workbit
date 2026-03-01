import { useState } from 'react'
import styled from 'styled-components'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Link2,
  MoreHorizontal,
  Paperclip,
  Send,
  Plus,
} from 'lucide-react'
import { Avatar } from '@design-system'
import {
  StatusSelector,
  PrioritySelector,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components'
import { useFetch } from '../hooks/useFetch'
import { fetchIssue, updateIssue } from '../api/client'
import {
  formatRelativeTime,
  logError,
  IconBtn,
  AddButton,
  Divider,
  Section,
  SectionTitle,
  Breadcrumb,
} from '../utils'

type Props = {
  issueId: string
  teamName: string
  projectName?: string
}

// ===== STYLED COMPONENTS =====

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: flex-end;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  width: 100%;
`

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`

const IssueHeader = styled.div`
  margin-bottom: 24px;
`

const IssueId = styled.span`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-right: 8px;
`

const IssueTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 8px 0 12px;
  line-height: 1.4;
  cursor: text;
  &:hover {
    background: #f9fafb;
    outline: 1px solid #e6e8eb;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 8px -8px 12px;
  }
`

const IssueMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 12px;
`

const DescriptionBox = styled.div`
  min-height: 120px;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
  cursor: text;
  transition: all 0.15s;
  &:hover {
    border-color: #e6e8eb;
    background: #f9fafb;
  }
  &:focus-within {
    border-color: #6366f1;
    background: #ffffff;
  }
  &[data-empty='true'] {
    color: #6b7280;
    font-style: italic;
  }
`

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ResourceItem = styled.div`
  padding: 12px;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f9fafb;
  }
`

const ResourceText = styled.div`
  flex: 1;
  min-width: 0;
`

const ResourceTitle = styled.div`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`

const ResourceUrl = styled.div`
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CommentThread = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }
`

const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CommentAuthor = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`

const CommentTime = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const CommentBody = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
`

const CommentInput = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const CommentTextarea = styled.textarea`
  flex: 1;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: Inter, sans-serif;
  resize: vertical;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  &::placeholder {
    color: #9ca3af;
  }
`

const SendButton = styled.button`
  padding: 8px 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
  &:hover {
    background: #4f46e5;
  }
`

const PropertiesPanel = styled.aside`
  background: #f9fafb;
  padding: 32px 24px;
  overflow-y: auto;
`

const PropertySection = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e6e8eb;
  &:last-child {
    border-bottom: none;
  }
`

const PropertyLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
`

const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  min-height: 36px;
`

const PropertyKey = styled.div`
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
  width: 80px;
`

const PropertyValue = styled.div`
  flex: 1;
  text-align: right;
  font-size: 13px;
  color: #111827;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover {
    background: #e6e8eb;
  }
  &[data-empty='true'] {
    color: #9ca3af;
  }
`

const ActivitySummary = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
`

// ===== MAIN COMPONENT =====

export function IssueDetailScreen({ issueId, teamName, projectName }: Props) {
  const [comment, setComment] = useState('')

  // Fetch issue data from API
  const {
    data: issueData,
    loading,
    error,
    reload,
  } = useFetch(() => fetchIssue(issueId), [issueId])

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateIssue(issueId, { status: newStatus })
      reload()
    } catch (e) {
      logError(e, 'Status update')
    }
  }

  // Handle comment submission
  const handleSendComment = async () => {
    if (!comment.trim()) return
    // TODO: Implement comment API when backend supports it
    console.log('Comment:', comment)
    setComment('')
  }

  if (loading) {
    return (
      <Container>
        <MainColumn>
          <LoadingState message="Loading issue details..." fullHeight />
        </MainColumn>
      </Container>
    )
  }

  if (error || !issueData) {
    return (
      <Container>
        <MainColumn>
          <ErrorState error={error} message="Issue not found" fullHeight />
        </MainColumn>
      </Container>
    )
  }

  // Use API data where available, mock for fields that don't exist yet
  const issue = {
    id: issueData.id,
    title: issueData.title,
    description: `Description for ${issueData.title}

## Details

This issue is currently being worked on. More details coming soon.

### Technical Notes

Add implementation details here.`,
    createdBy: issueData.assignee?.name || 'Unknown',
    createdAt: formatRelativeTime(issueData.date),
    status: issueData.status,
    priority: 'medium', // TODO: Add to backend
    assignee: issueData.assignee?.name || 'Unassigned',
    labels: [], // TODO: Add to backend
    project: issueData.project?.name || projectName || 'No Project',
    dueDate: issueData.date,
    teamId: issueData.teamId,
  }

  // Mock resources (TODO: Add to backend)
  const resources: Array<{ title: string; url: string }> = []

  // Mock comments (TODO: Add to backend)
  const comments: Array<{
    id: string
    author: string
    timestamp: string
    body: string
  }> = []

  return (
    <Container>
      <MainColumn>
        <Breadcrumb>
          {teamName} &gt; {issue.project} &gt; <span>{issue.id}</span>
        </Breadcrumb>
        <HeaderControls>
          <IconBtn aria-label="Star">
            <Star size={16} />
          </IconBtn>
          <IconBtn aria-label="Copy link">
            <Link2 size={16} />
          </IconBtn>
          <IconBtn aria-label="More">
            <MoreHorizontal size={16} />
          </IconBtn>
          <Divider />
          <IconBtn aria-label="Previous issue">
            <ChevronLeft size={16} />
          </IconBtn>
          <IconBtn aria-label="Next issue">
            <ChevronRight size={16} />
          </IconBtn>
        </HeaderControls>

        <IssueHeader>
          <div>
            <IssueId>{issue.id}</IssueId>
          </div>
          <IssueTitle>{issue.title}</IssueTitle>
          <IssueMeta>
            <span>Created by {issue.createdBy}</span>
            <span>•</span>
            <span>{issue.createdAt}</span>
          </IssueMeta>
        </IssueHeader>

        <Section>
          <DescriptionBox>
            <div style={{ whiteSpace: 'pre-wrap' }}>{issue.description}</div>
          </DescriptionBox>
        </Section>

        <Section>
          <SectionTitle>Resources</SectionTitle>
          {resources.length > 0 ? (
            <ResourceList>
              {resources.map((resource, i) => (
                <ResourceItem key={i}>
                  <Link2 size={16} color="#6b7280" />
                  <ResourceText>
                    <ResourceTitle>{resource.title}</ResourceTitle>
                    <ResourceUrl>{resource.url}</ResourceUrl>
                  </ResourceText>
                </ResourceItem>
              ))}
            </ResourceList>
          ) : (
            <EmptyState message="No resources added yet" icon={Link2} />
          )}
          <div style={{ marginTop: 12 }}>
            <AddButton>
              <Plus size={14} />
              Add link
            </AddButton>
          </div>
        </Section>

        <Section>
          <SectionTitle>Activity</SectionTitle>
          {comments.length > 0 ? (
            <CommentThread>
              {comments.map((c) => (
                <CommentItem key={c.id}>
                  <Avatar name={c.author} size={32} />
                  <CommentContent>
                    <CommentHeader>
                      <CommentAuthor>{c.author}</CommentAuthor>
                      <CommentTime>{c.timestamp}</CommentTime>
                    </CommentHeader>
                    <CommentBody>{c.body}</CommentBody>
                  </CommentContent>
                </CommentItem>
              ))}
            </CommentThread>
          ) : (
            <EmptyState message="No comments yet. Be the first to comment!" />
          )}

          <CommentInput>
            <Avatar name="You" size={32} />
            <div style={{ flex: 1 }}>
              <CommentTextarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <IconBtn>
                  <Paperclip size={16} />
                </IconBtn>
                <SendButton onClick={handleSendComment}>
                  <Send size={14} />
                  Comment
                </SendButton>
              </div>
            </div>
          </CommentInput>
        </Section>
      </MainColumn>

      <PropertiesPanel>
        <PropertySection>
          <PropertyLabel>Properties</PropertyLabel>
          <PropertyRow>
            <PropertyKey>Status</PropertyKey>
            <PropertyValue>
              <StatusSelector
                value={issue.status}
                onChange={handleStatusChange}
                triggerVariant="default"
              />
            </PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Priority</PropertyKey>
            <PropertyValue>
              <PrioritySelector
                value={issue.priority}
                onChange={() =>
                  console.log('Priority change - not yet implemented')
                }
                triggerVariant="default"
              />
            </PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Assignee</PropertyKey>
            <PropertyValue>{issue.assignee}</PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Labels</PropertyKey>
            <PropertyValue
              data-empty={issue.labels.length === 0 ? 'true' : undefined}
            >
              {issue.labels.length > 0 ? issue.labels.join(', ') : 'None'}
            </PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Project</PropertyKey>
            <PropertyValue>{issue.project}</PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Due date</PropertyKey>
            <PropertyValue>{issue.dueDate}</PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Estimate</PropertyKey>
            <PropertyValue data-empty="true">None</PropertyValue>
          </PropertyRow>
          <PropertyRow>
            <PropertyKey>Parent</PropertyKey>
            <PropertyValue data-empty="true">None</PropertyValue>
          </PropertyRow>
        </PropertySection>

        <PropertySection>
          <PropertyLabel>Milestones</PropertyLabel>
          <AddButton>
            <Plus size={14} />
            Add milestone
          </AddButton>
        </PropertySection>

        <PropertySection>
          <ActivitySummary>
            Created by {issue.createdBy}
            <br />
            {issue.createdAt}
          </ActivitySummary>
        </PropertySection>
      </PropertiesPanel>
    </Container>
  )
}
