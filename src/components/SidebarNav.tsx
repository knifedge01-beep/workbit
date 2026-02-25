import { Link, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  SidebarSection,
  SidebarSectionHeading,
  SidebarCollapsibleSection,
  SidebarNavItem,
  Flex,
  Popup,
  IconButton,
} from '@design-system'
import {
  Mail,
  FileText,
  Folder,
  Eye,
  Users,
  UsersRound,
  Shield,
  ScrollText,
  Sparkles,
  Play,
  ArrowRight,
} from 'lucide-react'
import { WhatsNewCard } from './WhatsNewCard'
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
  const { teamId } = useParams<{ teamId: string }>()

  const isTeamLogs = (path: string) => path === `/team/${teamId}/logs`

  return (
    <NavWrap $collapsed={collapsed}>
      <SidebarSection>
        <SidebarNavItem as={Link} to="/" $active={location.pathname === '/'}>
          <Sparkles size={16} />
          <span data-sidebar-label>Dashboard</span>
        </SidebarNavItem>
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

      <SidebarSection>
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
          to="/workspace/teams"
          $active={location.pathname === '/workspace/teams'}
        >
          <UsersRound size={16} />
          <span data-sidebar-label>Teams</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/member"
          $active={location.pathname === '/workspace/member'}
        >
          <Users size={16} />
          <span data-sidebar-label>Members</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarCollapsibleSection
        title={<span data-sidebar-heading>More</span>}
        defaultOpen={false}
      >
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
          to="/workspace/roles"
          $active={location.pathname === '/workspace/roles'}
        >
          <Shield size={16} />
          <span data-sidebar-label>Roles</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/logs`}
          $active={isTeamLogs(location.pathname)}
        >
          <ScrollText size={16} />
          <span data-sidebar-label>Logs</span>
        </SidebarNavItem>
      </SidebarCollapsibleSection>
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
  [data-sidebar-chevron] {
    display: ${(p) => (p.$collapsed ? 'none' : 'inline-block')};
  }
  a {
    justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  }
  [data-sidebar-footer-card] {
    display: ${(p) => (p.$collapsed ? 'none' : 'block')};
  }
  [data-sidebar-whats-new-popup] {
    display: ${(p) => (p.$collapsed ? 'inline-flex' : 'none')};
  }
`

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <FooterWrap $collapsed={collapsed}>
      <Flex direction="column" gap={2}>
        <SidebarNavItem href="#">
          <Play size={18} />
          <span data-sidebar-label>Try</span>
          <ArrowRight
            size={14}
            style={{ marginLeft: 'auto' }}
            data-sidebar-chevron
          />
        </SidebarNavItem>
        <div data-sidebar-footer-card>
          <WhatsNewCard />
        </div>
        <div data-sidebar-whats-new-popup>
          <Popup
            placement="right"
            align="start"
            openOnHover
            openOnClick
            trigger={
              <IconButton aria-label="What's new">
                <Sparkles size={18} />
              </IconButton>
            }
          >
            <WhatsNewCard inline />
          </Popup>
        </div>
      </Flex>
    </FooterWrap>
  )
}
