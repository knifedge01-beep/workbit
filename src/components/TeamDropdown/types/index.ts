import type { Team } from '../../../constants'

export type TeamDropdownProps = {
  workspaceId: string
  teams: Team[]
  selectedTeam: Team
}
