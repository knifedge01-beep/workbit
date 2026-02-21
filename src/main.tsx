import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { RelayEnvironmentProvider } from 'react-relay'
import { ThemeProvider } from '@design-system'
import { AuthProvider } from './pages/auth/AuthContext'
import { relayEnvironment } from './relay/Environment'
import App from './App'
import '@design-system/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RelayEnvironmentProvider environment={relayEnvironment}>
            <App />
          </RelayEnvironmentProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
