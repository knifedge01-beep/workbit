import { Bell, LogOut } from 'lucide-react'
import { IconButton, Search, Avatar } from '@design-system'
import { WorkspaceDropdown } from './WorkspaceDropdown'
import { Link, useNavigate } from 'react-router-dom'
import type { ApiWorkspace } from '../api/client'
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
  workspaces: ApiWorkspace[]
  currentWorkspace: ApiWorkspace | null
  onSelectWorkspace: (ws: ApiWorkspace) => void
}

export function NavbarLeft({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
}: Props) {
  return (
    <>
      <WorkspaceDropdown
        workspaces={workspaces}
        selectedWorkspace={currentWorkspace}
        onSelect={onSelectWorkspace}
      />
      <Search
        variant="expandable"
        placeholder="Search issues, projects, members..."
        expandedWidth={280}
      />
    </>
  )
}

type NavbarRightProps = { workspaceId: string }

export function NavbarRight({ workspaceId }: NavbarRightProps) {
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
          onClick={() => navigate(`/workspace/${workspaceId}/inbox`)}
        >
          <Bell size={18} />
        </IconButton>
      )}
      <Link
        to={`/workspace/${workspaceId}/profile`}
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
