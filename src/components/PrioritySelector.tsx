import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import {
  ArrowDownCircle,
  MinusCircle,
  ArrowUpCircle,
  AlertCircle,
  Check,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@design-system-v2/lib/utils'

export type PriorityOption = {
  id: string
  label: string
  icon: React.ReactNode
}

const defaultPriorities: PriorityOption[] = [
  { id: 'low', label: 'Low', icon: <ArrowDownCircle size={16} /> },
  { id: 'medium', label: 'Medium', icon: <MinusCircle size={16} /> },
  { id: 'high', label: 'High', icon: <ArrowUpCircle size={16} /> },
  {
    id: 'urgent',
    label: 'Urgent',
    icon: (
      <AlertCircle
        size={16}
        style={{ color: 'var(--priority-urgent, #EF4444)' }}
      />
    ),
  },
]

const Wrapper = styled.div<{ $iconOnly?: boolean }>`
  position: relative;
  display: inline-block;
  min-width: ${(p) => (p.$iconOnly ? 'auto' : '0')};
  width: ${(p) => (p.$iconOnly ? 'auto' : '100%')};
`

const Trigger = styled.button<{ $iconOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$iconOnly ? 'center' : 'flex-start')};
  gap: ${(p) => p.theme.spacing[2]}px;
  width: ${(p) => (p.$iconOnly ? 'auto' : '100%')};
  padding: ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[1])}px
    ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[2])}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => (p.$iconOnly ? 'transparent' : p.theme.colors.surface)};
  border: ${(p) =>
    p.$iconOnly ? 'none' : `1px solid ${p.theme.colors.border}`};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:hover {
    border-color: ${(p) =>
      p.$iconOnly ? 'transparent' : p.theme.colors.borderFocus};
    background: ${(p) =>
      p.$iconOnly ? p.theme.colors.surfaceHover : 'inherit'};
  }
  svg {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
  }
`

const TriggerLabel = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Panel = styled.div<{ $openUp: boolean }>`
  position: fixed;
  top: var(--menu-top, 0px);
  left: var(--menu-left, 0px);
  transform: ${(p) => (p.$openUp ? 'translateY(-100%)' : 'none')};
  min-width: 160px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1200;
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
  background: ${(p) =>
    p.$selected
      ? (p.theme.colors.dropdownSelectedBg ?? '#E0F2FF')
      : 'transparent'};
  border: none;
  cursor: pointer;
  text-align: left;
  &:hover {
    background: ${(p) =>
      p.theme.colors.dropdownHoverBg ?? p.theme.colors.surfaceHover};
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
  /** When true, trigger shows only the priority icon (for use in issue cards). */
  triggerVariant?: 'default' | 'icon'
  className?: string
  triggerClassName?: string
}

export function PrioritySelector({
  value,
  onChange,
  placeholder = 'Priority',
  options = defaultPriorities,
  triggerVariant = 'default',
  className,
  triggerClassName,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const iconOnly = triggerVariant === 'icon'
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, openUp: false })

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      const inTrigger = ref.current?.contains(target)
      const inPanel = panelRef.current?.contains(target)
      if (!inTrigger && !inPanel) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  useEffect(() => {
    if (!open || !triggerRef.current) return
    const GAP = 6
    const PAD = 8
    const updatePos = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const panelW = panelRef.current?.offsetWidth ?? 180
      const panelH = panelRef.current?.offsetHeight ?? 220
      const openUp =
        window.innerHeight - rect.bottom < panelH + GAP &&
        rect.top > panelH + GAP
      const left = Math.max(
        PAD,
        Math.min(rect.left, window.innerWidth - panelW - PAD)
      )
      const top = openUp ? rect.top - GAP : rect.bottom + GAP
      setMenuPos({ top, left, openUp })
    }
    updatePos()
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos, true)
    }
  }, [open])

  const selected = options.find((o) => o.id === value)

  return (
    <Wrapper ref={ref} className={className} $iconOnly={iconOnly}>
      <Trigger
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={selected ? selected.label : placeholder}
        $iconOnly={iconOnly}
        className={cn(triggerClassName)}
      >
        {selected ? (
          <ItemIcon>{selected.icon}</ItemIcon>
        ) : (
          <ItemIcon>{defaultPriorities[0].icon}</ItemIcon>
        )}
        {!iconOnly && (
          <TriggerLabel
            style={{
              color: selected ? undefined : 'var(--text-muted, #64748b)',
            }}
          >
            {selected ? selected.label : placeholder}
          </TriggerLabel>
        )}
        {!iconOnly && <ChevronDown size={14} style={{ opacity: 0.55 }} />}
      </Trigger>
      {open &&
        createPortal(
          <Panel
            ref={panelRef}
            $openUp={menuPos.openUp}
            style={{
              ['--menu-top' as string]: `${menuPos.top}px`,
              ['--menu-left' as string]: `${menuPos.left}px`,
            }}
          >
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
          </Panel>,
          document.body
        )}
    </Wrapper>
  )
}
