import { useEffect, useRef, useState } from 'react'

import { EditorArea, EditorContainer, ToolButton, Toolbar } from './styles'
import type { IssueDescriptionEditorProps } from './types'
import {
  prefixLinesContent,
  surroundSelectionContent,
} from './utils/markdownTransforms'

export function IssueDescriptionEditor({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder = 'Add a description...',
  readOnly = false,
}: IssueDescriptionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState(value ?? defaultValue)

  const autoResize = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.max(320, textarea.scrollHeight)}px`
  }

  useEffect(() => {
    setContent(value ?? defaultValue)
  }, [defaultValue, value])

  useEffect(() => {
    autoResize()
  }, [content])

  const update = (next: string) => {
    setContent(next)
    onChange(next)
  }

  const surroundSelection = (left: string, right: string) => {
    const textarea = textareaRef.current
    if (!textarea || readOnly) return

    const start = textarea.selectionStart ?? 0
    const end = textarea.selectionEnd ?? 0
    const { next, cursor } = surroundSelectionContent(
      content,
      left,
      right,
      start,
      end
    )

    update(next)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const prefixLines = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea || readOnly) return

    const start = textarea.selectionStart ?? 0
    const end = textarea.selectionEnd ?? 0
    const { next, cursor } = prefixLinesContent(content, prefix, start, end)

    update(next)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const insertLink = () => {
    const url = window.prompt('Enter URL')
    if (!url || readOnly) return
    surroundSelection('[', `](${url})`)
  }

  return (
    <EditorContainer>
      {!readOnly && (
        <Toolbar>
          <ToolButton
            type="button"
            onClick={() => prefixLines('# ')}
            title="Heading 1"
          >
            H1
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => prefixLines('## ')}
            title="Heading 2"
          >
            H2
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => surroundSelection('**', '**')}
            title="Bold"
          >
            B
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => surroundSelection('*', '*')}
            title="Italic"
          >
            I
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => prefixLines('- ')}
            title="Bulleted list"
          >
            List
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => prefixLines('1. ')}
            title="Numbered list"
          >
            Num
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => prefixLines('- [ ] ')}
            title="Checklist"
          >
            Todo
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => prefixLines('> ')}
            title="Quote"
          >
            Quote
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => surroundSelection('`', '`')}
            title="Inline code"
          >
            Code
          </ToolButton>
          <ToolButton type="button" onClick={insertLink} title="Insert link">
            Link
          </ToolButton>
          <ToolButton
            type="button"
            onClick={() => surroundSelection('\n---\n', '')}
            title="Horizontal rule"
          >
            HR
          </ToolButton>
        </Toolbar>
      )}

      <EditorArea
        ref={textareaRef}
        value={content}
        onChange={(e) => update(e.target.value)}
        onBlur={() => onBlur?.()}
        onInput={autoResize}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </EditorContainer>
  )
}
