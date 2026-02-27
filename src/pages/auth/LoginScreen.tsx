import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Button, Input } from '@design-system'
import styled from 'styled-components'
import { getSupabase, isAuthConfigured } from './supabaseClient'
import { useAuth } from './AuthContext'

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.backgroundSubtle};
`

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 32px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${(p) => p.theme.colors.text};
  }
`

const Error = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.error ?? '#dc2626'};
`

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAllowed } = useAuth()

  const state = location.state as {
    returnTo?: string
    from?: { pathname: string; search: string }
  } | null
  const returnTo =
    state?.returnTo ??
    (state?.from ? state.from.pathname + state.from.search : '/workspaces')
  const cameFromProtectedRoute = Boolean(state?.from || state?.returnTo)

  if (!isAuthConfigured) {
    return <Navigate to="/" replace />
  }

  // Only auto-redirect away from /login when the user is already
  // authenticated *and* they arrived here via an AuthGate redirect.
  // This prevents a loop where manually visiting /login immediately
  // sends you back to the workspace.
  if (isAllowed && cameFromProtectedRoute) {
    return <Navigate to={returnTo} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = getSupabase()
    if (!supabase) {
      setError('Auth not configured')
      setLoading(false)
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate(returnTo, { replace: true })
  }

  return (
    <Wrapper>
      <Card>
        <Title>Sign in</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="login-email">Email</label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field>
            <label htmlFor="login-password">Password</label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Form>
      </Card>
    </Wrapper>
  )
}
