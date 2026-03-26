import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ThemeProvider, Modal, Stack, Text } from '@design-system'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@thedatablitz/sidebar'

import { SidebarNav } from '../../components/SidebarNav'
import { SidebarNavFooter } from '../../components/SidebarNav/footer'

import { WorkspaceDropdown } from '../../components/WorkspaceDropdown'
import { useWorkspace } from '../../contexts/WorkspaceContext'

import {
  ContentInner,
  ContentWrapper,
  LayoutContainer,
  MainContainer,
} from './styles'
import { MainLayoutParams } from './types'
import { isProfileRoute, shouldShowNoTeamBlocker } from './utils/helpers'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { GlobalSearch } from '../../components/GlobalSearch'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { workspaceId } = useParams<MainLayoutParams>()
  const {
    workspaces,
    workspacesLoading,
    teams,
    teamsLoading,
    currentWorkspace,
    setCurrentWorkspace,
  } = useWorkspace()

  const showNoTeamBlocker = shouldShowNoTeamBlocker({
    workspaceId,
    workspacesLoading,
    teamsLoading,
    teamsCount: teams.length,
    pathname: location.pathname,
  })

  useEffect(() => {
    if (!workspaceId || workspacesLoading) return
    const workspace = workspaces.find((item) => item.id === workspaceId)
    if (workspace) {
      setCurrentWorkspace(workspace)
    } else {
      navigate('/workspaces', { replace: true })
    }
  }, [
    workspaceId,
    workspaces,
    workspacesLoading,
    setCurrentWorkspace,
    navigate,
  ])

  if (!workspaceId) return null

  const profileRoute = isProfileRoute(location.pathname, workspaceId)

  return (
    <ThemeProvider>
      <LayoutContainer>
        <Modal
          open={showNoTeamBlocker}
          onClose={() => navigate('/workspaces')}
          title="Create your first team"
          primaryLabel="Create team"
          onPrimary={() =>
            workspaceId &&
            navigate(`/workspace/${workspaceId}/workspace/teams/new`)
          }
          secondaryLabel="Back to workspaces"
          onSecondary={() => navigate('/workspaces')}
        >
          <Stack gap={2}>
            <Text as="p">
              This workspace has no teams yet. Create a team to get started with
              projects and issues.
            </Text>
          </Stack>
        </Modal>

        <MainContainer>
          {/* @ts-expect-error Sidebar package types do not expose controlled collapse props yet */}
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          >
            <SidebarHeader>
              {sidebarCollapsed ? (
                <Button
                  buttonType="icon"
                  variant="primary"
                  icon={<ChevronRight size={16} />}
                  onClick={() => setSidebarCollapsed(false)}
                />
              ) : (
                <Inline fullWidth wrap={false}>
                  <WorkspaceDropdown
                    workspaces={workspaces}
                    selectedWorkspace={currentWorkspace}
                    onSelect={setCurrentWorkspace}
                  />
                  <Button
                    buttonType="icon"
                    variant="primary"
                    icon={<ChevronLeft size={16} />}
                    onClick={() => setSidebarCollapsed(true)}
                  />
                </Inline>
              )}
            </SidebarHeader>

            {!sidebarCollapsed && (
              <GlobalSearch
                sidebarCollapsed={sidebarCollapsed}
                profileRoute={profileRoute}
              />
            )}

            <SidebarContent>
              <SidebarNav
                workspaceId={workspaceId}
                teams={teams}
                collapsed={sidebarCollapsed}
              />
            </SidebarContent>

            <SidebarFooter divider={false}>
              <SidebarNavFooter
                workspaceId={workspaceId}
                collapsed={sidebarCollapsed}
              />
            </SidebarFooter>
          </Sidebar>

          <ContentWrapper>
            <ContentInner>
              <Outlet />
            </ContentInner>
          </ContentWrapper>
        </MainContainer>
      </LayoutContainer>
    </ThemeProvider>
  )
}
