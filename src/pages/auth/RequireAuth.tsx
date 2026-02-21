import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

type Props = { children: React.ReactNode }

/**
 * When auth is configured: redirects to /login if not authenticated.
 * When auth is not configured: renders children (no login required).
 */
export function RequireAuth({ children }: Props) {
  const { isAllowed, state } = useAuth()
  const location = useLocation()

  if (state.status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span>Loading…</span>
      </div>
    )
  }

  if (!isAllowed) {
    const returnTo = (location.state as { returnTo?: string })?.returnTo ?? location.pathname + location.search
    return <Navigate to="/login" state={{ returnTo }} replace />
  }

  return <>{children}</>
}
