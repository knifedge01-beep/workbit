export type MilestoneItem = {
  id: string
  name: string
  progress: number
  total: number
  targetDate: string
}

export type MilestonesSectionProps = {
  milestones?: MilestoneItem[]
  defaultOpen?: boolean
  contentOnly?: boolean
  onAdd?: () => void
}
