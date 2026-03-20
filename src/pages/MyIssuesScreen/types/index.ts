import type { PriorityOption } from '../../components/PrioritySelector'

export type IssueOverride = {
  status?: string
  priority?: string
}

export type IssueOverrides = Record<string, IssueOverride>

export type TeamLite = {
  id: string
  name: string
}

export type MyIssueApiItem = {
  id: string
  title: string
  date?: string | null
  status?: string | null
  assignee?: {
    name: string
  } | null
}

export type MyIssueRow = {
  id: string
  title: string
  date: string
  status: string
  priority: string
  assignee: MyIssueApiItem['assignee']
  assigneeInitials: string
}

export type InlinePriorityOption = PriorityOption
