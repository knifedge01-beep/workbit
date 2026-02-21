import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Loader2,
  Circle,
  CircleDot,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react'
import { Input } from '@design-system'

export type StatusOption = {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: number
}

const defaultStatuses: StatusOption[] = [
  { id: 'backlog', label: 'Backlog', icon: <Loader2 size={16} />, shortcut: 1 },
  { id: 'todo', label: 'Todo', icon: <Circle size={16} />, shortcut: 2 },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: <CircleDot size={16} style={{ color: 'var(--status-in-progress, #F59E0B)' }} />,
    shortcut: 3,
  },
  {
    id: 'done',
    label: 'Done',
    icon: <CheckCircle2 size={16} style={{ color: 'var(--status-done, #8B5CF6)' }} />,
    shortcut: 4,
  },
  {
    id: 'canceled',
    label: 'Canceled',
    icon: <XCircle size={16} style={{ color: 'var(--status-canceled, #EF4444)' }} />,
    shortcut: 5,
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy size={16} style={{ color: 'var(--status-duplicate, #6B7280)' }} />,
    shortcut: 6,
  },
]

const Wrapper = styled.div<{ $iconOnly?: boolean }>`
  position: relative;
  display: inline-block;
  min-width: ${(p) => (p.$iconOnly ? 'auto' : '200px')};
`

const Trigger = styled.button<{ $iconOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$iconOnly ? 'center' : 'flex-start')};
  gap: ${(p) => p.theme.spacing[2]}px;
  width: ${(p) => (p.$iconOnly ? 'auto' : '100%')};
  padding: ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[2])}px
    ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[3])}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => (p.$iconOnly ? 'transparent' : p.theme.colors.surface)};
  border: ${(p) => (p.$iconOnly ? 'none' : `1px solid ${p.theme.colors.border}`)};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: ${(p) => (p.$iconOnly ? 'transparent' : p.theme.colors.borderFocus)};
    background: ${(p) => (p.$iconOnly ? p.theme.colors.surfaceHover : 'inherit')};
  }
  svg {
    flex-shrink: 0;
  }
`

const Panel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 240px;
  max-width: 320px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  overflow: hidden;
`

const SearchWrap = styled.div`
  padding: ${(p) => p.theme.spacing[2]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const SearchInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const SearchInput = styled(Input)`
  padding-right: 32px;
`

const ShortcutBadge = styled.span`
  position: absolute;
  right: ${(p) => p.theme.spacing[2]}px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.surfaceHover};
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
`

const List = styled.div`
  max-height: 280px;
  overflow-y: auto;
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

const ItemShortcut = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
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
  options?: StatusOption[]
  /** When true, trigger shows only the status icon (for use in issue cards). */
  triggerVariant?: 'default' | 'icon'
  className?: string
}

export function StatusSelector({
  value,
  onChange,
  placeholder = 'Change status...',
  options = defaultStatuses,
  triggerVariant = 'default',
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const iconOnly = triggerVariant === 'icon'

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const filtered = search.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(search.trim().toLowerCase()))
    : options

  const selected = options.find((o) => o.id === value)

  return (
    <Wrapper ref={ref} className={className} $iconOnly={iconOnly}>
      <Trigger
        type="button"
        onClick={() => setOpen((o) => !o)}
        $iconOnly={iconOnly}
        aria-label={selected ? selected.label : placeholder}
      >
        {selected ? (
          <ItemIcon>{selected.icon}</ItemIcon>
        ) : (
          <ItemIcon>
            <Circle size={18} style={{ opacity: 0.6 }} />
          </ItemIcon>
        )}
        {!iconOnly && (
          selected ? (
            <span>{selected.label}</span>
          ) : (
            <span style={{ color: 'var(--text-muted, #64748b)' }}>{placeholder}</span>
          )
        )}
      </Trigger>
      {open && (
        <Panel>
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
                {opt.shortcut != null && <ItemShortcut>{opt.shortcut}</ItemShortcut>}
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
