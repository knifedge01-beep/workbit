import { init as initLogbit } from '@thedatablitz/logbit-sdk'
import { tokensCss } from '@thedatablitz/tokens'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@design-system'
import { AuthProvider } from './pages/auth/AuthContext'
import { WorkspaceProvider } from './contexts/WorkspaceContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import '@design-system/styles/global.css'

/** Required by @thedatablitz/text-editor injected theme (`var(--ds-…)`). */
const TOKENS_STYLE_ID = 'db-design-bit-tokens'
if (
  typeof document !== 'undefined' &&
  !document.getElementById(TOKENS_STYLE_ID)
) {
  const el = document.createElement('style')
  el.id = TOKENS_STYLE_ID
  el.textContent = tokensCss
  document.head.prepend(el)
}

initLogbit({
  service: 'workbit-web',
  env: import.meta.env.MODE ?? 'development',
  release: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
  ...(import.meta.env.VITE_LOGBIT_API_BASE_URL && {
    apiBaseUrl: import.meta.env.VITE_LOGBIT_API_BASE_URL,
  }),
  ...(import.meta.env.VITE_LOGBIT_ENDPOINT && {
    endpoint: import.meta.env.VITE_LOGBIT_ENDPOINT,
  }),
  ...(import.meta.env.VITE_WORK_BIT_API_KEY && {
    workbit: { apiKey: import.meta.env.VITE_WORK_BIT_API_KEY },
  }),
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WorkspaceProvider>
              <App />
            </WorkspaceProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
