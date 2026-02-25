import { Bell, Search as SearchIcon } from 'lucide-react'
import { IconButton, Avatar } from '@design-system'
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
    </>
  )
}

export function NavbarRight() {
  return (
    <>
      <IconButton aria-label="Search">
        <SearchIcon size={16} />
      </IconButton>
      <IconButton aria-label="Notifications">
        <Bell size={16} />
      </IconButton>
      <Avatar name="User" size={24} />
    </>
  )
}
