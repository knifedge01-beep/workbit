import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { TeamIssuesScreen } from './TeamIssuesScreen'
import { TeamProjectsScreen } from './TeamProjectsScreen'
import { TeamProjectDetailScreen } from './TeamProjectDetailScreen'
import { TeamViewsScreen } from './TeamViewsScreen'
import { TeamLogsScreen } from './TeamLogsScreen'
import { IssueDetailScreen } from './IssueDetailScreen'

const RESERVED_TEAM_SEGMENTS = new Set([
  'issues',
  'issue',
  'projects',
  'views',
  'logs',
  'member',
  'teams',
  'new',
])

function useTeamName(teamId: string | undefined) {
  const { teams } = useWorkspace()
  return teams.find((t) => t.id === teamId)?.name ?? teamId ?? 'Team'
}

function useRedirectIfInvalidTeam() {
  const { workspaceId, teamId } = useParams<{
    workspaceId: string
    teamId: string
  }>()
  const navigate = useNavigate()
  const { teams, teamsLoading } = useWorkspace()

  useEffect(() => {
    if (!workspaceId || !teamId || teamsLoading) return
    const isReserved = RESERVED_TEAM_SEGMENTS.has(teamId)
    const isValidTeam = teams.some((t) => t.id === teamId)
    if (isReserved || !isValidTeam) {
      if (teams.length > 0) {
        navigate(
          `/workspace/${workspaceId}/team/${teams[0].id}/issues/active`,
          { replace: true }
        )
      } else {
        navigate(`/workspace/${workspaceId}/workspace/teams`, { replace: true })
      }
    }
  }, [workspaceId, teamId, teams, teamsLoading, navigate])
}

export function TeamIssuesScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamIssuesScreen teamName={teamName} />
}

export function TeamProjectsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamProjectsScreen teamName={teamName} />
}

export function TeamProjectDetailScreenWrapper() {
  const { teamId, projectId } = useParams<{
    teamId: string
    projectId: string
  }>()
  useRedirectIfInvalidTeam()
  const { projects } = useWorkspace()
  const projectName =
    (teamId &&
      projectId &&
      projects.find((p) => p.team.id === teamId && p.id === projectId)?.name) ??
    projectId ??
    'Project'
  return (
    <TeamProjectDetailScreen projectName={projectName} teamId={teamId ?? ''} />
  )
}

export function TeamViewsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamViewsScreen teamName={teamName} />
}

export function TeamLogsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  useRedirectIfInvalidTeam()
  const teamName = useTeamName(teamId)
  return <TeamLogsScreen teamName={teamName} />
}

export function IssueDetailScreenWrapper() {
  const { teamId, issueId } = useParams<{ teamId: string; issueId: string }>()
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
