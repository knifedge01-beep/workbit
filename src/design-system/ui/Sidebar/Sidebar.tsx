import { useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const StyledSidebar = styled.aside<{ $collapsed?: boolean }>`
  width: ${(p) => (p.$collapsed ? 56 : 240)}px;
  min-width: ${(p) => (p.$collapsed ? 56 : 240)}px;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surfaceSecondary};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  transition:
    width 0.2s ease,
    min-width 0.2s ease;

  /* Handle collapsed state globally */
  ${(p) =>
    p.$collapsed &&
    `
    ${SidebarSectionHeading} {
      opacity: 0;
      pointer-events: none;
      max-height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    ${CollapsibleHeading} {
      opacity: 0;
      pointer-events: none;
      max-height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    ${SidebarNavItem} {
      justify-content: center;
      padding-left: ${p.theme.spacing[1]}px;
      padding-right: ${p.theme.spacing[1]}px;
      gap: 0;

      > *:not(svg):not(.avatar-wrapper) {
        display: none;
      }

      /* Ensure icon is visible and centered */
      > svg,
      > .avatar-wrapper {
        margin: 0;
      }
    }

    ${CollapsibleChildren} {
      padding-left: 0;
      padding-top: 0;

      &::before {
        display: none;
      }

      & > a {
        margin-left: 0;

        &::after {
          display: none;
        }

        &::before {
          display: none;
        }
      }
    }
  `}
`

const Header = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;

  ${(p) => p.theme.media?.sm ?? '@media (min-width: 0px)'} {
    /* Ensure header doesn't break layout when collapsed */
    overflow: hidden;
  }
`

const CollapseStrip = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-end')};
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px
    ${(p) => p.theme.spacing[1]}px;
  flex-shrink: 0;
  /* border-bottom: 1px solid ${(p) => p.theme.colors.border}; */
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[2]}px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.theme.colors.textMuted};
  }
`

const Footer = styled.div`
  padding: ${(p) => p.theme.spacing[3]}px;
  /* border-top: 1px solid ${(p) => p.theme.colors.border}; */
  flex-shrink: 0;
`

export const SidebarSection = styled.div`
  margin-top: ${(p) => p.theme.spacing[5]}px;
  &:first-child {
    margin-top: 0;
  }
`

export const SidebarSectionHeading = styled.div`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
  transition:
    opacity 0.2s,
    max-height 0.2s,
    padding 0.2s,
    margin 0.2s;
`

const CollapsibleHeading = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  margin-bottom: 2px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }

  svg {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
    transition: color 0.15s;
  }
  &:hover svg {
    color: ${(p) => p.theme.colors.text};
  }
`

const CollapsibleChildren = styled.div`
  position: relative;
  padding-left: ${(p) => p.theme.spacing[4]}px;
  padding-top: ${(p) => p.theme.spacing[1]}px;
  transition: padding-left 0.2s;

  /* Vertical tree line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 14px;
    left: ${(p) => p.theme.spacing[4]}px;
    width: 1px;
    background: ${(p) => p.theme.colors.border};
    opacity: 0.5;
  }

  /* Horizontal branches for tree items */
  & > a {
    position: relative;
    margin-left: ${(p) => p.theme.spacing[2]}px;

    &::after {
      content: '';
      position: absolute;
      left: -${(p) => p.theme.spacing[2]}px;
      top: 50%;
      width: ${(p) => p.theme.spacing[2]}px;
      height: 1px;
      background: ${(p) => p.theme.colors.border};
      opacity: 0.5;
    }

    /* Curve connector for last item (optional polish) */
    &:last-child::before {
      content: '';
      position: absolute;
      left: -${(p) => p.theme.spacing[2]}px; /* match line position */
      /* Extend vertical line to block gaps if needed, logic is tricky with just CSS */
    }
  }
`

export const SidebarNavItem = styled.a<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 500 : 400)};
  color: ${(p) => (p.$active ? p.theme.colors.text : p.theme.colors.textMuted)};
  background: ${(p) => (p.$active ? p.theme.colors.surface : 'transparent')};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 2px;
  box-shadow: ${(p) =>
    p.$active
      ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
      : 'none'};
  transition:
    background 0.15s,
    color 0.15s,
    padding 0.2s,
    box-shadow 0.2s;

  &:hover {
    background: ${(p) =>
      p.$active ? p.theme.colors.surface : p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }

  svg {
    flex-shrink: 0;
    color: ${(p) =>
      p.$active ? p.theme.colors.text : p.theme.colors.textMuted};
  }

  /* Fixed-width icon slot so labels align when expanded */
  > svg:first-of-type {
    width: 18px;
    min-width: 18px;
    height: 18px;
  }

  /* Text label transitions */
  > span:not([aria-hidden]) {
    transition:
      opacity 0.2s,
      width 0.2s;
    white-space: nowrap;
    overflow: hidden;
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
        <CollapseStrip $collapsed={collapsed}>
          <CollapseToggle
            type="button"
            onClick={onCollapseToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </CollapseToggle>
        </CollapseStrip>
      )}
      <Content>{children}</Content>
      {footer != null ? <Footer>{footer}</Footer> : null}
    </StyledSidebar>
  )
}
