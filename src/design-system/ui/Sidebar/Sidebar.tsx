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
  transition:
    width 0.2s ease,
    min-width 0.2s ease;
`

const Header = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

const CollapseStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px
    ${(p) => p.theme.spacing[1]}px;
  flex-shrink: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
`

const Footer = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

export const SidebarSection = styled.div`
  margin-top: ${(p) => p.theme.spacing[4]}px;
  &:first-child {
    margin-top: 0;
  }
`

export const SidebarSectionHeading = styled.div`
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
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
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
  svg {
    flex-shrink: 0;
    opacity: 0.8;
  }
`

const CollapsibleChildren = styled.div`
  padding-left: ${(p) => p.theme.spacing[3]}px;
  padding-top: ${(p) => p.theme.spacing[1]}px;
`

export const SidebarNavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: 8px 10px;
  font-size: 0.875rem;
  color: ${(p) => (p.$active ? p.theme.colors.text : p.theme.colors.textMuted)};
  background: ${(p) =>
    p.$active ? p.theme.colors.surfaceHover : 'transparent'};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 2px;
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.12s;
  position: relative;
  &:hover {
    transform: translateX(2px);
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
  &:active {
    transform: translateX(2px) scale(0.97);
  }

  ${(p) =>
    p.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 10%;
      height: 80%;
      width: 4px;
      background: ${p.theme.colors.primary};
      border-radius: 0 4px 4px 0;
    }
  `}

  svg {
    flex-shrink: 0;
    color: ${(p) =>
      p.$active ? p.theme.colors.primary : p.theme.colors.textMuted};
  }
  /* Fixed-width icon slot so labels align when expanded */
  > svg:first-of-type {
    width: 16px;
    min-width: 16px;
    height: 16px;
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
  transition:
    max-height 0.25s ease,
    opacity 0.2s ease;
`

export function SidebarCollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <SidebarSection>
      <CollapsibleHeading
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </CollapsibleHeading>
      <CollapsibleContent $open={open}>
        <CollapsibleChildren>{children}</CollapsibleChildren>
      </CollapsibleContent>
    </SidebarSection>
  )
}

const CollapseToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  flex-shrink: 0;
  transition:
    color 0.15s,
    background 0.15s;
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
      {onCollapseToggle != null && (
        <CollapseStrip>
          <CollapseToggle
            type="button"
            onClick={onCollapseToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </CollapseToggle>
        </CollapseStrip>
      )}
      <Content>{children}</Content>
      {footer != null ? <Footer>{footer}</Footer> : null}
    </StyledSidebar>
  )
}
