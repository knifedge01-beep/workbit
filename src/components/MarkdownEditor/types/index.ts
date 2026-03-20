export type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  preview?: 'live' | 'edit' | 'preview'
  height?: number
  minHeight?: number
  hideToolbar?: boolean
  visibleDragbar?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  textareaProps?: Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange'
  >
}
