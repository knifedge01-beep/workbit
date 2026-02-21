import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  SidebarSection,
  SidebarSectionHeading,
  SidebarCollapsibleSection,
  SidebarNavItem,
  Avatar,
  Card,
  Flex,
  Heading,
  Text,
} from '@design-system'
import {
  Mail,
  FileText,
  Folder,
  Eye,
  Play,
  ArrowRight,
  ChevronDown,
  Users,
  Shield,
} from 'lucide-react'
import type { Team } from '../constants'

const TeamRowButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) => (p.$active ? '#FFFFFF' : p.theme.colors.text)};
  background: ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  border-radius: 0 ${(p) => p.theme.radii?.md ?? 6}px ${(p) => p.theme.radii?.md ?? 6}px 0;
  border: none;
  cursor: pointer;
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
  transition: background 0.15s, color 0.15s;
  text-align: left;
  &:hover {
    background: ${(p) => (p.$active ? p.theme.colors.primaryHover : p.theme.colors.surfaceHover)};
  }
  svg {
    flex-shrink: 0;
    color: ${(p) => (p.$active ? '#FFFFFF' : p.theme.colors.textMuted)};
  }
`

const CollapsibleContent = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${(p) => (p.$open ? '2000px' : '0')};
  opacity: ${(p) => (p.$open ? 1 : 0)};
  transition: max-height 0.25s ease, opacity 0.2s ease;
`

const NavWrap = styled.div<{ $collapsed: boolean }>`
  [data-sidebar-label] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    width: ${(p) => (p.$collapsed ? 0 : 'auto')};
    transition: opacity 0.15s ease, width 0.15s ease;
  }
  [data-sidebar-chevron] {
    display: ${(p) => (p.$collapsed ? 'none' : 'flex')};
  }
  a, button[type="button"] {
    justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
    padding-left: ${(p) => (p.$collapsed ? p.theme.spacing[2] : p.theme.spacing[3])}px;
    padding-right: ${(p) => (p.$collapsed ? p.theme.spacing[2] : p.theme.spacing[3])}px;
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
  const [teamExpanded, setTeamExpanded] = useState(true)

  const isTeamIssues = (path: string) =>
    path === `/team/${teamId}` || path === `/team/${teamId}/`
  const isTeamProjects = (path: string) => path === `/team/${teamId}/projects`
  const isTeamViews = (path: string) => path === `/team/${teamId}/views`
  const isOnTeam = location.pathname.startsWith(`/team/${selectedTeam.id}`)

  return (
    <NavWrap $collapsed={collapsed}>
      <SidebarSection>
        <SidebarNavItem as={Link} to="/inbox" $active={location.pathname === '/inbox'}>
          <Mail size={18} />
          <span data-sidebar-label>Inbox</span>
        </SidebarNavItem>
        <SidebarNavItem as={Link} to="/my-issues" $active={location.pathname === '/my-issues'}>
          <FileText size={18} />
          <span data-sidebar-label>My issues</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarCollapsibleSection title={<span data-sidebar-heading>Workspace</span>} defaultOpen>
        <SidebarNavItem
          as={Link}
          to="/workspace/projects"
          $active={location.pathname === '/workspace/projects'}
        >
          <Folder size={18} />
          <span data-sidebar-label>Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/views"
          $active={location.pathname === '/workspace/views'}
        >
          <Eye size={18} />
          <span data-sidebar-label>Views</span>
        </SidebarNavItem>
        <SidebarCollapsibleSection title={<span data-sidebar-heading>More</span>} defaultOpen={false}>
          <SidebarNavItem
            as={Link}
            to="/workspace/member"
            $active={location.pathname === '/workspace/member'}
          >
            <Users size={18} />
            <span data-sidebar-label>Member</span>
          </SidebarNavItem>
          <SidebarNavItem
            as={Link}
            to="/workspace/roles"
            $active={location.pathname === '/workspace/roles'}
          >
            <Shield size={18} />
            <span data-sidebar-label>Roles</span>
          </SidebarNavItem>
        </SidebarCollapsibleSection>
      </SidebarCollapsibleSection>

      <SidebarSection>
        <SidebarSectionHeading data-sidebar-heading>Your teams</SidebarSectionHeading>
        <TeamRowButton
          type="button"
          $active={isOnTeam}
          onClick={() => setTeamExpanded((e) => !e)}
          aria-expanded={teamExpanded}
        >
          <Avatar name={selectedTeam.id.slice(0, 2).toUpperCase()} size={20} />
          <span data-sidebar-label>{selectedTeam.name}</span>
          <motion.span
            data-sidebar-chevron
            style={{ marginLeft: 'auto' }}
            animate={{ rotate: teamExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </TeamRowButton>
        <CollapsibleContent $open={teamExpanded}>
          <div style={{ paddingLeft: collapsed ? 0 : 8 }}>
            <SidebarNavItem
              as={Link}
              to={`/team/${selectedTeam.id}`}
              $active={isTeamIssues(location.pathname)}
            >
              <FileText size={18} />
              <span data-sidebar-label>Issues</span>
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to={`/team/${selectedTeam.id}/projects`}
              $active={isTeamProjects(location.pathname)}
            >
              <Folder size={18} />
              <span data-sidebar-label>Projects</span>
            </SidebarNavItem>
            <SidebarNavItem
              as={Link}
              to={`/team/${selectedTeam.id}/views`}
              $active={isTeamViews(location.pathname)}
            >
              <Eye size={18} />
              <span data-sidebar-label>Views</span>
            </SidebarNavItem>
          </div>
        </CollapsibleContent>
      </SidebarSection>
    </NavWrap>
  )
}

const FooterWrap = styled.div<{ $collapsed: boolean }>`
  [data-sidebar-label] {
    overflow: hidden;
    opacity: ${(p) => (p.$collapsed ? 0 : 1)};
    width: ${(p) => (p.$collapsed ? 0 : 'auto')};
    transition: opacity 0.15s ease, width 0.15s ease;
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
`

export function SidebarFooter({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <FooterWrap $collapsed={collapsed}>
      <Flex direction="column" gap={2}>
        <SidebarNavItem href="#">
          <Play size={18} />
          <span data-sidebar-label>Try</span>
          <ArrowRight size={14} style={{ marginLeft: 'auto' }} data-sidebar-chevron />
        </SidebarNavItem>
        <Card data-sidebar-footer-card>
          <Heading level={5}>What&apos;s new</Heading>
          <Text size="xs" muted>Advanced filters and share issues in private teams</Text>
        </Card>
      </Flex>
    </FooterWrap>
  )
}
