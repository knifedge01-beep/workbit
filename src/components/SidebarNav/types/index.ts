import type { Team } from '../../../constants'

export type NavItemProps = {
  to: string
  active?: boolean
  children: React.ReactNode
  collapsed?: boolean
  shortcut?: string
}

export type SidebarNavProps = {
  workspaceId: string
  teams: Team[]
  collapsed?: boolean
}

export type SidebarFooterProps = {
  workspaceId: string
  collapsed?: boolean
  onLogout?: () => void
}
