import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Circle, Check } from 'lucide-react'

import { cn } from '@design-system-v2/lib/utils'

import {
  Wrapper,
  Trigger,
  Panel,
  SearchWrap,
  SearchInner,
  SearchInput,
  ShortcutBadge,
  List,
  Item,
  ItemIcon,
  ItemLabel,
  ItemShortcut,
  ItemCheck,
} from './styles'
import type { StatusSelectorProps } from './types'
import { STATUS_OPTIONS } from './utils/statusOptions'

export type { StatusOption } from './types'
export { STATUS_OPTIONS } from './utils/statusOptions'

export function StatusSelector({
  value,
  onChange,
  placeholder = 'Change status...',
  options = STATUS_OPTIONS,
  triggerVariant = 'default',
  className,
  triggerClassName,
}: StatusSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
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
      const panelW = panelRef.current?.offsetWidth ?? 260
      const panelH = panelRef.current?.offsetHeight ?? 280
      const openUp =
        window.innerHeight - rect.bottom < panelH + GAP &&
        rect.top > panelH + GAP
      const rawLeft = rect.left
      const left = Math.max(
        PAD,
        Math.min(rawLeft, window.innerWidth - panelW - PAD)
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

  const filtered = search.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.trim().toLowerCase())
      )
    : options

  const selected = options.find((o) => o.id === value)

  return (
    <Wrapper ref={ref} className={className} $iconOnly={iconOnly}>
      <Trigger
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        $iconOnly={iconOnly}
        aria-label={selected ? selected.label : placeholder}
        className={cn(triggerClassName)}
      >
        {selected ? (
          <ItemIcon>{selected.icon}</ItemIcon>
        ) : (
          <ItemIcon>
            <Circle size={18} style={{ opacity: 0.6 }} />
          </ItemIcon>
        )}
        {!iconOnly &&
          (selected ? (
            <span>{selected.label}</span>
          ) : (
            <span style={{ color: 'var(--text-muted, #64748b)' }}>
              {placeholder}
            </span>
          ))}
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
            <SearchWrap>
              <SearchInner>
                <SearchInput
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <ShortcutBadge>S</ShortcutBadge>
              </SearchInner>
            </SearchWrap>
            <List>
              {filtered.map((opt) => (
                <Item
                  key={opt.id}
                  type="button"
                  $selected={opt.id === value}
                  onClick={() => {
                    onChange?.(opt.id)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <ItemIcon>{opt.icon}</ItemIcon>
                  <ItemLabel>{opt.label}</ItemLabel>
                  {opt.shortcut != null && (
                    <ItemShortcut>{opt.shortcut}</ItemShortcut>
                  )}
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
