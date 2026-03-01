import { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Bold, Italic, List } from 'lucide-react'
import { IconButton } from '../IconButton'

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  background: ${(p) => p.theme.colors.surfaceSecondary};
`

const EditorWrap = styled.div`
  width: 100%;
  min-height: 120px;
  font-size: 0.875rem;
  padding: ${(p) => p.theme.spacing[2]}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 0 0 4px 4px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  overflow-y: auto;
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.borderFocus};
  }

  &[contenteditable]:empty::before {
    content: attr(data-placeholder);
    color: ${(p) => p.theme.colors.textMuted};
  }

  p,
  ul,
  ol {
    margin: 0 0 0.5em;
  }
  p:last-child,
  ul:last-child,
  ol:last-child {
    margin-bottom: 0;
  }
  ul,
  ol {
    padding-left: 1.5em;
  }
`

export type RichTextProps = {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  minHeight?: number
  className?: string
}

export function RichText({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Write something...',
  disabled = false,
  minHeight = 120,
  className,
}: RichTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const emitChange = useCallback(() => {
    const el = ref.current
    if (!el || !onChange) return
    const html = el.innerHTML
    const isEmpty =
      !html ||
      /^(<br\s*\/?>|<\/?(p|div)><br\s*\/?>)$/i.test(html.replace(/\s/g, ''))
    onChange(isEmpty ? '' : html)
  }, [onChange])

  // Sync from value only when not focused (e.g. form reset) to avoid cursor jump
  useEffect(() => {
    const el = ref.current
    if (!el || el === document.activeElement) return
    if (el.innerHTML !== value) {
      el.innerHTML = value
    }
  }, [value])

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    ref.current?.focus()
    emitChange()
  }

  return (
    <div className={className}>
      {!disabled && (
        <Toolbar>
          <IconButton aria-label="Bold" onClick={() => exec('bold')}>
            <Bold size={16} />
          </IconButton>
          <IconButton aria-label="Italic" onClick={() => exec('italic')}>
            <Italic size={16} />
          </IconButton>
          <IconButton
            aria-label="Bullet list"
            onClick={() => exec('insertUnorderedList')}
          >
            <List size={16} />
          </IconButton>
        </Toolbar>
      )}
      <EditorWrap
        ref={ref}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        style={{ minHeight }}
        onInput={emitChange}
        onBlur={() => {
          emitChange()
          onBlur?.()
        }}
        suppressContentEditableWarning
      />
    </div>
  )
}
