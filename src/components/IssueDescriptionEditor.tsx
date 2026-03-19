import { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Underline,
  Strikethrough,
  Minus,
  ListChecks,
  Eraser,
  Link as LinkIcon,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react'
import { IconButton } from '../design-system'

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  font-family: inherit;
`

const Toolbar = styled.div<{
  visible: boolean
  $sticky?: boolean
  $top?: number
  $floating?: boolean
  $x?: number
  $y?: number
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  position: ${(p) =>
    p.$floating ? 'fixed' : p.$sticky ? 'sticky' : 'relative'};
  top: ${(p) =>
    p.$floating ? `${p.$y ?? 0}px` : p.$sticky ? `${p.$top ?? 0}px` : 'auto'};
  left: ${(p) => (p.$floating ? `${p.$x ?? 0}px` : 'auto')};
  transform: ${(p) => (p.$floating ? 'translate(-50%, -100%)' : 'none')};
  z-index: ${(p) => (p.$floating ? 1200 : p.$sticky ? 20 : 1)};
  padding: 6px 8px;
  margin-bottom: ${(p) => (p.$floating ? '0' : '8px')};
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceSecondary};
  box-shadow: ${(p) =>
    p.$floating ? '0 6px 18px rgba(2, 6, 23, 0.14)' : 'none'};
  opacity: ${(p) => (p.visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: ${(p) => (p.visible ? 'auto' : 'none')};
  width: ${(p) => (p.$floating ? 'max-content' : '100%')};
  max-width: ${(p) => (p.$floating ? 'calc(100vw - 16px)' : '100%')};

  > button {
    width: 30px;
    height: 30px;
    min-width: 30px;
    min-height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
`

const ToolbarDivider = styled.span`
  width: 1px;
  height: 16px;
  background: ${(p) => p.theme.colors.border};
  margin: 0 2px;
`

const EditorContent = styled.div`
  min-height: 180px;
  outline: none;
  line-height: 1.6;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
  white-space: pre-wrap;

  &[contenteditable]:empty::before {
    content: attr(data-placeholder);
    color: ${(p) => p.theme.colors.textMuted};
    opacity: 0.7;
  }

  h1 {
    font-size: 1.8em;
    margin: 0.6em 0;
    font-weight: 700;
  }
  h2 {
    font-size: 1.35em;
    margin: 0.65em 0;
    font-weight: 600;
  }
  ul,
  ol {
    padding-left: 20px;
    margin: 0.9em 0;
  }
  blockquote {
    border-left: 3px solid ${(p) => p.theme.colors.border};
    padding-left: 12px;
    margin: 0.9em 0;
    color: ${(p) => p.theme.colors.textMuted};
  }
  code {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9em;
  }
  pre {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    margin: 0.9em 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 0.75em 0;
    border: 1px solid ${(p) => p.theme.colors.border};
  }

  .image-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;
    cursor: default;
    margin: 0.75em 0;
  }

  .image-wrapper img {
    display: block;
    margin: 0;
    border: 2px solid transparent;
    transition: border-color 0.15s ease;
  }

  .image-wrapper:hover img {
    border-color: rgba(99, 102, 241, 0.45);
  }

  .img-delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.65);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
    padding: 0;
    line-height: 1;
  }

  .image-wrapper:hover .img-delete-btn {
    opacity: 1;
  }

  .img-delete-btn:hover {
    background: rgba(0, 0, 0, 0.88);
  }

  .issue-attachment {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid ${(p) => p.theme.colors.border};
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border-radius: 8px;
    padding: 6px 10px;
    margin: 6px 0;
    text-decoration: none;
    color: ${(p) => p.theme.colors.text};
    font-size: 0.85rem;
  }
`

type Props = {
  value?: string
  defaultValue?: string
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  readOnly?: boolean
  stickyToolbar?: boolean
  toolbarTop?: number
  alwaysShowToolbar?: boolean
}

export function IssueDescriptionEditor({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  placeholder = 'Add a description...',
  readOnly = false,
  stickyToolbar = false,
  toolbarTop = 0,
  alwaysShowToolbar = false,
}: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const [floatingToolbarPos, setFloatingToolbarPos] = useState({ x: 0, y: 0 })
  const [floatingVisible, setFloatingVisible] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectionRef = useRef<Range | null>(null)
  const isInitialized = useRef(false)

  // Wraps any bare <img> elements (e.g. loaded from DB) with the delete-button wrapper.
  const wrapBareImages = useCallback(() => {
    if (!editorRef.current) return
    const imgs = editorRef.current.querySelectorAll<HTMLImageElement>(
      'img:not(.image-wrapper img)'
    )
    imgs.forEach((img) => {
      const wrapper = document.createElement('span')
      wrapper.className = 'image-wrapper'
      wrapper.contentEditable = 'false'

      const btn = document.createElement('button')
      btn.className = 'img-delete-btn'
      btn.type = 'button'
      btn.setAttribute('data-action', 'delete-image')
      btn.setAttribute('title', 'Remove image')
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

      img.parentNode?.insertBefore(wrapper, img)
      wrapper.appendChild(img)
      wrapper.appendChild(btn)
    })
  }, [])

  const saveSelection = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return
    selectionRef.current = range.cloneRange()
  }, [])

  const updateFloatingToolbarPosition = useCallback(() => {
    if (stickyToolbar || readOnly) return
    const editor = editorRef.current
    if (!editor || !isFocused) {
      setFloatingVisible(false)
      return
    }
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      setFloatingVisible(false)
      return
    }
    const range = sel.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) {
      setFloatingVisible(false)
      return
    }
    const rect = range.getBoundingClientRect()
    const editorRect = editor.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const yBase = rect.top > 0 ? rect.top : editorRect.top + 28
    const y = Math.max(10, yBase - 10)
    setFloatingToolbarPos({ x, y })
    setFloatingVisible(true)
  }, [isFocused, readOnly, stickyToolbar])

  const restoreSelection = useCallback(() => {
    if (!selectionRef.current) return
    const sel = window.getSelection()
    if (!sel) return
    sel.removeAllRanges()
    sel.addRange(selectionRef.current)
  }, [])

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = defaultValue || value || ''
      isInitialized.current = true
      wrapBareImages()
    }
  }, [defaultValue, value, wrapBareImages])

  useEffect(() => {
    if (
      editorRef.current &&
      !isFocused &&
      value !== undefined &&
      editorRef.current.innerHTML !== value
    ) {
      editorRef.current.innerHTML = value
    }
  }, [value, isFocused])

  useEffect(() => {
    if (stickyToolbar || readOnly) return
    if (!isFocused) {
      setFloatingVisible(false)
      return
    }
    const update = () => updateFloatingToolbarPosition()
    document.addEventListener('selectionchange', update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      document.removeEventListener('selectionchange', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [isFocused, readOnly, stickyToolbar, updateFloatingToolbarPosition])

  const emitChange = useCallback(() => {
    if (!editorRef.current) return
    const html = editorRef.current.innerHTML
    const normalized = html.replace(/<br\s*\/?>(\s*)$/i, '').trim()
    onChange(normalized ? html : '')
  }, [onChange])

  const focusEditor = () => {
    editorRef.current?.focus()
  }

  const exec = (command: string, cmdValue?: string) => {
    focusEditor()
    restoreSelection()
    document.execCommand(command, false, cmdValue)
    focusEditor()
    saveSelection()
    emitChange()
  }

  const insertNodeAtCursor = useCallback(
    (node: Node) => {
      focusEditor()
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) {
        editorRef.current?.appendChild(node)
        saveSelection()
        return
      }
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(node)
      range.setStartAfter(node)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      saveSelection()
    },
    [restoreSelection, saveSelection]
  )

  const insertImageFromFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        const wrapper = document.createElement('span')
        wrapper.className = 'image-wrapper'
        wrapper.contentEditable = 'false'

        const img = document.createElement('img')
        img.src = String(reader.result)
        img.alt = file.name

        const btn = document.createElement('button')
        btn.className = 'img-delete-btn'
        btn.type = 'button'
        btn.setAttribute('data-action', 'delete-image')
        btn.setAttribute('title', 'Remove image')
        // Use a unicode × inside — no React node needed
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

        wrapper.appendChild(img)
        wrapper.appendChild(btn)
        insertNodeAtCursor(wrapper)
        emitChange()
      }
      reader.readAsDataURL(file)
    },
    [emitChange, insertNodeAtCursor]
  )

  const insertFileLink = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        const a = document.createElement('a')
        a.href = String(reader.result)
        a.download = file.name
        a.className = 'issue-attachment'
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'Attachment: ' + file.name
        insertNodeAtCursor(a)
        emitChange()
      }
      reader.readAsDataURL(file)
    },
    [emitChange, insertNodeAtCursor]
  )

  const handleInsertLink = () => {
    const url = window.prompt('Enter URL')
    if (!url) return
    exec('createLink', url)
  }

  const handleInsertDivider = () => {
    exec('insertHorizontalRule')
  }

  const handleInsertChecklist = () => {
    focusEditor()
    restoreSelection()
    const wrapper = document.createElement('p')
    wrapper.innerHTML = '<input type="checkbox" disabled /> ' + 'Checklist item'
    insertNodeAtCursor(wrapper)
    emitChange()
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    focusEditor()
    restoreSelection()
    Array.from(files).forEach(insertImageFromFile)
    e.target.value = ''
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    focusEditor()
    restoreSelection()
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) insertImageFromFile(file)
      else insertFileLink(file)
    })
    e.target.value = ''
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files || [])
    if (files.length === 0) return
    e.preventDefault()
    files.forEach((file) => {
      if (file.type.startsWith('image/')) insertImageFromFile(file)
      else insertFileLink(file)
    })
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length === 0) return
    e.preventDefault()
    focusEditor()
    restoreSelection()
    files.forEach((file) => {
      if (file.type.startsWith('image/')) insertImageFromFile(file)
      else insertFileLink(file)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault()
      exec('bold')
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault()
      exec('italic')
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault()
      exec('underline')
    }
  }

  return (
    <EditorContainer>
      {!readOnly && (
        <>
          {stickyToolbar ? (
            <Toolbar
              ref={toolbarRef}
              visible={alwaysShowToolbar || isFocused}
              $sticky
              $top={toolbarTop}
              onMouseDown={(e) => {
                // Prevent toolbar clicks from stealing focus from the editor.
                e.preventDefault()
              }}
            >
              <IconButton
                aria-label="Heading 1"
                onClick={() => exec('formatBlock', 'H1')}
              >
                <Heading1 size={16} />
              </IconButton>
              <IconButton
                aria-label="Heading 2"
                onClick={() => exec('formatBlock', 'H2')}
              >
                <Heading2 size={16} />
              </IconButton>
              <ToolbarDivider />
              <IconButton aria-label="Bold" onClick={() => exec('bold')}>
                <Bold size={16} />
              </IconButton>
              <IconButton aria-label="Italic" onClick={() => exec('italic')}>
                <Italic size={16} />
              </IconButton>
              <IconButton
                aria-label="Underline"
                onClick={() => exec('underline')}
              >
                <Underline size={16} />
              </IconButton>
              <IconButton
                aria-label="Strikethrough"
                onClick={() => exec('strikeThrough')}
              >
                <Strikethrough size={16} />
              </IconButton>
              <IconButton
                aria-label="Bullet list"
                onClick={() => exec('insertUnorderedList')}
              >
                <List size={16} />
              </IconButton>
              <IconButton
                aria-label="Numbered list"
                onClick={() => exec('insertOrderedList')}
              >
                <ListOrdered size={16} />
              </IconButton>
              <IconButton
                aria-label="Checklist"
                onClick={handleInsertChecklist}
              >
                <ListChecks size={16} />
              </IconButton>
              <IconButton
                aria-label="Quote"
                onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
              >
                <Quote size={16} />
              </IconButton>
              <IconButton
                aria-label="Code block"
                onClick={() => exec('formatBlock', 'PRE')}
              >
                <Code size={16} />
              </IconButton>
              <IconButton
                aria-label="Insert divider"
                onClick={handleInsertDivider}
              >
                <Minus size={16} />
              </IconButton>
              <IconButton
                aria-label="Clear formatting"
                onClick={() => exec('removeFormat')}
              >
                <Eraser size={16} />
              </IconButton>
              <ToolbarDivider />
              <IconButton aria-label="Insert link" onClick={handleInsertLink}>
                <LinkIcon size={16} />
              </IconButton>
              <IconButton
                aria-label="Attach image"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon size={16} />
              </IconButton>
              <IconButton
                aria-label="Attach file"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={16} />
              </IconButton>
            </Toolbar>
          ) : (
            createPortal(
              <Toolbar
                ref={toolbarRef}
                visible={floatingVisible && (alwaysShowToolbar || isFocused)}
                $floating
                $x={floatingToolbarPos.x}
                $y={floatingToolbarPos.y}
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
              >
                <IconButton
                  aria-label="Heading 1"
                  onClick={() => exec('formatBlock', 'H1')}
                >
                  <Heading1 size={16} />
                </IconButton>
                <IconButton
                  aria-label="Heading 2"
                  onClick={() => exec('formatBlock', 'H2')}
                >
                  <Heading2 size={16} />
                </IconButton>
                <ToolbarDivider />
                <IconButton aria-label="Bold" onClick={() => exec('bold')}>
                  <Bold size={16} />
                </IconButton>
                <IconButton aria-label="Italic" onClick={() => exec('italic')}>
                  <Italic size={16} />
                </IconButton>
                <IconButton
                  aria-label="Underline"
                  onClick={() => exec('underline')}
                >
                  <Underline size={16} />
                </IconButton>
                <IconButton
                  aria-label="Strikethrough"
                  onClick={() => exec('strikeThrough')}
                >
                  <Strikethrough size={16} />
                </IconButton>
                <IconButton
                  aria-label="Bullet list"
                  onClick={() => exec('insertUnorderedList')}
                >
                  <List size={16} />
                </IconButton>
                <IconButton
                  aria-label="Numbered list"
                  onClick={() => exec('insertOrderedList')}
                >
                  <ListOrdered size={16} />
                </IconButton>
                <IconButton
                  aria-label="Checklist"
                  onClick={handleInsertChecklist}
                >
                  <ListChecks size={16} />
                </IconButton>
                <IconButton
                  aria-label="Quote"
                  onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
                >
                  <Quote size={16} />
                </IconButton>
                <IconButton
                  aria-label="Code block"
                  onClick={() => exec('formatBlock', 'PRE')}
                >
                  <Code size={16} />
                </IconButton>
                <IconButton
                  aria-label="Insert divider"
                  onClick={handleInsertDivider}
                >
                  <Minus size={16} />
                </IconButton>
                <IconButton
                  aria-label="Clear formatting"
                  onClick={() => exec('removeFormat')}
                >
                  <Eraser size={16} />
                </IconButton>
                <ToolbarDivider />
                <IconButton aria-label="Insert link" onClick={handleInsertLink}>
                  <LinkIcon size={16} />
                </IconButton>
                <IconButton
                  aria-label="Attach image"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon size={16} />
                </IconButton>
                <IconButton
                  aria-label="Attach file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={16} />
                </IconButton>
              </Toolbar>,
              document.body
            )
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageInput}
            style={{ display: 'none' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </>
      )}

      <EditorContent
        ref={editorRef}
        contentEditable={!readOnly}
        data-placeholder={placeholder}
        onInput={emitChange}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => {
          if (e.dataTransfer?.files?.length) e.preventDefault()
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          // Use closest() so clicks on the inner SVG are also caught
          const btn = target.closest<HTMLElement>(
            '[data-action="delete-image"]'
          )
          if (btn) {
            const wrapper = btn.closest('.image-wrapper')
            if (wrapper) {
              wrapper.remove()
              emitChange()
            }
          }
        }}
        onFocus={() => {
          setIsFocused(true)
          saveSelection()
          updateFloatingToolbarPosition()
        }}
        onBlur={(e) => {
          const nextTarget = e.relatedTarget as Node | null
          if (nextTarget && toolbarRef.current?.contains(nextTarget)) {
            return
          }
          setIsFocused(false)
          onBlur?.()
        }}
        onKeyDown={(e) => {
          handleKeyDown(e)
          saveSelection()
          updateFloatingToolbarPosition()
        }}
        onKeyUp={() => {
          saveSelection()
          updateFloatingToolbarPosition()
        }}
        onMouseUp={() => {
          saveSelection()
          updateFloatingToolbarPosition()
        }}
        suppressContentEditableWarning
      />
    </EditorContainer>
  )
}
