import { Plus, Bell } from 'lucide-react'
import { IconButton, Search } from '@design-system'
import { TeamDropdown } from './TeamDropdown'
import type { Team } from '../constants'

type Props = {
  teams: Team[]
  selectedTeam: Team
}

export function NavbarLeft({ teams, selectedTeam }: Props) {
  return (
    <>
      <TeamDropdown teams={teams} selectedTeam={selectedTeam} />
      <Search variant="expandable" placeholder="Search..." expandedWidth={200} />
      <IconButton aria-label="Create new">
        <Plus size={18} />
      </IconButton>
    </>
  )
}

export function NavbarRight() {
  return (
    <IconButton aria-label="Notifications">
      <Bell size={18} />
    </IconButton>
  )
}
