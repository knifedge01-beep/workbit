import { getClient } from './client.js'
import { rowToWorkspace } from '../utils/supabaseMappers.js'
import type { Workspace } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getWorkspacesByMemberId(
  memberId: string
): Promise<Workspace[]> {
  // jsonb containment: pass a JSON string so Postgres gets valid json (avoids "invalid input syntax for type json")
  const memberIdsJson = JSON.stringify([memberId])
  const { data, error } = await getClient()
    .from('workspaces')
    .select('*')
    .filter('member_ids', 'cs', memberIdsJson)
  if (error) throw error
  return (data ?? []).map((r) => rowToWorkspace(r as DbRow))
}

export async function getWorkspaceBySlug(
  slug: string
): Promise<Workspace | null> {
  const { data, error } = await getClient()
    .from('workspaces')
    .select('*')
    .ilike('slug', slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToWorkspace(data as DbRow)
}

export async function insertWorkspace(workspace: Workspace): Promise<void> {
  const row = {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    region: workspace.region ?? 'us',
    member_ids: workspace.memberIds ?? [],
  }
  const { error } = await getClient()
    .from('workspaces')
    .insert(row as never)
  if (error) throw error
}
