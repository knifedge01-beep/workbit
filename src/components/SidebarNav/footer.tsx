import { Button, ButtonVariant } from '@thedatablitz/button'
import { Settings, HelpCircle, Bell, LogOut } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { useAuth } from '../../pages/auth/AuthContext'

export const SidebarNavFooter = ({
  workspaceId,
  collapsed,
}: {
  workspaceId: string
  collapsed: boolean
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const base = `/workspace/${workspaceId}`
  const isProfileRoute = location.pathname.startsWith(`${base}/profile`)

  const handleLogout = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [navigate, signOut])

  const footerItems = useMemo(() => {
    return [
      {
        icon: <Settings size={15} />,
        label: 'Settings',
        onClick: () => navigate(`/workspace/${workspaceId}/profile`),
        visible: !isProfileRoute,
        variant: 'glass',
      },
      {
        icon: <HelpCircle size={15} />,
        label: 'Help center',
        onClick: () => navigate('/help'),
        visible: true,
        variant: 'glass',
      },
      {
        icon: <Bell size={15} />,
        label: 'Notifications',
        onClick: () => navigate('/notifications'),
        visible: !isProfileRoute,
        variant: 'glass',
      },
      {
        icon: <LogOut size={15} />,
        label: 'Log out',
        onClick: handleLogout,
        visible: true,
        variant: 'danger',
      },
    ]
  }, [navigate, workspaceId, isProfileRoute, handleLogout])

  const renderFooterItems = () => {
    return footerItems.map((item) => (
      <Button
        key={item.label}
        buttonType="icon"
        variant={item.variant as ButtonVariant}
        size="small"
        icon={item.icon}
        onClick={item.onClick}
      />
    ))
  }

  if (collapsed) {
    return (
      <Stack gap="150" padding="100" align="center" justify="center">
        {renderFooterItems()}
      </Stack>
    )
  }

  return (
    <Inline
      gap="150"
      padding="100"
      align="center"
      justify="center"
      wrap={false}
    >
      {renderFooterItems()}
    </Inline>
  )
}
