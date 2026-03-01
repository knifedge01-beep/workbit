import { getClient } from './client.js'
import { rowToTeam } from '../utils/supabaseMappers.js'
import type { Team } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getTeamById(teamId: string): Promise<Team | null> {
  const { data, error } = await getClient()
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToTeam(data as DbRow)
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await getClient()
    .from('teams')
    .select('*')
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToTeam(r as DbRow))
}

export async function updateTeam(
  teamId: string,
  patch: Partial<Pick<Team, 'projectId' | 'memberIds'>>
): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.projectId !== undefined) row.project_id = patch.projectId
  if (patch.memberIds !== undefined) row.member_ids = patch.memberIds
  if (Object.keys(row).length === 0) return
  const { error } = await getClient()
    .from('teams')
    .update(row as never)
    .eq('id', teamId)
  if (error) throw error
}
