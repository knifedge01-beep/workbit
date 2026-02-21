import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'

type DropdownState = 'default' | 'error' | 'success' | 'disabled'

const Trigger = styled.button<{
  $open: boolean
  $state: DropdownState
  $focused: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 160px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) =>
    p.$state === 'disabled' ? p.theme.colors.textMuted : p.theme.colors.text};
  background: ${(p) =>
    p.$state === 'disabled' ? p.theme.colors.surfaceHover : p.theme.colors.surface};
  border: 1px solid
    ${(p) => {
      if (p.$state === 'error') return p.theme.colors.error
      if (p.$state === 'success') return p.theme.colors.success
      return p.theme.colors.border
    }};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  outline: ${(p) =>
    p.$focused ? `2px solid ${p.theme.colors.primary}` : 'none'};
  outline-offset: 2px;
  cursor: ${(p) => (p.$state === 'disabled' ? 'not-allowed' : 'pointer')};
  transition: border-color 0.15s, outline 0.15s;
  &:hover {
    border-color: ${(p) =>
      p.$state === 'disabled' ? p.theme.colors.border : p.theme.colors.primary};
  }
  svg {
    flex-shrink: 0;
    transition: transform 0.2s;
    transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'none')};
  }
`

const Panel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  z-index: 50;
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transform: translateY(${(p) => (p.$open ? 0 : -6)}px);
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
  visibility: ${(p) => (p.$open ? 'visible' : 'hidden')};
  transition: opacity 0.15s ease, transform 0.15s ease;
`

const Item = styled.div<{ $selected: boolean }>`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(p) =>
    p.$selected ? p.theme.colors.dropdownSelectedBg ?? '#E0F2FF' : 'transparent'};
  color: ${(p) =>
    p.$selected ? p.theme.colors.primary : p.theme.colors.text};
  &:hover {
    background: ${(p) => p.theme.colors.dropdownHoverBg ?? '#E0F2FF'};
    color: ${(p) => p.theme.colors.primary};
  }
`

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

export type DropdownOption = { value: string; label: string }

type Props = {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  state?: DropdownState
  disabled?: boolean
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Dropdown text',
  state = 'default',
  disabled = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const selectedOption = options.find((o) => o.value === value)
  const displayState: DropdownState = disabled ? 'disabled' : state

  return (
    <Wrapper ref={ref} className={className}>
      <Trigger
        type="button"
        $open={open}
        $state={displayState}
        $focused={focused}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} />
      </Trigger>
      <Panel $open={open}>
        {options.map((opt) => (
          <Item
            key={opt.value}
            $selected={opt.value === value}
            onClick={() => {
              onChange?.(opt.value)
              setOpen(false)
            }}
          >
            {opt.label}
          </Item>
        ))}
      </Panel>
    </Wrapper>
  )
}
