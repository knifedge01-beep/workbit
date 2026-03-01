import { Bell, LogOut } from 'lucide-react'
import { IconButton, Search, Avatar } from '@design-system'
import { TeamDropdown } from './TeamDropdown'
import { Link, useNavigate } from 'react-router-dom'
import type { Team } from '../constants'
import { useAuth } from '../pages/auth/AuthContext'
import styled from 'styled-components'

const NotificationWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

type Props = {
  teams: Team[]
  selectedTeam: Team
}

export function NavbarLeft({ teams, selectedTeam }: Props) {
  return (
    <>
      <TeamDropdown teams={teams} selectedTeam={selectedTeam} />
      <Search
        variant="expandable"
        placeholder="Search issues, projects, members..."
        expandedWidth={280}
      />
    </>
  )
}

export function NavbarRight() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const hasNotifications = true // TODO: Replace with actual notification state

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <NotificationWrapper>
      {hasNotifications && (
        <IconButton
          aria-label="Notifications"
          onClick={() => navigate('/inbox')}
        >
          <Bell size={18} />
        </IconButton>
      )}
      <Link
        to="/profile"
        aria-label="Go to profile"
        style={{ display: 'flex', cursor: 'pointer' }}
      >
        <Avatar name="User" size={24} />
      </Link>
      <IconButton aria-label="Log out" onClick={handleLogout}>
        <LogOut size={18} />
      </IconButton>
    </NotificationWrapper>
  )
}
