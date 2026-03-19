import styled from 'styled-components'
import MDEditor from '@uiw/react-md-editor'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
const EditorWrap = styled.div`
  .w-md-editor {
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
    box-shadow: none;
  }

  .w-md-editor-toolbar {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  .w-md-editor-toolbar li > button {
    color: ${(p) => p.theme.colors.text};
  }

  .w-md-editor-content,
  .w-md-editor-text,
  .w-md-editor-text-pre,
  .w-md-editor-text-input,
  .w-md-editor-text-pre > code,
  .wmde-markdown {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.surface};
  }

  .w-md-editor-text-input::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }

  .wmde-markdown {
    background: ${(p) => p.theme.colors.surface};
  }
`

type Props = {
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
}: Props) {
  return (
    <EditorWrap data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        preview={preview}
        height={height}
        hideToolbar={hideToolbar}
        visibleDragbar={visibleDragbar}
        previewOptions={{
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        }}
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
