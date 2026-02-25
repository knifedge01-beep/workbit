import { useState } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar, Sidebar } from '@design-system'
import { lightTheme } from '@design-system'
import { DEMO_TEAMS } from '../constants'
import { NavbarLeft, NavbarRight } from '../components/NavbarLeft'
import { SidebarNav, SidebarFooter } from '../components/SidebarNav'

function getPageTitle(pathname: string, teamName: string) {
  if (pathname === '/') return 'Dashboard'
  if (pathname === '/inbox') return 'Inbox'
  if (pathname === '/my-issues') return 'My Issues'
  if (pathname.startsWith('/workspace/projects')) return 'Workspace Projects'
  if (pathname.startsWith('/workspace/teams')) return 'Workspace Teams'
  if (pathname.startsWith('/workspace/member')) return 'Workspace Members'
  if (pathname.startsWith('/workspace/views')) return 'Workspace Views'
  if (pathname.startsWith('/workspace/roles')) return 'Workspace Roles'
  if (pathname.includes('/projects')) return `${teamName} Projects`
  if (pathname.includes('/issues')) return `${teamName} Issues`
  if (pathname.includes('/views')) return `${teamName} Views`
  if (pathname.includes('/logs')) return `${teamName} Logs`
  return 'Workbit'
}

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { teamId } = useParams<{ teamId: string }>()
  const location = useLocation()
  const selectedTeam =
    teamId != null
      ? (DEMO_TEAMS.find((t) => t.id === teamId) ?? DEMO_TEAMS[0])
      : DEMO_TEAMS[0]

  const pageTitle = getPageTitle(location.pathname, selectedTeam.name)

  return (
    <StyledThemeProvider theme={lightTheme}>
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar
          variant="light"
          left={<NavbarLeft teams={DEMO_TEAMS} selectedTeam={selectedTeam} />}
          center={<span>{pageTitle}</span>}
          right={<NavbarRight />}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapseToggle={() => setSidebarCollapsed((c) => !c)}
            footer={<SidebarFooter collapsed={sidebarCollapsed} />}
          >
            <SidebarNav
              selectedTeam={selectedTeam}
              collapsed={sidebarCollapsed}
            />
          </Sidebar>

          <main
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  padding: 28,
                  maxWidth: 1280,
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </StyledThemeProvider>
  )
}
