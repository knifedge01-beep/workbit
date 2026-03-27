export type PropertiesSectionProps = {
  defaultOpen?: boolean
  /** When true, render only the content (no header). Use when embedding in Tree. */
  contentOnly?: boolean
  defaultStatus?: string
  defaultPriority?: string
  defaultStartDate?: Date
  defaultEndDate?: Date
  defaultLeadId?: string
  defaultMemberIds?: string[]
  teamMembers?: {
    id: string
    name: string
    avatarSrc?: string
  }[]
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
  onLeadChange?: (leadId?: string) => void
  onMemberIdsChange?: (memberIds: string[]) => void
}
