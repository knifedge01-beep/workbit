import type { ColumnDef } from '@thedatablitz/table'

export type TeamProjectRow = {
  id: string
  name: string
  status: string
}

export type TeamProjectsParams = {
  workspaceId: string
  teamId: string
}

export type TeamProjectsScreenProps = {
  teamName: string
}

export type TeamProjectColumnDef = ColumnDef<TeamProjectRow, unknown>
