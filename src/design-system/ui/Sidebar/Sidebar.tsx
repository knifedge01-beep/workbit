import { useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const StyledSidebar = styled.aside<{ $collapsed?: boolean }>`
  width: ${(p) => (p.$collapsed ? 56 : 240)}px;
  min-width: ${(p) => (p.$collapsed ? 56 : 240)}px;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  transition: width 0.2s ease, min-width 0.2s ease;
`

const Header = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing[2]}px;
`

const Footer = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

export const SidebarSection = styled.div`
  margin-top: ${(p) => p.theme.spacing[3]}px;
  &:first-child {
    margin-top: 0;
  }
`

export const SidebarSectionHeading = styled.div`
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

const CollapsibleHeading = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  svg {
    flex-shrink: 0;
  }
`

export const SidebarNavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) => (p.$active ? '#FFFFFF' : p.theme.colors.text)};
  background: ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  border-radius: 0 ${(p) => p.theme.radii?.md ?? 6}px ${(p) => p.theme.radii?.md ?? 6}px 0;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${(p) => (p.$active ? p.theme.colors.primaryHover : p.theme.colors.surfaceHover)};
  }
  svg {
    flex-shrink: 0;
    color: ${(p) => (p.$active ? '#FFFFFF' : p.theme.colors.textMuted)};
  }
`

type CollapsibleProps = {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

const CollapsibleContent = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${(p) => (p.$open ? '2000px' : '0')};
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transition: max-height 0.25s ease, opacity 0.2s ease;
`

export function SidebarCollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <SidebarSection>
      <CollapsibleHeading type="button" onClick={() => setOpen((o) => !o)}>
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </CollapsibleHeading>
      <CollapsibleContent $open={open}>{children}</CollapsibleContent>
    </SidebarSection>
  )
}

const CollapseToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px;
  margin: 0;
  background: none;
  border: none;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  flex-shrink: 0;
  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

type Props = {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  /** When true, sidebar is narrow (icon-only). Use with onCollapseToggle for expand/collapse. */
  collapsed?: boolean
  /** Called when user clicks the collapse/expand toggle. */
  onCollapseToggle?: () => void
  className?: string
}

export function Sidebar({
  children,
  header,
  footer,
  collapsed = false,
  onCollapseToggle,
  className,
}: Props) {
  return (
    <StyledSidebar className={className} $collapsed={collapsed}>
      {header != null ? <Header>{header}</Header> : null}
      <Content>{children}</Content>
      {footer != null ? <Footer>{footer}</Footer> : null}
      {onCollapseToggle != null && (
        <CollapseToggle
          type="button"
          onClick={onCollapseToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </CollapseToggle>
      )}
    </StyledSidebar>
  )
}
