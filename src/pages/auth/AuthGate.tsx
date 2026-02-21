import { Navigate, useLocation } from 'react-router-dom'
import { useAuthRequired } from './AuthContext'

type Props = { children: React.ReactNode }

/**
 * When Supabase auth is enabled, redirects to /login if the user is not signed in.
 * When Supabase is not configured, renders children as usual.
 */
export function AuthGate({ children }: Props) {
  const { loading, mustSignIn } = useAuthRequired()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading…
      </div>
    )
  }

  if (mustSignIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
