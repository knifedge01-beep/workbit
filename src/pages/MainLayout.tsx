import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { Navbar, Sidebar } from '@design-system'
import { lightTheme } from '@design-system'
import { DEMO_TEAMS } from '../constants'
import { NavbarLeft, NavbarRight } from '../components/NavbarLeft'
import { SidebarNav, SidebarFooter } from '../components/SidebarNav'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { teamId } = useParams<{ teamId: string }>()
  const selectedTeam =
    teamId != null ? DEMO_TEAMS.find((t) => t.id === teamId) ?? DEMO_TEAMS[0] : DEMO_TEAMS[0]

  return (
    <StyledThemeProvider theme={lightTheme}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          variant="light"
          left={<NavbarLeft teams={DEMO_TEAMS} selectedTeam={selectedTeam} />}
          right={<NavbarRight />}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed((c) => !c)}
            footer={<SidebarFooter collapsed={sidebarCollapsed} />}
          >
            <SidebarNav selectedTeam={selectedTeam} collapsed={sidebarCollapsed} />
          </Sidebar>

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 24 }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </StyledThemeProvider>
  )
}
