import { useCallback, useRef } from 'react'
import styled from 'styled-components'
import { SmilePlus } from 'lucide-react'
import { IconButton } from '../IconButton'
import { Popup } from '../Popup'

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const ShortcutHint = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
`

function isMac(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform) || navigator.userAgent.includes('Mac')
}

function tryOpenNativeEmojiPicker(inputEl: HTMLInputElement | null): void {
  if (!inputEl) return
  inputEl.focus()

  const isMacOs = isMac()
  const key = isMacOs ? ' ' : '.'
  const code = isMacOs ? 'Space' : 'Period'
  const metaKey = true
  const ctrlKey = isMacOs
  const altKey = false
  const shiftKey = false

  const event = new KeyboardEvent('keydown', {
    key,
    code,
    metaKey,
    ctrlKey,
    altKey,
    shiftKey,
    bubbles: true,
  })
  inputEl.dispatchEvent(event)
}

type Props = {
  /** Optional ref to an input/textarea; if provided, it will be focused so the OS emoji picker inserts into it. */
  targetRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  /** Placement of the shortcut-hint popup. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const MAC_SHORTCUT = '⌘⌃Space'
const WIN_SHORTCUT = 'Win + .'

export function EmojiSelector({ targetRef, placement = 'top', className }: Props) {
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const handleTriggerClick = useCallback(() => {
    const target = targetRef?.current ?? hiddenInputRef.current
    if (target) target.focus()
    tryOpenNativeEmojiPicker(hiddenInputRef.current)
  }, [targetRef])

  const shortcut = isMac() ? MAC_SHORTCUT : WIN_SHORTCUT

  return (
    <>
      <HiddenInput
        ref={hiddenInputRef}
        type="text"
        aria-hidden
        tabIndex={-1}
        readOnly
        data-emoji-input
      />
      <Popup
        trigger={
          <IconButton aria-label="Open emoji picker" onClick={handleTriggerClick}>
            <SmilePlus size={18} />
          </IconButton>
        }
        placement={placement}
        openOnClick
        openOnHover={false}
        className={className}
      >
        <ShortcutHint>Use {shortcut} to open the emoji picker</ShortcutHint>
      </Popup>
    </>
  )
}
