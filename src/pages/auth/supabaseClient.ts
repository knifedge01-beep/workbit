import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (isAuthConfigured) {
  console.log('✓ Supabase auth configured')
} else {
  console.warn(
    '✗ Supabase auth NOT configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

let client: SupabaseClient | null = null

if (isAuthConfigured) {
  client = createClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabase(): SupabaseClient | null {
  return client
}

/**
 * Returns the current session's access token for API/GraphQL requests.
 * Resolves to null when Supabase is not configured or user is not signed in.
 */
export async function getAccessToken(): Promise<string | null> {
  if (!client) return null
  const {
    data: { session },
  } = await client.auth.getSession()
  return session?.access_token ?? null
}
