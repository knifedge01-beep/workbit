import type { ApiTeam } from '../../api/client'

export type RouteParams = {
  workspaceId: string
  teamId?: string
}

export type TeamSelectOption = {
  value: string
  label: string
}

export type TeamList = ApiTeam[]
