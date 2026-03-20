export type IssueDescriptionEditorProps = {
  value?: string
  defaultValue?: string
  onChange: (markdown: string) => void
  onBlur?: () => void
  placeholder?: string
  readOnly?: boolean
  stickyToolbar?: boolean
  toolbarTop?: number
  alwaysShowToolbar?: boolean
}
