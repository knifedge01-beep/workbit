import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { Divider } from '../Divider'

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`

const gap = 8

const MenuPanel = styled.div<{ $placement: 'bottom' | 'right' }>`
  position: absolute;
  width: 240px;
  padding: ${(p) => p.theme.spacing[1]}px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  box-sizing: border-box;
  ${(p) =>
    p.$placement === 'right'
      ? `left: 100%; top: 0; margin-left: ${gap}px;`
      : `top: 100%; right: 0; margin-top: ${p.theme.spacing[1]}px;`}
`

const MenuItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  min-width: 0;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: none;
  border: none;
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
  transition: background 0.15s ease;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.borderFocus};
    outline-offset: -2px;
  }
  .menu-item-icon {
    flex-shrink: 0;
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .menu-item-label {
    flex: 1;
    min-width: 0;
  }
  .menu-item-right {
    flex-shrink: 0;
    margin-left: ${(p) => p.theme.spacing[2]}px;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 0.75rem;
  }
`

export type MenuItem = {
  id: string
  label: string
  icon?: React.ReactNode
  /** Right-side content (e.g. ChevronRight for submenu, or shortcut). */
  right?: React.ReactNode
  onClick?: () => void
}

export type MenuDivider = { type: 'divider' }

export type MenuEntry = MenuItem | MenuDivider

function isDivider(entry: MenuEntry): entry is MenuDivider {
  return 'type' in entry && entry.type === 'divider'
}

type Props = {
  trigger: React.ReactNode
  items: MenuEntry[]
  /** Where the panel opens relative to the trigger. Default 'bottom'. */
  placement?: 'bottom' | 'right'
  className?: string
}

export function Menu({ trigger, items, placement = 'bottom', className }: Props) {
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

  const handleItemClick = (onClick?: () => void) => {
    onClick?.()
    setOpen(false)
  }

  return (
    <Wrapper ref={ref} className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
      >
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <MenuPanel
            $placement={placement}
            as={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {items.map((entry, i) =>
              isDivider(entry) ? (
                <div key={`divider-${i}`} style={{ margin: '6px 0' }}>
                  <Divider />
                </div>
              ) : (
                <MenuItemButton
                  key={entry.id}
                  type="button"
                  onClick={() => handleItemClick(entry.onClick)}
                >
                  {entry.icon != null ? (
                    <span className="menu-item-icon">{entry.icon}</span>
                  ) : null}
                  <span className="menu-item-label">{entry.label}</span>
                  {entry.right != null && (
                    <span className="menu-item-right">{entry.right}</span>
                  )}
                </MenuItemButton>
              )
            )}
          </MenuPanel>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}
