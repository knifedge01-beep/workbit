import { getClient } from './client.js'
import { rowToView } from '../utils/supabaseMappers.js'
import type { View } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getViews(): Promise<View[]> {
  const { data, error } = await getClient()
    .from('views')
    .select('*')
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToView(r as DbRow))
}

export async function getViewsWithoutTeamId(): Promise<View[]> {
  const { data, error } = await getClient()
    .from('views')
    .select('*')
    .is('team_id', null)
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToView(r as DbRow))
}

export async function getViewsByTeamId(teamId: string): Promise<View[]> {
  const { data, error } = await getClient()
    .from('views')
    .select('*')
    .eq('team_id', teamId)
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToView(r as DbRow))
}
