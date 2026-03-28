import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Box } from '@thedatablitz/box'
import { Card, CardContent } from '@thedatablitz/card'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { TextInput } from '@thedatablitz/text-input'
import { getSupabase, isAuthConfigured } from './supabaseClient'
import { useAuth } from './AuthContext'
import { Alert } from '@thedatablitz/alert'
import { Button } from '@thedatablitz/button'

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

  async function handleSignIn() {
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
    <Box
      fullWidth
      align="center"
      justify="center"
      className="min-h-screen bg-slate-50 px-4 py-10"
    >
      <Card variant="default" fullWidth style={{ maxWidth: '420px' }}>
        <CardContent>
          <Stack gap="200">
            <Text as="h1" variant="heading3">
              Sign in
            </Text>
            <Stack gap="150" fullWidth>
              <Stack gap="050" fullWidth>
                <label htmlFor="login-email">
                  <Text as="span" variant="body3">
                    Email
                  </Text>
                </label>
                <TextInput
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  fullWidth
                />
              </Stack>
              <Stack gap="050" fullWidth>
                <label htmlFor="login-password">
                  <Text as="span" variant="body3">
                    Password
                  </Text>
                </label>
                <TextInput
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  fullWidth
                />
              </Stack>
              {error ? (
                <Alert
                  variant="error"
                  placement="inline"
                  description={error}
                  className="w-full"
                />
              ) : null}
              <Button
                variant="primary"
                disabled={loading}
                loading={loading}
                onClick={handleSignIn}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
            <Text as="p" variant="body3" color="color.text.subtle">
              Don&apos;t have an account? <Link to="/signup">Create one</Link>
            </Text>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
