import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '../Input'
import { Card } from '../Card'
import { Calendar } from '../Calendar'
import { IconButton } from '../IconButton'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
`

const Popover = styled(Card)<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: ${(p) => p.theme.spacing[1]}px;
  z-index: 100;
  display: ${(p) => (p.$open ? 'block' : 'none')};
`

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

type Props = {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const display = value != null ? formatDate(value) : ''

  return (
    <Wrapper ref={ref} className={className}>
      <Trigger>
        <Input
          readOnly
          value={display}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          style={{ minWidth: 140 }}
        />
        <IconButton
          aria-label="Open calendar"
          onClick={() => setOpen(!open)}
        >
          <CalendarIcon size={16} />
        </IconButton>
      </Trigger>
      <Popover $open={open}>
        <Calendar
          value={value}
          onChange={(d) => {
            onChange?.(d)
            setOpen(false)
          }}
        />
      </Popover>
    </Wrapper>
  )
}
