import { useParams } from 'react-router-dom'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { TeamIssuesScreen } from './TeamIssuesScreen'
import { TeamProjectsScreen } from './TeamProjectsScreen'
import { TeamProjectDetailScreen } from './TeamProjectDetailScreen'
import { TeamViewsScreen } from './TeamViewsScreen'
import { TeamLogsScreen } from './TeamLogsScreen'
import { IssueDetailScreen } from './IssueDetailScreen'

function useTeamName(teamId: string | undefined) {
  const { teams } = useWorkspace()
  return teams.find((t) => t.id === teamId)?.name ?? teamId ?? 'Team'
}

export function TeamIssuesScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const teamName = useTeamName(teamId)
  return <TeamIssuesScreen teamName={teamName} />
}

export function TeamProjectsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const teamName = useTeamName(teamId)
  return <TeamProjectsScreen teamName={teamName} />
}

export function TeamProjectDetailScreenWrapper() {
  const { teamId, projectId } = useParams<{
    teamId: string
    projectId: string
  }>()
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
  const teamName = useTeamName(teamId)
  return <TeamViewsScreen teamName={teamName} />
}

export function TeamLogsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const teamName = useTeamName(teamId)
  return <TeamLogsScreen teamName={teamName} />
}

export function IssueDetailScreenWrapper() {
  const { teamId, issueId } = useParams<{ teamId: string; issueId: string }>()
  const teamName = useTeamName(teamId)
  return (
    <IssueDetailScreen issueId={issueId ?? 'ISSUE-1'} teamName={teamName} />
  )
}
