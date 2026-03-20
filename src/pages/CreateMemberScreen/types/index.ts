export type RouteParams = {
  workspaceId: string
  teamId?: string
}

export type MemberStatus = 'Member' | 'Admin' | 'Guest'

export type TeamLite = {
  id: string
  name: string
}
