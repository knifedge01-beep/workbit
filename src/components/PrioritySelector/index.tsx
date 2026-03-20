import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@design-system-v2/lib/utils'

import {
  Wrapper,
  Trigger,
  TriggerLabel,
  Panel,
  List,
  Item,
  ItemIcon,
  ItemLabel,
  ItemCheck,
} from './styles'
import type { PriorityOption, PrioritySelectorProps } from './types'
import { DEFAULT_PRIORITIES } from './utils/defaultPriorities'

export type { PriorityOption } from './types'

export function PrioritySelector({
  value,
  onChange,
  placeholder = 'Priority',
  options = DEFAULT_PRIORITIES,
  triggerVariant = 'default',
  className,
  triggerClassName,
}: PrioritySelectorProps) {
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
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={selected ? selected.label : placeholder}
        $iconOnly={iconOnly}
        className={cn(triggerClassName)}
      >
        {selected ? (
          <ItemIcon>{selected.icon}</ItemIcon>
        ) : (
          <ItemIcon>{DEFAULT_PRIORITIES[0].icon}</ItemIcon>
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
              {options.map((opt: PriorityOption) => (
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
