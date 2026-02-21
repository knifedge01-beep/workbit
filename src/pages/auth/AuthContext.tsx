import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, isAuthConfigured } from './supabaseClient';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; session: Session };

type AuthContextValue = {
  state: AuthState;
  signOut: () => Promise<void>;
  /** When auth is not configured, we treat the app as "allowed" (no login required). */
  isAllowed: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    isAuthConfigured ? { status: 'loading' } : { status: 'unauthenticated' }
  );

  useEffect(() => {
    if (!isAuthConfigured) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const setSession = (session: Session | null) => {
      setState(session ? { status: 'authenticated', session } : { status: 'unauthenticated' });
    };

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setState({ status: 'unauthenticated' });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAllowed =
      !isAuthConfigured || state.status === 'authenticated';
    return { state, signOut, isAllowed };
  }, [state, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** When Supabase auth is enabled, use for AuthGate: mustSignIn means redirect to login. */
export function useAuthRequired(): {
  user: { id: string; email?: string } | null;
  loading: boolean;
  mustSignIn: boolean;
} {
  const ctx = useAuth();
  const loading = ctx.state.status === 'loading';
  const user =
    ctx.state.status === 'authenticated'
      ? { id: ctx.state.session.user.id, email: ctx.state.session.user.email }
      : null;
  const mustSignIn = isAuthConfigured && !loading && !user;
  return { user, loading, mustSignIn };
}
