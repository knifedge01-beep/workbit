import { useParams } from 'react-router-dom'
import { DEMO_TEAMS } from '../constants'
import { TeamIssuesScreen } from './TeamIssuesScreen'
import { TeamProjectsScreen } from './TeamProjectsScreen'
import { TeamViewsScreen } from './TeamViewsScreen'
import { TeamLogsScreen } from './TeamLogsScreen'

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
