import MDEditor from '@uiw/react-md-editor'

import 'highlight.js/styles/github.css'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

import { EditorWrap } from './styles'
import type { MarkdownEditorProps } from './types'
import { markdownPreviewOptions } from './utils/previewOptions'

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  preview = 'live',
  height,
  minHeight = 120,
  hideToolbar = false,
  visibleDragbar = true,
  readOnly = false,
  autoFocus = false,
  textareaProps,
}: MarkdownEditorProps) {
  return (
    <EditorWrap data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        preview={preview}
        height={height}
        hideToolbar={hideToolbar}
        visibleDragbar={visibleDragbar}
        previewOptions={markdownPreviewOptions}
        textareaProps={
          {
            placeholder,
            'aria-label': placeholder ?? 'Markdown editor',
            autoFocus,
            style: {
              minHeight,
            },
            ...textareaProps,
          } as never
        }
        readOnly={readOnly}
      />
    </EditorWrap>
  )
}
