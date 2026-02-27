import { Link, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  SidebarSection,
  SidebarCollapsibleSection,
  SidebarNavItem,
  Avatar,
  Popup,
  IconButton,
  Divider,
  Stack,
} from '@design-system'
import {
  Mail,
  FileText,
  Folder,
  Eye,
  Play,
  Users,
  UsersRound,
  Shield,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import { WhatsNewCard } from './WhatsNewCard'
import type { Team } from '../constants'

const StyledDivider = styled(Divider)`
  margin: ${(p) => p.theme.spacing[4]}px 0;
`

const TeamHeaderItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(p) =>
    p.$active ? p.theme.colors.primary : p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  > span:first-of-type {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

type Props = {
  selectedTeam: Team
}

export function SidebarNav({ selectedTeam }: Props) {
  const location = useLocation()
  const { teamId } = useParams<{ teamId: string }>()

  const isTeamIssues = (path: string) =>
    path === `/team/${teamId}` ||
    path === `/team/${teamId}/` ||
    (teamId != null && path.startsWith(`/team/${teamId}/issues`))
  const isTeamProjects = (path: string) =>
    teamId != null &&
    (path === `/team/${teamId}/projects` ||
      path.startsWith(`/team/${teamId}/projects/`))
  const isTeamViews = (path: string) => path === `/team/${teamId}/views`
  const isTeamLogs = (path: string) => path === `/team/${teamId}/logs`
  const isOnTeam = location.pathname.startsWith(`/team/${selectedTeam.id}`)

  return (
    <Stack gap={0}>
      <SidebarSection>
        <SidebarNavItem
          as={Link}
          to="/inbox"
          $active={location.pathname === '/inbox'}
        >
          <Mail size={20} />
          <span>Inbox</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/my-issues"
          $active={location.pathname === '/my-issues'}
        >
          <FileText size={20} />
          <span>My issues</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarCollapsibleSection title="Workspace" defaultOpen>
        <SidebarNavItem
          as={Link}
          to="/workspace/projects"
          $active={location.pathname === '/workspace/projects'}
        >
          <Folder size={20} />
          <span>All Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/views"
          $active={location.pathname === '/workspace/views'}
        >
          <Eye size={20} />
          <span>All Views</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/member"
          $active={location.pathname === '/workspace/member'}
        >
          <Users size={20} />
          <span>Member</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/teams"
          $active={location.pathname === '/workspace/teams'}
        >
          <UsersRound size={20} />
          <span>Teams</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to="/workspace/roles"
          $active={location.pathname === '/workspace/roles'}
        >
          <Shield size={20} />
          <span>Roles</span>
        </SidebarNavItem>
      </SidebarCollapsibleSection>

      <StyledDivider />

      <SidebarCollapsibleSection
        title={
          <TeamHeaderItem $active={isOnTeam}>
            <span aria-hidden>
              <Avatar
                name={selectedTeam.id.slice(0, 2).toUpperCase()}
                size={18}
              />
            </span>
            <span>{selectedTeam.name}</span>
          </TeamHeaderItem>
        }
        defaultOpen
      >
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/issues/active`}
          $active={isTeamIssues(location.pathname)}
        >
          <FileText size={20} />
          <span>Issues</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/projects`}
          $active={isTeamProjects(location.pathname)}
        >
          <Folder size={20} />
          <span>Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/views`}
          $active={isTeamViews(location.pathname)}
        >
          <Eye size={20} />
          <span>Views</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`/team/${selectedTeam.id}/logs`}
          $active={isTeamLogs(location.pathname)}
        >
          <ScrollText size={20} />
          <span>Logs</span>
        </SidebarNavItem>
      </SidebarCollapsibleSection>
    </Stack>
  )
}

export function SidebarFooter() {
  return (
    <Stack gap={2}>
      <SidebarNavItem href="#">
        <Play size={20} />
        <span>Try</span>
      </SidebarNavItem>
      <WhatsNewCard />
      <Popup
        placement="right"
        align="start"
        openOnHover
        openOnClick
        trigger={
          <IconButton aria-label="What's new">
            <Sparkles size={20} />
          </IconButton>
        }
      >
        <WhatsNewCard inline />
      </Popup>
    </Stack>
  )
}
