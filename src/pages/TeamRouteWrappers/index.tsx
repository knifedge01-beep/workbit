import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { TeamIssuesScreen } from '../TeamIssuesScreen'
import { TeamProjectsScreen } from '../TeamProjectsScreen'
import { TeamProjectDetailScreen } from '../TeamProjectDetailScreen'
import { IssueDetailScreen } from '../IssueDetailScreen'
import { ProjectDocumentEditorScreen } from '../ProjectDocumentEditorScreen'
import type {
  TeamIssueRouteParams,
  TeamProjectDocumentRouteParams,
  TeamProjectRouteParams,
  TeamRouteParams,
} from './types'
import { RESERVED_TEAM_SEGMENTS, resolveTeamName } from './utils'

function useTeamName(teamId: string | undefined) {
  const { teams } = useWorkspace()
  return resolveTeamName(teams, teamId)
}

function useRedirectIfInvalidTeam() {
  const { workspaceId, teamId } = useParams<TeamRouteParams>()
  const navigate = useNavigate()
  const { teams, teamsLoading } = useWorkspace()

  useEffect(() => {
    if (!workspaceId || !teamId || teamsLoading) return
    const isReserved = RESERVED_TEAM_SEGMENTS.has(teamId)
    const isValidTeam = teams.some((team) => team.id === teamId)
    if (isReserved || !isValidTeam) {
      if (teams.length > 0) {
        navigate(
          `/workspace/${workspaceId}/team/${teams[0].id}/issues/active`,
          {
            replace: true,
          }
        )
      } else {
        navigate(`/workspace/${workspaceId}/workspace/teams`, { replace: true })
      }
    }
  }, [workspaceId, teamId, teams, teamsLoading, navigate])
}

export function TeamIssuesScreenWrapper() {
  const { teamId } = useParams<TeamRouteParams>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamIssuesScreen teamName={teamName} />
}

export function TeamProjectsScreenWrapper() {
  const { teamId } = useParams<TeamRouteParams>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamProjectsScreen teamName={teamName} />
}

export function TeamProjectDetailScreenWrapper() {
  const { teamId, projectId } = useParams<TeamProjectRouteParams>()
  useRedirectIfInvalidTeam()
  const { projects } = useWorkspace()
  const projectName =
    (teamId &&
      projectId &&
      projects.find(
        (project) => project.team.id === teamId && project.id === projectId
      )?.name) ??
    projectId ??
    'Project'

  return (
    <TeamProjectDetailScreen
      projectName={projectName}
      teamId={teamId ?? ''}
      initialTab="overview"
    />
  )
}

export function TeamProjectDocumentationScreenWrapper() {
  const { teamId, projectId } = useParams<TeamProjectRouteParams>()
  useRedirectIfInvalidTeam()
  const { projects } = useWorkspace()
  const projectName =
    (teamId &&
      projectId &&
      projects.find(
        (project) => project.team.id === teamId && project.id === projectId
      )?.name) ??
    projectId ??
    'Project'

  return (
    <TeamProjectDetailScreen
      projectName={projectName}
      teamId={teamId ?? ''}
      initialTab="documentation"
      documentationMode="list"
    />
  )
}

export function TeamProjectNewDocumentScreenWrapper() {
  const { teamId, projectId } = useParams<TeamProjectRouteParams>()
  useRedirectIfInvalidTeam()
  const { projects } = useWorkspace()
  const projectName =
    (teamId &&
      projectId &&
      projects.find(
        (project) => project.team.id === teamId && project.id === projectId
      )?.name) ??
    projectId ??
    'Project'

  return <ProjectDocumentEditorScreen projectName={projectName} mode="new" />
}

export function TeamProjectEditDocumentScreenWrapper() {
  const { teamId, projectId } = useParams<TeamProjectDocumentRouteParams>()
  useRedirectIfInvalidTeam()
  const { projects } = useWorkspace()
  const projectName =
    (teamId &&
      projectId &&
      projects.find(
        (project) => project.team.id === teamId && project.id === projectId
      )?.name) ??
    projectId ??
    'Project'

  return <ProjectDocumentEditorScreen projectName={projectName} mode="edit" />
}

export function IssueDetailScreenWrapper() {
  const { teamId, issueId } = useParams<TeamIssueRouteParams>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return (
    <IssueDetailScreen
      issueId={issueId ?? 'ISSUE-1'}
      teamId={teamId ?? ''}
      teamName={teamName}
    />
  )
}
