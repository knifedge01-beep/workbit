import { useState, useEffect } from 'react'
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  Navbar,
  Sidebar,
  ThemeProvider,
  Modal,
  Stack,
  Text,
} from '@design-system'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { NavbarLeft, NavbarRight } from '../components/NavbarLeft'
import { SidebarNav, SidebarFooter } from '../components/SidebarNav'

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  background: ${(p) => p.theme.colors.background};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.colors.backgroundSubtle};
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.theme.colors.textMuted};
  }
`

const ContentInner = styled.div`
  flex: 1;
  padding: ${(p) => p.theme.spacing[8]}px ${(p) => p.theme.spacing[6]}px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 1200px) {
    padding: ${(p) => p.theme.spacing[10]}px ${(p) => p.theme.spacing[8]}px;
  }
`

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { workspaceId } = useParams<{
    workspaceId: string
    teamId: string
  }>()
  const {
    workspaces,
    workspacesLoading,
    teams,
    teamsLoading,
    currentWorkspace,
    setCurrentWorkspace,
  } = useWorkspace()

  const isOnCreateTeamPage = location.pathname.includes('/workspace/teams/new')
  const showNoTeamBlocker =
    Boolean(workspaceId) &&
    !workspacesLoading &&
    !teamsLoading &&
    teams.length === 0 &&
    !isOnCreateTeamPage

  useEffect(() => {
    if (!workspaceId || workspacesLoading) return
    const ws = workspaces.find((w) => w.id === workspaceId)
    if (ws) setCurrentWorkspace(ws)
    else navigate('/workspaces', { replace: true })
  }, [
    workspaceId,
    workspaces,
    workspacesLoading,
    setCurrentWorkspace,
    navigate,
  ])

  if (!workspaceId) return null

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

        <Navbar
          variant="light"
          left={
            <NavbarLeft
              workspaces={workspaces}
              currentWorkspace={currentWorkspace}
              onSelectWorkspace={setCurrentWorkspace}
            />
          }
          right={<NavbarRight workspaceId={workspaceId} />}
        />

        <MainContainer>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed((c) => !c)}
            footer={<SidebarFooter />}
          >
            <SidebarNav workspaceId={workspaceId} teams={teams} />
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
