import type { PriorityOption } from '../../../components/PrioritySelector'

export type TeamIssuesScreenProps = {
  teamName: string
}

export type TeamIssuesParams = {
  workspaceId: string
  teamId: string
  tab: string
}

export type IssueTabId = 'all' | 'active' | 'backlog'

export type IssueTab = {
  id: IssueTabId
  label: string
}

export type TeamIssueOverride = {
  status?: string
  priority?: string
}

export type TeamIssueOverrides = Record<string, TeamIssueOverride>

export type TeamIssueApiItem = {
  id: string
  title: string
  date: string
  status?: string
  assignee?: {
    name: string
  } | null
}

export type TeamIssueRow = {
  id: string
  title: string
  assignee: string
  assigneeInitials: string
  date: string
  status: string
  priority: string
}

export type InlinePriorityOption = PriorityOption
