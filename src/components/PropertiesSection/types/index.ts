export type PropertiesSectionProps = {
  defaultOpen?: boolean
  /** When true, render only the content (no header). Use when embedding in Tree. */
  contentOnly?: boolean
  defaultStatus?: string
  defaultPriority?: string
  defaultStartDate?: Date
  defaultEndDate?: Date
  onStatusChange?: (status: string) => void
  onPriorityChange?: (priority: string) => void
}
