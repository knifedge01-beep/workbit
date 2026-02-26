import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  SidebarSection,
  SidebarSectionHeading,
  SidebarNavItem,
} from '@design-system'
import {
  Mail,
  FileText,
  Folder,
  Eye,
  Users,
  Shield,
  Upload,
  UserPlus,
  Star,
} from 'lucide-react'
import type { Team } from '../constants'

const NavWrap = styled.div<{ $collapsed: boolean }>`
  [data-sidebar-label] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    width: ${(p) => (p.$collapsed ? 0 : 'auto')};
    transition:
      opacity 0.15s ease,
      width 0.15s ease;
  }
  [data-sidebar-chevron] {
    display: ${(p) => (p.$collapsed ? 'none' : 'flex')};
  }
  a,
  button[type=\"button\"] {
    justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
    padding-left: ${(p) =>
      p.$collapsed ? p.theme.spacing[2] : p.theme.spacing[3]}px;
    padding-right: ${(p) =>
      p.$collapsed ? p.theme.spacing[2] : p.theme.spacing[3]}px;
  }
  [data-sidebar-heading] {
    display: ${(p) => (p.$collapsed ? 'none' : 'block')};
  }
`

type Props = {
  selectedTeam: Team
  collapsed?: boolean
}

export function SidebarNav({ selectedTeam, collapsed = false }: Props) {
  const location = useLocation()

  return (
    <NavWrap $collapsed={collapsed}>
      <SidebarSection>
        <SidebarNavItem
          as={Link}
          to="/inbox"
          $active={location.pathname === '/inbox'}
        >
          <Mail size={16} />
          <span data-sidebar-label>Inbox</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/my-issues"
          $active={location.pathname === '/my-issues'}
        >
          <FileText size={16} />
          <span data-sidebar-label>My Issues</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarSectionHeading data-sidebar-heading>
          Workspace
        </SidebarSectionHeading>
        <SidebarNavItem
          as={Link}
          to="/workspace/projects"
          $active={location.pathname === '/workspace/projects'}
        >
          <Folder size={16} />
          <span data-sidebar-label>Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/views"
          $active={location.pathname === '/workspace/views'}
        >
          <Eye size={16} />
          <span data-sidebar-label>Views</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/member"
          $active={location.pathname === '/workspace/member'}
        >
          <Users size={16} />
          <span data-sidebar-label>Members</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/roles"
          $active={location.pathname === '/workspace/roles'}
        >
          <Shield size={16} />
          <span data-sidebar-label>Roles</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarSection>
        <SidebarSectionHeading data-sidebar-heading>
          <Star size={12} style={{ display: 'inline', marginRight: 4 }} />
          {selectedTeam.name}
        </SidebarSectionHeading>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/issues/active`}
          $active={location.pathname.startsWith(
            `/team/${selectedTeam.id}/issues`
          )}
        >
          <FileText size={16} />
          <span data-sidebar-label>Issues</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/projects`}
          $active={location.pathname.startsWith(
            `/team/${selectedTeam.id}/projects`
          )}
        >
          <Folder size={16} />
          <span data-sidebar-label>Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/views`}
          $active={location.pathname === `/team/${selectedTeam.id}/views`}
        >
          <Eye size={16} />
          <span data-sidebar-label>Views</span>
        </SidebarNavItem>
      </SidebarSection>
    </NavWrap>
  )
}

const FooterWrap = styled.div<{ $collapsed: boolean }>`
  [data-sidebar-label] {
    overflow: hidden;
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    width: ${(p) => (p.$collapsed ? 0 : 'auto')};
    transition:
      opacity 0.15s ease,
      width 0.15s ease;
  }
  a,
  button {
    justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  }
`

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <FooterWrap $collapsed={collapsed}>
      <SidebarSection>
        <SidebarNavItem as="button" type="button">
          <Upload size={16} />
          <span data-sidebar-label>Import issues</span>
        </SidebarNavItem>
        <SidebarNavItem as="button" type="button">
          <UserPlus size={16} />
          <span data-sidebar-label>Invite people</span>
        </SidebarNavItem>
      </SidebarSection>
    </FooterWrap>
  )
}
