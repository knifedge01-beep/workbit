import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Navbar, Sidebar, ThemeProvider } from '@design-system'
import type { Team } from '../constants'
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

const fallbackTeam: Team = { id: '', name: 'Team' }

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { teamId } = useParams<{ teamId: string }>()
  const { teams } = useWorkspace()
  const selectedTeam: Team =
    teamId != null ? (teams.find((t) => t.id === teamId) ?? teams[0]) : teams[0]
  const teamsSafe = teams.length > 0 ? teams : []
  const selectedTeamSafe =
    selectedTeam ?? (teamId ? { id: teamId, name: teamId } : fallbackTeam)

  return (
    <ThemeProvider>
      <LayoutContainer>
        <Navbar
          variant="light"
          left={
            <NavbarLeft teams={teamsSafe} selectedTeam={selectedTeamSafe} />
          }
          right={<NavbarRight />}
        />

        <MainContainer>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed((c) => !c)}
            footer={<SidebarFooter />}
          >
            <SidebarNav selectedTeam={selectedTeamSafe} />
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
