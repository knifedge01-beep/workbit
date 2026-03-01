import { getClient } from './client.js'
import { rowToMilestone } from '../utils/supabaseMappers.js'
import type { Milestone } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getMilestonesByTeamId(
  teamId: string
): Promise<Milestone[]> {
  const { data, error } = await getClient()
    .from('milestones')
    .select('*')
    .eq('team_id', teamId)
    .order('id')
  if (error) throw error
  return (data ?? []).map((r) => rowToMilestone(r as DbRow))
}

export async function insertMilestone(milestone: Milestone): Promise<void> {
  const row = {
    id: milestone.id,
    team_id: milestone.teamId,
    name: milestone.name,
    progress: milestone.progress ?? 0,
    total: milestone.total ?? 0,
    target_date: milestone.targetDate ?? '',
    description: milestone.description ?? null,
  }
  const { error } = await getClient()
    .from('milestones')
    .insert(row as never)
  if (error) throw error
}

export async function updateMilestone(
  milestoneId: string,
  patch: Partial<
    Pick<
      Milestone,
      'name' | 'targetDate' | 'description' | 'progress' | 'total'
    >
  >
): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.name !== undefined) row.name = patch.name
  if (patch.targetDate !== undefined) row.target_date = patch.targetDate
  if (patch.description !== undefined) row.description = patch.description
  if (patch.progress !== undefined) row.progress = patch.progress
  if (patch.total !== undefined) row.total = patch.total
  if (Object.keys(row).length === 0) return
  const { error } = await getClient()
    .from('milestones')
    .update(row as never)
    .eq('id', milestoneId)
  if (error) throw error
}
