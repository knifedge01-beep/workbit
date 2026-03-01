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
  workspaceId: string
  teams: Team[]
}

export function SidebarNav({ workspaceId, teams }: Props) {
  const location = useLocation()
  const { teamId } = useParams<{ workspaceId: string; teamId: string }>()
  const base = `/workspace/${workspaceId}`

  const isTeamIssues = (tid: string) =>
    location.pathname === `${base}/team/${tid}` ||
    location.pathname === `${base}/team/${tid}/` ||
    location.pathname.startsWith(`${base}/team/${tid}/issues`)
  const isTeamProjects = (tid: string) =>
    location.pathname === `${base}/team/${tid}/projects` ||
    location.pathname.startsWith(`${base}/team/${tid}/projects/`)
  const isTeamViews = (tid: string) =>
    location.pathname === `${base}/team/${tid}/views`
  const isTeamLogs = (tid: string) =>
    location.pathname === `${base}/team/${tid}/logs`
  const isOnTeam = (tid: string) =>
    location.pathname.startsWith(`${base}/team/${tid}`)

  const hasTeams = teams.length > 0

  return (
    <Stack gap={0}>
      <SidebarSection>
        <SidebarNavItem
          as={Link}
          to={`${base}/inbox`}
          $active={location.pathname === `${base}/inbox`}
        >
          <Mail size={20} />
          <span>Inbox</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`${base}/my-issues`}
          $active={location.pathname === `${base}/my-issues`}
        >
          <FileText size={20} />
          <span>My issues</span>
        </SidebarNavItem>
      </SidebarSection>

      <SidebarCollapsibleSection title="Workspace" defaultOpen>
        <SidebarNavItem
          as={Link}
          to={`${base}/workspace/projects`}
          $active={location.pathname === `${base}/workspace/projects`}
        >
          <Folder size={20} />
          <span>All Projects</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`${base}/workspace/views`}
          $active={location.pathname === `${base}/workspace/views`}
        >
          <Eye size={20} />
          <span>All Views</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`${base}/workspace/member`}
          $active={location.pathname === `${base}/workspace/member`}
        >
          <Users size={20} />
          <span>Member</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`${base}/workspace/teams`}
          $active={location.pathname === `${base}/workspace/teams`}
        >
          <UsersRound size={20} />
          <span>Teams</span>
        </SidebarNavItem>
        <SidebarNavItem
          as={Link}
          to={`${base}/workspace/roles`}
          $active={location.pathname === `${base}/workspace/roles`}
        >
          <Shield size={20} />
          <span>Roles</span>
        </SidebarNavItem>
      </SidebarCollapsibleSection>

      {hasTeams && (
        <>
          <StyledDivider />
          {teams.map((team) => (
            <SidebarCollapsibleSection
              key={team.id}
              title={
                <TeamHeaderItem $active={isOnTeam(team.id)}>
                  <span aria-hidden>
                    <Avatar
                      name={team.name.slice(0, 2).toUpperCase()}
                      size={18}
                    />
                  </span>
                  <span>{team.name}</span>
                </TeamHeaderItem>
              }
              defaultOpen={
                team.id === teamId ||
                (teamId == null && teams[0]?.id === team.id)
              }
            >
              <SidebarNavItem
                as={Link}
                to={`${base}/team/${team.id}/issues/active`}
                $active={isTeamIssues(team.id)}
              >
                <FileText size={20} />
                <span>Issues</span>
              </SidebarNavItem>
              <SidebarNavItem
                as={Link}
                to={`${base}/team/${team.id}/projects`}
                $active={isTeamProjects(team.id)}
              >
                <Folder size={20} />
                <span>Projects</span>
              </SidebarNavItem>
              <SidebarNavItem
                as={Link}
                to={`${base}/team/${team.id}/views`}
                $active={isTeamViews(team.id)}
              >
                <Eye size={20} />
                <span>Views</span>
              </SidebarNavItem>
              <SidebarNavItem
                as={Link}
                to={`${base}/team/${team.id}/logs`}
                $active={isTeamLogs(team.id)}
              >
                <ScrollText size={20} />
                <span>Logs</span>
              </SidebarNavItem>
            </SidebarCollapsibleSection>
          ))}
        </>
      )}
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
