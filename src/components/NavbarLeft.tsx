import { Plus, Bell, FileText, FolderKanban } from 'lucide-react'
import { IconButton, Search, Button, Menu, Popup, Avatar } from '@design-system'
import { TeamDropdown } from './TeamDropdown'
import { Link, useNavigate } from 'react-router-dom'
import type { Team } from '../constants'
import styled from 'styled-components'
import { useState } from 'react'

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`


const NotificationWrapper = styled.div`
  position: relative;
`

type Props = {
  teams: Team[]
  selectedTeam: Team
}

export function NavbarLeft({ teams, selectedTeam }: Props) {
  const navigate = useNavigate()
  const [createMenuOpen, setCreateMenuOpen] = useState(false)

  const createMenuItems = [
    {
      id: 'new-issue',
      label: 'New Issue',
      icon: <FileText size={16} />,
      onClick: () => {
        navigate('/my-issues')
        setCreateMenuOpen(false)
      },
    },
    {
      id: 'new-project',
      label: 'New Project',
      icon: <FolderKanban size={16} />,
      onClick: () => {
        navigate('/workspace/projects')
        setCreateMenuOpen(false)
      },
    },
  ]

  return (
    <>
      <TeamDropdown teams={teams} selectedTeam={selectedTeam} />
      <Search
        variant="expandable"
        placeholder="Search issues, projects, members..."
        expandedWidth={280}
      />
      <NavActions>
        <Popup
          isOpen={createMenuOpen}
          onOpenChange={setCreateMenuOpen}
          placement="bottom"
          align="end"
          content={<Menu items={createMenuItems} />}
        >
          <Button size="sm" variant="primary">
            <Plus size={16} />
            New
          </Button>
        </Popup>
      </NavActions>
    </>
  )
}

export function NavbarRight() {
  const navigate = useNavigate()
  const hasNotifications = true // TODO: Replace with actual notification state

  return (
    <NotificationWrapper>
      {hasNotifications && <IconButton aria-label="Notifications" onClick={() => navigate('/inbox')}>
        <Bell size={18} />
      </IconButton>}
      <Link
        to="/profile"
        aria-label="Go to profile"
        style={{ display: 'flex', cursor: 'pointer' }}
      >
        <Avatar name="User" size={24} />
      </Link>
    </NotificationWrapper>
  )
}
