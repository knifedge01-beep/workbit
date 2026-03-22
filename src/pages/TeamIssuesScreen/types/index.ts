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
  parentIssueId?: string | null
  subIssueCount?: number
}

export type TeamIssueRow = {
  id: string
  title: string
  assignee: string
  assigneeInitials: string
  date: string
  status: string
  priority: string
  parentIssueId: string | null
  subIssueCount: number
  depth: number
  isSubtaskRow: boolean
  /** Nested rows for @thedatablitz/table expandable + getSubRows */
  subRows?: TeamIssueRow[]
  /** Synthetic loading row under a parent before fetch completes */
  __placeholder?: boolean
}

export type InlinePriorityOption = PriorityOption
