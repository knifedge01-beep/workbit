import { supabaseAdmin, isSupabaseConfigured } from './supabaseServer.js'

export async function findSupabaseUserByEmail(email: string) {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  })

  if (error) {
    throw error
  }

  const match = data.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )
  return match ?? null
}

export async function createSupabaseUserForMember(email: string) {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: false,
  })

  if (error) {
    throw error
  }

  return data.user
}
