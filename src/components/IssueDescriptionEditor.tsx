import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type Props = {
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

const EditorContainer = styled.div`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceSecondary};
`

const ToolButton = styled.button`
  height: 28px;
  min-width: 28px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const EditorArea = styled.textarea`
  width: 100%;
  min-height: 320px;
  border: 0;
  resize: none;
  overflow: hidden;
  outline: none;
  padding: 12px;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font-size: 15px;
  line-height: 1.6;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export function IssueDescriptionEditor({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder = 'Add a description...',
  readOnly = false,
}: Props) {
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
    const selected = content.slice(start, end)
    const next = `${content.slice(0, start)}${left}${selected}${right}${content.slice(end)}`

    update(next)

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + left.length + selected.length + right.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const prefixLines = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea || readOnly) return

    const start = textarea.selectionStart ?? 0
    const end = textarea.selectionEnd ?? 0
    const selected = content.slice(start, end)
    const block = selected || 'Item'
    const nextBlock = block
      .split('\n')
      .map((line) => (line ? `${prefix}${line}` : line))
      .join('\n')

    const next = `${content.slice(0, start)}${nextBlock}${content.slice(end)}`
    update(next)

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + nextBlock.length
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
