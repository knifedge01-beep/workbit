import { useEffect, useState, type MouseEvent } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ThemeProvider, Modal, Stack, Text, Search } from '@design-system'
import { cn } from '@design-system-v2/lib/utils'

import { SidebarFooter, SidebarNav } from '../../components/SidebarNav'
import { WorkspaceDropdown } from '../../components/WorkspaceDropdown'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useAuth } from '../auth/AuthContext'
import {
  ContentInner,
  ContentWrapper,
  LayoutContainer,
  MainContainer,
} from './styles'
import {
  MainLayoutParams,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_DEFAULT_WIDTH,
} from './types'
import {
  clampSidebarWidth,
  isProfileRoute,
  shouldShowNoTeamBlocker,
} from './utils/helpers'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(
    SIDEBAR_EXPANDED_DEFAULT_WIDTH
  )
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
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

  const handleSidebarResizeStart = (e: MouseEvent<HTMLDivElement>) => {
    if (sidebarCollapsed) return
    e.preventDefault()

    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const delta = moveEvent.clientX - startX
      setSidebarWidth(clampSidebarWidth(startWidth + delta))
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
          <aside
            className={cn(
              'relative h-full flex flex-col bg-slate-100 border-r border-slate-200 transition-[width] duration-200 shrink-0 overflow-hidden'
            )}
            style={{
              width: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth,
            }}
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

            {!sidebarCollapsed && !profileRoute && (
              <div className="px-2 pt-2 pb-1">
                <Search
                  variant="inline"
                  placeholder="Search issues, projects, members..."
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-slate-300">
              <SidebarNav
                workspaceId={workspaceId}
                teams={teams}
                collapsed={sidebarCollapsed}
              />
            </div>

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
