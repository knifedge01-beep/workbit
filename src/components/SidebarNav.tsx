import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  Mail,
  FileText,
  Folder,
  Eye,
  ArrowLeft,
  ChevronDown,
  KeyRound,
  User,
  Settings,
  Users,
  UsersRound,
  Shield,
  HelpCircle,
  Bell,
  LogOut,
  GitBranch,
} from 'lucide-react'
import { cn } from '@design-system-v2/lib/utils'
import { Avatar } from '@design-system'
import type { Team } from '../constants'

type NavItemProps = {
  to: string
  active?: boolean
  children: React.ReactNode
  collapsed?: boolean
  shortcut?: string
}

function NavItem({ to, active, children, collapsed, shortcut }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors',
        collapsed && 'justify-center px-1.5 [&>span]:hidden [&>svg]:mx-auto',
        active
          ? 'bg-slate-200/80 text-slate-900 font-medium'
          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
      )}
    >
      {children}
      {!collapsed && shortcut && (
        <span className="ml-auto rounded-md bg-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600">
          {shortcut}
        </span>
      )}
    </Link>
  )
}

type Props = {
  workspaceId: string
  teams: Team[]
  collapsed?: boolean
}

export function SidebarNav({ workspaceId, teams, collapsed = false }: Props) {
  const location = useLocation()
  useParams<{ workspaceId: string; teamId: string }>()
  const base = `/workspace/${workspaceId}`
  const isProfileRoute = location.pathname.startsWith(`${base}/profile`)
  const activeProfileTab =
    new URLSearchParams(location.search).get('tab') === 'profile'
      ? 'profile'
      : 'api-keys'
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [teamsOpen, setTeamsOpen] = useState(true)
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    () => Object.fromEntries(teams.map((t) => [t.id, true]))
  )

  const isTeamIssues = (tid: string) =>
    location.pathname === `${base}/team/${tid}` ||
    location.pathname === `${base}/team/${tid}/` ||
    location.pathname.startsWith(`${base}/team/${tid}/issues`)
  const isTeamProjects = (tid: string) =>
    location.pathname.startsWith(`${base}/team/${tid}/projects`)
  const isTeamViews = (tid: string) =>
    location.pathname === `${base}/team/${tid}/views`
  const isTeamLogs = (tid: string) =>
    location.pathname === `${base}/team/${tid}/logs`

  if (isProfileRoute && collapsed) {
    return (
      <div className="flex flex-col gap-1 px-1">
        <NavItem to={`${base}/inbox`} collapsed>
          <ArrowLeft size={15} className="shrink-0" />
          <span>Back</span>
        </NavItem>
        <NavItem
          to={`${base}/profile?tab=profile`}
          active={activeProfileTab === 'profile'}
          collapsed
        >
          <User size={15} className="shrink-0" />
          <span>Profile</span>
        </NavItem>
        <NavItem
          to={`${base}/profile?tab=api-keys`}
          active={activeProfileTab === 'api-keys'}
          collapsed
        >
          <KeyRound size={15} className="shrink-0" />
          <span>API keys</span>
        </NavItem>
      </div>
    )
  }

  if (collapsed) {
    return (
      <div className="flex flex-col gap-1 px-1">
        <NavItem
          to={`${base}/inbox`}
          active={location.pathname === `${base}/inbox`}
          collapsed
        >
          <Mail size={15} className="shrink-0" />
          <span>Inbox</span>
        </NavItem>
        <NavItem
          to={`${base}/my-issues`}
          active={location.pathname === `${base}/my-issues`}
          collapsed
        >
          <FileText size={15} className="shrink-0" />
          <span>My issues</span>
        </NavItem>
        <NavItem
          to={`${base}/workspace/projects`}
          active={location.pathname === `${base}/workspace/projects`}
          collapsed
        >
          <Folder size={15} className="shrink-0" />
          <span>Projects</span>
        </NavItem>
        <NavItem
          to={`${base}/workspace/views`}
          active={location.pathname === `${base}/workspace/views`}
          collapsed
        >
          <Eye size={15} className="shrink-0" />
          <span>Views</span>
        </NavItem>
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`${base}/team/${team.id}/issues/active`}
            className={cn(
              'flex items-center justify-center px-1 py-1 rounded-md transition-colors',
              isTeamIssues(team.id)
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
            aria-label={team.name}
            title={team.name}
          >
            <Avatar name={team.name.slice(0, 2).toUpperCase()} size={18} />
          </Link>
        ))}
      </div>
    )
  }

  if (isProfileRoute) {
    return (
      <div className="flex flex-col gap-2 px-2">
        <Link
          to={`${base}/inbox`}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[13px] text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft size={15} className="shrink-0" />
          <span>Back to workspace</span>
        </Link>

        <div className="my-1 border-t border-slate-200" />

        <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Profile
        </div>

        <div className="space-y-0.5">
          <NavItem
            to={`${base}/profile?tab=profile`}
            active={activeProfileTab === 'profile'}
          >
            <User size={15} className="shrink-0" />
            <span>Account details</span>
          </NavItem>
          <NavItem
            to={`${base}/profile?tab=api-keys`}
            active={activeProfileTab === 'api-keys'}
          >
            <KeyRound size={15} className="shrink-0" />
            <span>API keys</span>
          </NavItem>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="space-y-0.5">
        <NavItem
          to={`${base}/inbox`}
          active={location.pathname === `${base}/inbox`}
          shortcut="⌘2"
        >
          <Mail size={15} className="shrink-0" />
          <span>Inbox</span>
        </NavItem>
        <NavItem
          to={`${base}/my-issues`}
          active={location.pathname === `${base}/my-issues`}
          shortcut="⌘3"
        >
          <FileText size={15} className="shrink-0" />
          <span>My issues</span>
        </NavItem>
      </div>

      <div className="my-2 border-t border-slate-200" />

      <button
        type="button"
        onClick={() => setWorkspaceOpen((v) => !v)}
        className="w-full flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
      >
        <span>Workspace</span>
        <ChevronDown
          size={13}
          className={cn('transition-transform', !workspaceOpen && '-rotate-90')}
        />
      </button>
      {workspaceOpen && (
        <div className="space-y-0.5">
          <NavItem
            to={`${base}/workspace/projects`}
            active={location.pathname === `${base}/workspace/projects`}
          >
            <Folder size={15} className="shrink-0" />
            <span>Projects</span>
          </NavItem>
          <NavItem
            to={`${base}/workspace/views`}
            active={location.pathname === `${base}/workspace/views`}
          >
            <Eye size={15} className="shrink-0" />
            <span>Views</span>
          </NavItem>
          <NavItem
            to={`${base}/workspace/member`}
            active={location.pathname === `${base}/workspace/member`}
          >
            <Users size={15} className="shrink-0" />
            <span>Members</span>
          </NavItem>
          <NavItem
            to={`${base}/workspace/teams`}
            active={location.pathname === `${base}/workspace/teams`}
          >
            <UsersRound size={15} className="shrink-0" />
            <span>Teams</span>
          </NavItem>
          <NavItem
            to={`${base}/workspace/roles`}
            active={location.pathname === `${base}/workspace/roles`}
          >
            <Shield size={15} className="shrink-0" />
            <span>Roles</span>
          </NavItem>
        </div>
      )}

      {teams.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setTeamsOpen((v) => !v)}
            className="w-full mt-2 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
          >
            <span>Your teams</span>
            <ChevronDown
              size={13}
              className={cn('transition-transform', !teamsOpen && '-rotate-90')}
            />
          </button>
          {teamsOpen && (
            <div className="space-y-1">
              {teams.map((team) => {
                const expanded = expandedTeams[team.id] ?? true
                return (
                  <div key={team.id} className="rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTeams((prev) => ({
                          ...prev,
                          [team.id]: !expanded,
                        }))
                      }
                      className={cn(
                        'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors',
                        isTeamIssues(team.id) ||
                          isTeamProjects(team.id) ||
                          isTeamViews(team.id) ||
                          isTeamLogs(team.id)
                          ? 'bg-slate-200/80 text-slate-900 font-medium'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                      )}
                    >
                      <Avatar
                        name={team.name.slice(0, 2).toUpperCase()}
                        size={18}
                      />
                      <span className="flex-1 text-left">{team.name}</span>
                      <ChevronDown
                        size={13}
                        className={cn(
                          'transition-transform',
                          !expanded && '-rotate-90'
                        )}
                      />
                    </button>

                    {expanded && (
                      <div className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                        <NavItem
                          to={`${base}/team/${team.id}/issues/active`}
                          active={isTeamIssues(team.id)}
                        >
                          <FileText size={13} className="shrink-0" />
                          <span>Issues</span>
                        </NavItem>
                        <NavItem
                          to={`${base}/team/${team.id}/projects`}
                          active={isTeamProjects(team.id)}
                        >
                          <Folder size={13} className="shrink-0" />
                          <span>Projects</span>
                        </NavItem>
                        <NavItem
                          to={`${base}/team/${team.id}/views`}
                          active={isTeamViews(team.id)}
                        >
                          <Eye size={13} className="shrink-0" />
                          <span>Views</span>
                        </NavItem>
                        <NavItem
                          to={`${base}/team/${team.id}/logs`}
                          active={isTeamLogs(team.id)}
                        >
                          <GitBranch size={13} className="shrink-0" />
                          <span>Logs</span>
                        </NavItem>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function SidebarFooter({
  workspaceId,
  collapsed = false,
  onLogout,
}: {
  workspaceId: string
  collapsed?: boolean
  onLogout?: () => void
}) {
  const location = useLocation()
  const isProfileRoute = location.pathname.startsWith(
    `/workspace/${workspaceId}/profile`
  )

  if (collapsed) {
    return (
      <div className="flex flex-col gap-1 px-1 pb-2">
        {!isProfileRoute && (
          <Link
            to={`/workspace/${workspaceId}/profile`}
            className="flex items-center justify-center px-1 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Settings"
          >
            <Settings size={15} className="shrink-0" />
          </Link>
        )}
        <Link
          to="/help"
          className="flex items-center justify-center px-1 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Help center"
        >
          <HelpCircle size={15} className="shrink-0" />
        </Link>
        {!isProfileRoute && (
          <Link
            to="/notifications"
            className="flex items-center justify-center px-1 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={15} className="shrink-0" />
          </Link>
        )}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center px-1 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={15} className="shrink-0" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5 px-2 pb-2">
      {!isProfileRoute && (
        <Link
          to={`/workspace/${workspaceId}/profile`}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Settings size={15} className="shrink-0" />
          <span>Settings</span>
        </Link>
      )}
      <Link
        to="/help"
        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <HelpCircle size={15} className="shrink-0" />
        <span>Help center</span>
      </Link>
      {!isProfileRoute && (
        <Link
          to="/notifications"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell size={15} className="shrink-0" />
          <span>Notifications</span>
        </Link>
      )}
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Log out"
      >
        <LogOut size={15} className="shrink-0" />
        <span>Log out</span>
      </button>
    </div>
  )
}
