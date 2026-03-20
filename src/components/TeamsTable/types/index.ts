export type TeamTableRow = {
  id: string
  teamName: string
  members: string
  project: string
}

export type TeamsTableProps = {
  workspaceId: string
  teams: TeamTableRow[]
  className?: string
}
