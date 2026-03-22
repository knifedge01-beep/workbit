import { getClient } from './client.js'
import {
  projectDocumentationToRow,
  rowToProjectDocumentation,
} from '../utils/supabaseMappers.js'
import type { ProjectDocumentation } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getProjectDocumentation(
  projectId: string
): Promise<ProjectDocumentation | null> {
  const { data, error } = await getClient()
    .from('project_documentation')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToProjectDocumentation(data as DbRow)
}

export async function upsertProjectDocumentation(
  doc: ProjectDocumentation
): Promise<ProjectDocumentation> {
  const { data, error } = await getClient()
    .from('project_documentation')
    .upsert(projectDocumentationToRow(doc) as never, {
      onConflict: 'project_id',
    })
    .select('*')
    .single()
  if (error) throw error
  return rowToProjectDocumentation(data as DbRow)
}
