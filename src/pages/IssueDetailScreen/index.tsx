import { useState, useRef, useCallback } from 'react'
import { Breadcrumbs, BreadcrumbsItem } from '@thedatablitz/breadcrumb'
import { Button } from '@thedatablitz/button'
import { Text } from '@thedatablitz/text'
import { Stack } from '@thedatablitz/stack'
import { Inline } from '@thedatablitz/inline'
import {
  LoadingState,
  ErrorState,
  IssueDescriptionEditor,
  IssueActivity,
  IssueProperties,
  SubIssues,
} from '../../components'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import {
  fetchIssue,
  updateIssue,
  fetchMembers,
  generateSubIssues,
} from '../../api/client'
import { formatDateTime, logError } from '../../utils'
import type { IssueDetailScreenProps } from './types'
import { Box } from '@thedatablitz/box'

// ===== MAIN COMPONENT =====

export function IssueDetailScreen({
  issueId,
  teamName,
  projectName,
}: IssueDetailScreenProps) {
  const [priority, setPriority] = useState('medium')
  const [generatingSubIssues, setGeneratingSubIssues] = useState(false)
  const { projects: workspaceProjects } = useWorkspace()
  const teamId = workspaceProjects.find((p) => p.name === projectName)?.team.id

  const {
    data: issueData,
    loading,
    error,
    reload,
  } = useFetch(() => fetchIssue(issueId), [issueId])

  const { data: members } = useFetch(() => fetchMembers(), [])

  const teamProjects = teamId
    ? workspaceProjects.filter((p) => p.team.id === teamId)
    : []

  const projectOptions = [
    { value: '', label: 'No project' },
    ...teamProjects.map((p) => ({ value: p.id, label: p.name })),
  ]

  const assigneeOptions = [
    { value: '', label: 'No assignee' },
    ...(members ?? []).map((m) => ({ value: m.id, label: m.name })),
  ]

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateIssue(issueId, { status: newStatus })
      reload()
    } catch (e) {
      logError(e, 'Status update')
    }
  }

  const handleProjectChange = async (value: string) => {
    try {
      await updateIssue(issueId, { projectId: value === '' ? null : value })
      reload()
    } catch (e) {
      logError(e, 'Project update')
    }
  }

  const handleAssigneeChange = async (value: string) => {
    try {
      const member = (members ?? []).find((m) => m.id === value)
      await updateIssue(issueId, {
        assigneeId: value === '' ? undefined : value,
        assigneeName: member?.name,
      })
      reload()
    } catch (e) {
      logError(e, 'Assignee update')
    }
  }

  const descriptionLatestRef = useRef('')
  const descriptionDirtyRef = useRef(false)

  const handleDescriptionChange = useCallback((html: string) => {
    descriptionLatestRef.current = html
    descriptionDirtyRef.current = true
  }, [])

  const handleDescriptionBlur = useCallback(() => {
    if (!descriptionDirtyRef.current) return
    descriptionDirtyRef.current = false
    updateIssue(issueId, { description: descriptionLatestRef.current }).catch(
      (e) => logError(e, 'Description update')
    )
  }, [issueId])

  const descriptionForEditor = issueData?.description ?? ''
  const editorKey = `editor-${issueId}`

  const handleBreakdownWork = async () => {
    if (generatingSubIssues) return
    setGeneratingSubIssues(true)
    try {
      await generateSubIssues(issueId)
      // Intentionally not rendering output yet; only trigger generation.
    } catch (e) {
      logError(e, 'Generate sub-issues')
    } finally {
      setGeneratingSubIssues(false)
    }
  }

  if (loading) {
    return (
      <Box fullWidth>
        <Stack fullWidth padding="300">
          <LoadingState message="Loading issue details..." fullHeight />
        </Stack>
      </Box>
    )
  }

  if (error || !issueData) {
    return (
      <Box fullWidth>
        <Stack fullWidth padding="300">
          <ErrorState error={error} message="Issue not found" fullHeight />
        </Stack>
      </Box>
    )
  }

  const issue = {
    id: issueData.id,
    title: issueData.title,
    createdAt: formatDateTime(issueData.date),
    status: issueData.status,
    project: issueData.project?.name || projectName || 'No Project',
  }

  return (
    <Box fullWidth border>
      <IssueProperties
        status={issue.status}
        onStatusChange={handleStatusChange}
        priority={priority}
        onPriorityChange={setPriority}
        assigneeValue={issueData?.assignee?.id ?? ''}
        assigneeOptions={assigneeOptions}
        onAssigneeChange={handleAssigneeChange}
        projectValue={issueData?.project?.id ?? ''}
        projectOptions={projectOptions}
        onProjectChange={handleProjectChange}
        createdAt={issue.createdAt}
      />
      <Stack fullWidth>
        <Box fullWidth padding="200">
          <Breadcrumbs ariaLabel="Breadcrumb">
            <BreadcrumbsItem href="/item" text={teamName} />
            <BreadcrumbsItem href="/item" text={issue.project} />
            <BreadcrumbsItem href="/item" text={issue.id} />
          </Breadcrumbs>
        </Box>

        <Stack fullWidth padding="300" gap="200">
          <Inline fullWidth justify="space-between" align="center" gap="100">
            <Text as="h1" variant="heading3">
              {issue.title}
            </Text>
            <Button
              variant="ai"
              disabled={generatingSubIssues}
              onClick={() => void handleBreakdownWork()}
            >
              Breakdown the work
            </Button>
          </Inline>

          <Box fullWidth>
            <IssueDescriptionEditor
              key={editorKey}
              defaultValue={descriptionForEditor}
              value={undefined}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              placeholder="Add description..."
              stickyToolbar={false}
              toolbarTop={56}
              alwaysShowToolbar={false}
            />
          </Box>

          <SubIssues parentIssueId={issueId} />

          <IssueActivity entityId={issueId} />
        </Stack>
      </Stack>
    </Box>
  )
}
