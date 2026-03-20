import type { ApiDecisionStatus, ApiDecisionType } from '../../../api/client'

export type DecisionForm = {
  title: string
  type: ApiDecisionType
  status: ApiDecisionStatus
  rationale: string
  impact: string
  decisionDate: string
  tagsCsv: string
  linkedIssueIdsCsv: string
  linkedMilestoneIdsCsv: string
}

export type DecisionTabProps = {
  projectId?: string
  issues: Array<{ id: string; title: string }>
  milestones: Array<{ id: string; name: string }>
  isActive: boolean
}
