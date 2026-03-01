import { getClient } from './client.js'
import { rowToProjectProperties } from '../utils/supabaseMappers.js'
import type { ProjectProperties } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

const DEFAULT: ProjectProperties = {
  status: 'planned',
  priority: 'high',
  teamIds: [],
  labelIds: [],
}

export async function getProjectPropertiesByTeamId(
  teamId: string
): Promise<ProjectProperties> {
  const { data, error } = await getClient()
    .from('project_properties')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle()
  if (error) throw error
  if (!data) return DEFAULT
  return rowToProjectProperties(data as DbRow)
}

export async function upsertProjectProperties(
  teamId: string,
  props: ProjectProperties
): Promise<void> {
  const row = {
    team_id: teamId,
    status: props.status,
    priority: props.priority,
    lead_id: props.leadId ?? null,
    start_date: props.startDate ?? null,
    end_date: props.endDate ?? null,
    team_ids: props.teamIds ?? [],
    label_ids: props.labelIds ?? [],
  }
  const { error } = await getClient()
    .from('project_properties')
    .upsert(row as never, { onConflict: 'team_id' })
  if (error) throw error
}
