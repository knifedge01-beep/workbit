import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Mail,
  FileText,
  Folder,
  ArrowLeft,
  KeyRound,
  User,
  Settings,
  Users,
  UsersRound,
  Shield,
  HelpCircle,
  Bell,
  LogOut,
} from 'lucide-react'

import { Avatar } from '@thedatablitz/avatar'
import { Box } from '@thedatablitz/box'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { Tree, type TreeNode } from '@thedatablitz/tree'
import { getToken } from '@thedatablitz/tokens'
import { cn } from '@design-system-v2/lib/utils'

import { navClasses } from './styles/classes'
import type { NavItemProps, SidebarFooterProps, SidebarNavProps } from './types'
import {
  getActiveProfileTab,
  getSelectedNavTreeId,
  initExpandedTeams,
  isTeamIssues,
} from './utils/routeHelpers'

/** Glass trigger with danger semantic color (no separate `danger+glass` variant in Button). */
const logoutDangerGlassStyle = {
  color: getToken('color.icon.danger'),
  borderColor: getToken('color.border.danger'),
} as const

function NavItem({ to, active, children, collapsed, shortcut }: NavItemProps) {
  const linkClass = cn(
    navClasses.navItemBase,
    collapsed && navClasses.navItemCollapsed,
    active ? navClasses.navItemActive : navClasses.navItemInactive
  )

  if (collapsed) {
    return (
      <Link
        to={to}
        className={linkClass}
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      to={to}
      className={linkClass}
      aria-current={active ? 'page' : undefined}
    >
      <Inline align="center" gap="100" fullWidth className="min-w-0 w-full">
        {children}
        {shortcut ? (
          <Text
            as="span"
            variant="caption2"
            color="color.text.subtle"
            className="ml-auto shrink-0 rounded-md bg-slate-200 px-1.5 py-0.5"
          >
            {shortcut}
          </Text>
        ) : null}
      </Inline>
    </Link>
  )
}

export function SidebarNav({
  workspaceId,
  teams,
  collapsed = false,
}: SidebarNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const base = `/workspace/${workspaceId}`
  const isProfileRoute = location.pathname.startsWith(`${base}/profile`)
  const activeProfileTab = getActiveProfileTab(location.search)
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [teamsOpen, setTeamsOpen] = useState(true)
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    () => initExpandedTeams(teams)
  )

  const navPaths = useMemo(() => {
    const paths: Record<string, string> = {
      'nav-inbox': `${base}/inbox`,
      'ws-projects': `${base}/workspace/projects`,
      'ws-members': `${base}/workspace/member`,
      'ws-teams': `${base}/workspace/teams`,
      'ws-roles': `${base}/workspace/roles`,
    }
    for (const t of teams) {
      paths[`team:${t.id}:i`] = `${base}/team/${t.id}/issues/active`
      paths[`team:${t.id}:p`] = `${base}/team/${t.id}/projects`
    }
    return paths
  }, [base, teams])

  const sidebarTreeNodes = useMemo((): TreeNode[] => {
    const workspaceChildren: TreeNode[] = [
      {
        id: 'ws-projects',
        label: (
          <Inline align="center" gap="100" fullWidth className="min-w-0">
            <Folder size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Projects
            </Text>
          </Inline>
        ),
      },
      {
        id: 'ws-members',
        label: (
          <Inline align="center" gap="100" fullWidth className="min-w-0">
            <Users size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Members
            </Text>
          </Inline>
        ),
      },
      {
        id: 'ws-teams',
        label: (
          <Inline align="center" gap="100" fullWidth className="min-w-0">
            <UsersRound size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Teams
            </Text>
          </Inline>
        ),
      },
      {
        id: 'ws-roles',
        label: (
          <Inline align="center" gap="100" fullWidth className="min-w-0">
            <Shield size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Roles
            </Text>
          </Inline>
        ),
      },
    ]

    const teamNodes: TreeNode[] = teams.map((team) => ({
      id: `team:${team.id}`,
      label: (
        <Inline align="center" gap="100" fullWidth className="min-w-0">
          <Avatar name={team.name} size="small" />
          <Text
            as="span"
            variant="body3"
            truncate
            className="min-w-0 flex-1 text-left"
          >
            {team.name}
          </Text>
        </Inline>
      ),
      children: [
        {
          id: `team:${team.id}:i`,
          label: (
            <Inline align="center" gap="100" fullWidth className="min-w-0">
              <FileText size={13} className="shrink-0" />
              <Text
                as="span"
                variant="body3"
                truncate
                className="min-w-0 flex-1"
              >
                Issues
              </Text>
            </Inline>
          ),
        },
        {
          id: `team:${team.id}:p`,
          label: (
            <Inline align="center" gap="100" fullWidth className="min-w-0">
              <Folder size={13} className="shrink-0" />
              <Text
                as="span"
                variant="body3"
                truncate
                className="min-w-0 flex-1"
              >
                Projects
              </Text>
            </Inline>
          ),
        },
      ],
    }))

    const roots: TreeNode[] = [
      {
        id: 'nav-inbox',
        label: (
          <Inline align="center" gap="100" fullWidth className="min-w-0">
            <Mail size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Inbox
            </Text>
            <Text
              as="span"
              variant="caption2"
              color="color.text.subtle"
              className="shrink-0 rounded-md bg-slate-200 px-1.5 py-0.5"
            >
              ⌘2
            </Text>
          </Inline>
        ),
      },
      {
        id: 'sec-workspace',
        label: (
          <Box className="mt-2 w-full border-t border-slate-200 pt-2">
            <Text
              as="span"
              variant="caption1"
              color="color.text.subtle"
              className="font-semibold uppercase tracking-wide"
            >
              Workspace
            </Text>
          </Box>
        ),
        children: workspaceChildren,
      },
    ]

    if (teams.length > 0) {
      roots.push({
        id: 'sec-teams',
        label: (
          <Text
            as="span"
            variant="caption1"
            color="color.text.subtle"
            className="mt-2 font-semibold uppercase tracking-wide"
          >
            Your teams
          </Text>
        ),
        children: teamNodes,
      })
    }

    return roots
  }, [teams])

  const expandedTreeIds = useMemo(() => {
    const ids: string[] = []
    if (workspaceOpen) ids.push('sec-workspace')
    if (teams.length > 0 && teamsOpen) ids.push('sec-teams')
    for (const t of teams) {
      if (expandedTeams[t.id] !== false) ids.push(`team:${t.id}`)
    }
    return ids
  }, [workspaceOpen, teamsOpen, teams, expandedTeams])

  const selectedTreeId = getSelectedNavTreeId(location.pathname, base, teams)
  const selectedTreeIds = selectedTreeId ? [selectedTreeId] : []

  const handleTreeToggle = (id: string, expanded: boolean) => {
    if (id === 'sec-workspace') setWorkspaceOpen(expanded)
    else if (id === 'sec-teams') setTeamsOpen(expanded)
    else {
      const m = /^team:([^:]+)$/.exec(id)
      if (m) {
        setExpandedTeams((prev) => ({ ...prev, [m[1]]: expanded }))
      }
    }
  }

  const handleTreeSelect = (id: string) => {
    if (id === 'sec-workspace') {
      setWorkspaceOpen((o) => !o)
      return
    }
    if (id === 'sec-teams') {
      setTeamsOpen((o) => !o)
      return
    }
    const parentMatch = /^team:([^:]+)$/.exec(id)
    if (parentMatch) {
      const tid = parentMatch[1]
      setExpandedTeams((prev) => ({
        ...prev,
        [tid]: !(prev[tid] ?? true),
      }))
      return
    }
    const path = navPaths[id]
    if (path) navigate(path)
  }

  if (isProfileRoute && collapsed) {
    return (
      <Stack gap="050" padding="050" className="px-1">
        <Link
          to={`${base}/inbox`}
          className={cn(
            navClasses.navItemBase,
            navClasses.navItemCollapsed,
            navClasses.navItemInactive
          )}
        >
          <ArrowLeft size={15} className="shrink-0" />
          <span>Back</span>
        </Link>
        <Link
          to={`${base}/profile?tab=profile`}
          className={cn(
            navClasses.navItemBase,
            navClasses.navItemCollapsed,
            activeProfileTab === 'profile'
              ? navClasses.navItemActive
              : navClasses.navItemInactive
          )}
          aria-current={activeProfileTab === 'profile' ? 'page' : undefined}
        >
          <User size={15} className="shrink-0" />
          <span>Profile</span>
        </Link>
        <Link
          to={`${base}/profile?tab=api-keys`}
          className={cn(
            navClasses.navItemBase,
            navClasses.navItemCollapsed,
            activeProfileTab === 'api-keys'
              ? navClasses.navItemActive
              : navClasses.navItemInactive
          )}
          aria-current={activeProfileTab === 'api-keys' ? 'page' : undefined}
        >
          <KeyRound size={15} className="shrink-0" />
          <span>API keys</span>
        </Link>
      </Stack>
    )
  }

  if (collapsed) {
    return (
      <Stack gap="050" padding="050" className="px-1">
        <Link
          to={`${base}/inbox`}
          className={cn(
            navClasses.navItemBase,
            navClasses.navItemCollapsed,
            location.pathname === `${base}/inbox`
              ? navClasses.navItemActive
              : navClasses.navItemInactive
          )}
          aria-current={
            location.pathname === `${base}/inbox` ? 'page' : undefined
          }
        >
          <Mail size={15} className="shrink-0" />
          <span>Inbox</span>
        </Link>
        <Link
          to={`${base}/workspace/projects`}
          className={cn(
            navClasses.navItemBase,
            navClasses.navItemCollapsed,
            location.pathname === `${base}/workspace/projects`
              ? navClasses.navItemActive
              : navClasses.navItemInactive
          )}
          aria-current={
            location.pathname === `${base}/workspace/projects`
              ? 'page'
              : undefined
          }
        >
          <Folder size={15} className="shrink-0" />
          <span>Projects</span>
        </Link>
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`${base}/team/${team.id}/issues/active`}
            className={cn(
              'flex items-center justify-center px-1 py-1 rounded-md transition-colors',
              isTeamIssues(base, team.id, location.pathname)
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
            aria-label={team.name}
            title={team.name}
          >
            <Avatar name={team.name} size="small" />
          </Link>
        ))}
      </Stack>
    )
  }

  if (isProfileRoute) {
    return (
      <Stack gap="200" className="px-2">
        <Link
          to={`${base}/inbox`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[13px] text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft size={15} className="shrink-0" />
          <Text as="span" variant="body3" color="color.text.DEFAULT">
            Back to workspace
          </Text>
        </Link>

        <Box className="my-1 border-t border-slate-200" />

        <Text
          as="div"
          variant="caption1"
          color="color.text.subtle"
          className="px-1 font-semibold uppercase tracking-wide"
        >
          Profile
        </Text>

        <Stack gap="050">
          <NavItem
            to={`${base}/profile?tab=profile`}
            active={activeProfileTab === 'profile'}
          >
            <User size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              Account details
            </Text>
          </NavItem>
          <NavItem
            to={`${base}/profile?tab=api-keys`}
            active={activeProfileTab === 'api-keys'}
          >
            <KeyRound size={15} className="shrink-0" />
            <Text as="span" variant="body3" truncate className="min-w-0 flex-1">
              API keys
            </Text>
          </NavItem>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack gap="200" className="px-2">
      <Tree
        size="small"
        variant="primary"
        className="min-w-0 w-full"
        style={{ minWidth: 0 }}
        nodes={sidebarTreeNodes}
        expandedIds={expandedTreeIds}
        selectedIds={selectedTreeIds}
        onToggle={handleTreeToggle}
        onSelect={handleTreeSelect}
      />
    </Stack>
  )
}

export function SidebarFooter({
  workspaceId,
  collapsed = false,
  onLogout,
}: SidebarFooterProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isProfileRoute = location.pathname.startsWith(
    `/workspace/${workspaceId}/profile`
  )

  if (collapsed) {
    return (
      <Stack gap="050" padding="050" className="px-1 pb-2">
        {!isProfileRoute ? (
          <Button
            variant="glass"
            buttonType="icon"
            size="small"
            icon={<Settings size={15} />}
            onClick={() => navigate(`/workspace/${workspaceId}/profile`)}
            aria-label="Settings"
            className="w-full"
          />
        ) : null}
        <Button
          variant="glass"
          buttonType="icon"
          size="small"
          icon={<HelpCircle size={15} />}
          onClick={() => navigate('/help')}
          aria-label="Help center"
          className="w-full"
        />
        {!isProfileRoute ? (
          <Button
            variant="glass"
            buttonType="icon"
            size="small"
            icon={<Bell size={15} />}
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="w-full"
          />
        ) : null}
        <Button
          variant="glass"
          buttonType="icon"
          size="small"
          icon={<LogOut size={15} />}
          onClick={onLogout}
          aria-label="Log out"
          className="w-full"
          style={logoutDangerGlassStyle}
        />
      </Stack>
    )
  }

  return (
    <Stack gap="050" className="px-2 pb-2">
      {!isProfileRoute ? (
        <Button
          variant="glass"
          size="small"
          onClick={() => navigate(`/workspace/${workspaceId}/profile`)}
          className="w-full justify-start"
        >
          <Inline align="center" gap="100">
            <Settings size={15} className="shrink-0" aria-hidden />
            <Text as="span" variant="body3" color="color.text.DEFAULT">
              Settings
            </Text>
          </Inline>
        </Button>
      ) : null}
      <Button
        variant="glass"
        size="small"
        onClick={() => navigate('/help')}
        className="w-full justify-start"
      >
        <Inline align="center" gap="100">
          <HelpCircle size={15} className="shrink-0" aria-hidden />
          <Text as="span" variant="body3" color="color.text.DEFAULT">
            Help center
          </Text>
        </Inline>
      </Button>
      {!isProfileRoute ? (
        <Button
          variant="glass"
          size="small"
          onClick={() => navigate('/notifications')}
          className="w-full justify-start"
        >
          <Inline align="center" gap="100">
            <Bell size={15} className="shrink-0" aria-hidden />
            <Text as="span" variant="body3" color="color.text.DEFAULT">
              Notifications
            </Text>
          </Inline>
        </Button>
      ) : null}
      <Button
        variant="glass"
        size="small"
        onClick={onLogout}
        className="w-full justify-start"
        style={logoutDangerGlassStyle}
        aria-label="Log out"
      >
        <Inline align="center" gap="100">
          <LogOut size={15} className="shrink-0" aria-hidden />
          <Text as="span" variant="body3" color="color.icon.danger">
            Log out
          </Text>
        </Inline>
      </Button>
    </Stack>
  )
}
