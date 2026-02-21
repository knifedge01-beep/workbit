import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
  AlertCircle,
  Check,
} from 'lucide-react'

export type PriorityOption = {
  id: string
  label: string
  icon: React.ReactNode
}

const defaultPriorities: PriorityOption[] = [
  { id: 'low', label: 'Low', icon: <ArrowDownCircle size={16} /> },
  { id: 'medium', label: 'Medium', icon: <MinusCircle size={16} /> },
  { id: 'high', label: 'High', icon: <ArrowUpCircle size={16} /> },
  { id: 'urgent', label: 'Urgent', icon: <AlertCircle size={16} style={{ color: 'var(--priority-urgent, #EF4444)' }} /> },
]

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  min-width: 120px;
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${(p) => p.theme.colors.borderFocus};
  }
  svg {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
  }
`

const Panel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 160px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  overflow: hidden;
`

const List = styled.div`
  padding: ${(p) => p.theme.spacing[1]}px 0;
`

const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => (p.$selected ? p.theme.colors.dropdownSelectedBg ?? '#E0F2FF' : 'transparent')};
  border: none;
  cursor: pointer;
  text-align: left;
  &:hover {
    background: ${(p) => p.theme.colors.dropdownHoverBg ?? p.theme.colors.surfaceHover};
  }
`

const ItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.textMuted};
`

const ItemLabel = styled.span`
  flex: 1;
`

const ItemCheck = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.primary};
`

type Props = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: PriorityOption[]
  className?: string
}

export function PrioritySelector({
  value,
  onChange,
  placeholder = 'Priority',
  options = defaultPriorities,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const selected = options.find((o) => o.id === value)

  return (
    <Wrapper ref={ref} className={className}>
      <Trigger
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={selected ? selected.label : placeholder}
      >
        {selected ? (
          <ItemIcon>{selected.icon}</ItemIcon>
        ) : (
          <ItemIcon>{defaultPriorities[0].icon}</ItemIcon>
        )}
        <span style={{ color: selected ? undefined : 'var(--text-muted, #64748b)' }}>
          {selected ? selected.label : placeholder}
        </span>
      </Trigger>
      {open && (
        <Panel>
          <List>
            {options.map((opt) => (
              <Item
                key={opt.id}
                type="button"
                $selected={opt.id === value}
                onClick={() => {
                  onChange?.(opt.id)
                  setOpen(false)
                }}
              >
                <ItemIcon>{opt.icon}</ItemIcon>
                <ItemLabel>{opt.label}</ItemLabel>
                {opt.id === value && (
                  <ItemCheck>
                    <Check size={16} strokeWidth={2.5} />
                  </ItemCheck>
                )}
              </Item>
            ))}
          </List>
        </Panel>
      )}
    </Wrapper>
  )
}
