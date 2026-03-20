export const TARGET_DATE_PLACEHOLDER = 'Select target date'

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
