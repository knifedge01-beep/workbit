import { useState, useEffect } from 'react'
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeProvider, Modal, Stack, Text, Search } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { WorkspaceDropdown } from '../components/WorkspaceDropdown'
import { SidebarNav, SidebarFooter } from '../components/SidebarNav'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../pages/auth/AuthContext'

const LayoutContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  position: relative;
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
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
  const [sidebarWidth, setSidebarWidth] = useState(288)
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
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

  const isProfileRoute = location.pathname.startsWith(
    `/workspace/${workspaceId}/profile`
  )

  const handleSidebarResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sidebarCollapsed) return
    e.preventDefault()

    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const next = Math.min(420, Math.max(220, startWidth + delta))
      setSidebarWidth(next)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

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
          {/* Light sidebar */}
          <aside
            className={cn(
              'relative h-full flex flex-col bg-slate-100 border-r border-slate-200 transition-[width] duration-200 shrink-0 overflow-hidden'
            )}
            style={{ width: sidebarCollapsed ? 56 : sidebarWidth }}
          >
            <div className="border-b border-slate-200">
              {sidebarCollapsed ? (
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    aria-label="Expand sidebar"
                    title="Expand sidebar"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="px-2 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <WorkspaceDropdown
                        workspaces={workspaces}
                        selectedWorkspace={currentWorkspace}
                        onSelect={setCurrentWorkspace}
                      />
                    </div>
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                      aria-label="Collapse sidebar"
                      title="Collapse sidebar"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && !isProfileRoute && (
              <div className="px-2 pt-2 pb-1">
                <Search
                  variant="inline"
                  placeholder="Search issues, projects, members..."
                />
              </div>
            )}

            {/* Nav content */}
            <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-slate-300">
              <SidebarNav
                workspaceId={workspaceId}
                teams={teams}
                collapsed={sidebarCollapsed}
              />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-1">
              <SidebarFooter
                workspaceId={workspaceId}
                collapsed={sidebarCollapsed}
                onLogout={handleLogout}
              />
            </div>

            {!sidebarCollapsed && (
              <div
                onMouseDown={handleSidebarResizeStart}
                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-slate-300/70"
                aria-label="Resize sidebar"
              />
            )}
          </aside>

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
