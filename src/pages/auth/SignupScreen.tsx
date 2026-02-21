import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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

const Message = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.primary ?? '#0a0'};
`

export function SignupScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAllowed } = useAuth()

  if (!isAuthConfigured) {
    return <Navigate to="/" replace />
  }

  if (isAllowed) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    const supabase = getSupabase()
    if (!supabase) {
      setError('Auth not configured')
      setLoading(false)
      return
    }
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: displayName ? { data: { full_name: displayName } } : undefined,
    })
    setLoading(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }
    setMessage('Check your email to confirm your account, then sign in.')
  }

  return (
    <Wrapper>
      <Card>
        <Title>Create account</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="signup-email">Email</label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field>
            <label htmlFor="signup-password">Password</label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </Field>
          <Field>
            <label htmlFor="signup-name">Display name (optional)</label>
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </Field>
          {error && <Error>{error}</Error>}
          {message && <Message>{message}</Message>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
          </Button>
        </Form>
        <p style={{ marginTop: 16, fontSize: '0.875rem', color: 'var(--color-textMuted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </Card>
    </Wrapper>
  )
}
