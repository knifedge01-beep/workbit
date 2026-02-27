import { Plus, Bell, FileText, FolderKanban } from 'lucide-react'
import { IconButton, Search, Button, Menu, Popup } from '@design-system'
import { TeamDropdown } from './TeamDropdown'
import { useNavigate } from 'react-router-dom'
import type { Team } from '../constants'
import styled from 'styled-components'
import { useState } from 'react'

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: ${(p) => p.theme.colors.error};
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.surface};
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
      label: 'New Issue',
      icon: <FileText size={16} />,
      onClick: () => {
        navigate('/my-issues')
        setCreateMenuOpen(false)
      },
    },
    {
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
          placement="bottom-end"
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
      <IconButton aria-label="Notifications" onClick={() => navigate('/inbox')}>
        <Bell size={18} />
      </IconButton>
      {hasNotifications && <NotificationBadge />}
    </NotificationWrapper>
  )
}
