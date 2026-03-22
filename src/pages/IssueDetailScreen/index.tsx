import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs, BreadcrumbsItem } from '@thedatablitz/breadcrumb'
import { Button } from '@thedatablitz/button'
import { Text } from '@thedatablitz/text'
import { TextEditor } from '@thedatablitz/text-editor'
import { Stack } from '@thedatablitz/stack'
import { Inline } from '@thedatablitz/inline'
import {
  LoadingState,
  ErrorState,
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
import { stringToLexicalEditorState } from '../../utils/textEditorState'
import type { IssueDetailScreenProps } from './types'
import { Box } from '@thedatablitz/box'

// ===== MAIN COMPONENT =====

export function IssueDetailScreen({
  issueId,
  teamName,
  projectName,
}: IssueDetailScreenProps) {
  const { workspaceId, teamId } = useParams<{
    workspaceId: string
    teamId: string
  }>()
  const [priority, setPriority] = useState('medium')
  const [generatingSubIssues, setGeneratingSubIssues] = useState(false)
  const { projects: workspaceProjects } = useWorkspace()
  const issueTeamId = workspaceProjects.find((p) => p.name === projectName)
    ?.team.id

  const {
    data: issueData,
    loading,
    error,
    reload,
  } = useFetch(() => fetchIssue(issueId), [issueId])

  const { data: members } = useFetch(() => fetchMembers(), [])

  const teamProjects = issueTeamId
    ? workspaceProjects.filter((p) => p.team.id === issueTeamId)
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
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const issueIdRef = useRef(issueId)
  issueIdRef.current = issueId

  const handleDescriptionChange = useCallback((json: string) => {
    descriptionLatestRef.current = json
    descriptionDirtyRef.current = true
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null
      if (!descriptionDirtyRef.current) return
      descriptionDirtyRef.current = false
      void updateIssue(issueIdRef.current, {
        description: descriptionLatestRef.current,
      }).catch((e) => logError(e, 'Description update'))
    }, 800)
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      if (descriptionDirtyRef.current) {
        descriptionDirtyRef.current = false
        void updateIssue(issueId, {
          description: descriptionLatestRef.current,
        }).catch((e) => logError(e, 'Description update'))
      }
    }
  }, [issueId])

  useEffect(() => {
    descriptionLatestRef.current = stringToLexicalEditorState(
      issueData?.description
    )
    descriptionDirtyRef.current = false
  }, [issueData?.id]) // eslint-disable-line react-hooks/exhaustive-deps -- only when switching issues

  const issueDescriptionDefaultLexical = useMemo(
    () => stringToLexicalEditorState(issueData?.description),
    [issueData?.description]
  )

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

  const teamHref =
    workspaceId && teamId
      ? `/workspace/${workspaceId}/team/${teamId}/issues/active`
      : workspaceId
        ? `/workspace/${workspaceId}/workspace/teams`
        : '#'
  const projectHref =
    workspaceId && teamId
      ? `/workspace/${workspaceId}/team/${teamId}/projects`
      : workspaceId
        ? `/workspace/${workspaceId}/workspace/projects`
        : '#'
  const issueHref =
    workspaceId && teamId
      ? `/workspace/${workspaceId}/team/${teamId}/issue/${issue.id}`
      : '#'

  return (
    <Box fullWidth border>
      <Stack fullWidth>
        <Stack fullWidth padding="200" gap="150">
          <Breadcrumbs ariaLabel="Breadcrumb">
            <BreadcrumbsItem href={teamHref} text={teamName} />
            <BreadcrumbsItem href={projectHref} text={issue.project} />
            <BreadcrumbsItem href={issueHref} text={issue.id} />
          </Breadcrumbs>
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
          />
        </Stack>

        <Stack fullWidth padding="200" gap="100">
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
            <TextEditor
              key={issueId}
              defaultEditorState={issueDescriptionDefaultLexical}
              onChange={handleDescriptionChange}
              placeholder="Add description…"
              autoFocus={false}
            />
          </Box>

          <SubIssues parentIssueId={issueId} />

          <IssueActivity entityId={issueId} />
        </Stack>
      </Stack>
    </Box>
  )
}
