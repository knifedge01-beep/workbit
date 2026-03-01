import { supabaseAdmin, isSupabaseConfigured } from '../utils/supabaseServer.js'

export function getClient() {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for DB operations.'
    )
  }
  return supabaseAdmin
}
