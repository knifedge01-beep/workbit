export const SUB_ISSUE_COMPOSER_DISABLED_KEYS = ['Escape'] as const

export type SubIssueManager = {
  items: Array<{ id: string; title: string; completed: boolean }>
  showComposer: boolean
  inputValue: string
}
