export type MilestoneFormProps = {
  milestoneName?: string
  description?: string
  targetDate?: Date
  issueCount?: number
  defaultExpanded?: boolean
  /** Display name for the avatar in the description (chat-style) row. */
  currentUserName?: string
  onMilestoneNameChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
  onTargetDateChange?: (date: Date) => void
  onChooseFile?: () => void
  onCreateDocument?: () => void
  onAddLink?: () => void
}
