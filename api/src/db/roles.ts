import { getClient } from './client.js'
import { rowToRole } from '../utils/supabaseMappers.js'
import type { Role } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getRoles(): Promise<Role[]> {
  const { data, error } = await getClient()
    .from('roles')
    .select('*')
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToRole(r as DbRow))
}
