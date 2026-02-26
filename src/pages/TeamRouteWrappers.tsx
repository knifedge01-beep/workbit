import { useParams } from 'react-router-dom'
import { DEMO_TEAMS } from '../constants'
import { TeamIssuesScreen } from './TeamIssuesScreen'
import { TeamProjectsScreen } from './TeamProjectsScreen'
import { TeamProjectDetailScreen } from './TeamProjectDetailScreen'
import { TeamViewsScreen } from './TeamViewsScreen'
import { TeamLogsScreen } from './TeamLogsScreen'
import { IssueDetailScreen } from './IssueDetailScreen'

const MOCK_PROJECT_NAMES: Record<string, Record<string, string>> = {
  Test94: { tes: 'TES', onboarding: 'Onboarding' },
  Design: { 'design-system': 'Design system', brand: 'Brand refresh' },
  Engineering: { platform: 'Platform', 'api-v2': 'API v2' },
}

export function TeamIssuesScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const team = DEMO_TEAMS.find((t) => t.id === teamId)
  return <TeamIssuesScreen teamName={team?.name ?? teamId ?? 'Team'} />
}

export function TeamProjectsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const team = DEMO_TEAMS.find((t) => t.id === teamId)
  return <TeamProjectsScreen teamName={team?.name ?? teamId ?? 'Team'} />
}

export function TeamProjectDetailScreenWrapper() {
  const { teamId, projectId } = useParams<{
    teamId: string
    projectId: string
  }>()
  const projectName =
    (teamId && projectId && MOCK_PROJECT_NAMES[teamId]?.[projectId]) ??
    projectId ??
    'Project'
  return (
    <TeamProjectDetailScreen projectName={projectName} teamId={teamId ?? ''} />
  )
}

export function TeamViewsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const team = DEMO_TEAMS.find((t) => t.id === teamId)
  return <TeamViewsScreen teamName={team?.name ?? teamId ?? 'Team'} />
}

export function TeamLogsScreenWrapper() {
  const { teamId } = useParams<{ teamId: string }>()
  const team = DEMO_TEAMS.find((t) => t.id === teamId)
  return <TeamLogsScreen teamName={team?.name ?? teamId ?? 'Team'} />
}

export function IssueDetailScreenWrapper() {
  const { teamId, issueId } = useParams<{ teamId: string; issueId: string }>()
  const team = DEMO_TEAMS.find((t) => t.id === teamId)
  return (
    <IssueDetailScreen
      issueId={issueId ?? 'ISSUE-1'}
      teamName={team?.name ?? teamId ?? 'Team'}
    />
  )
}
