import { getClient } from './client.js'
import {
  rowToProjectDocument,
  rowToProjectDocumentSummary,
} from '../utils/supabaseMappers.js'
import type {
  ProjectDocument,
  ProjectDocumentSummary,
} from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function listProjectDocuments(
  projectId: string
): Promise<ProjectDocumentSummary[]> {
  const { data, error } = await getClient()
    .from('project_documents')
    .select('id, project_id, title, updated_at, updated_by')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data as DbRow[]).map(rowToProjectDocumentSummary)
}

export async function getProjectDocument(
  projectId: string,
  documentId: string
): Promise<ProjectDocument | null> {
  const { data, error } = await getClient()
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId)
    .eq('id', documentId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToProjectDocument(data as DbRow)
}

export async function insertProjectDocument(input: {
  projectId: string
  title: string
  content: string
  updatedBy?: string
}): Promise<ProjectDocument> {
  const { data, error } = await getClient()
    .from('project_documents')
    .insert({
      project_id: input.projectId,
      title: input.title,
      content: input.content,
      updated_by: input.updatedBy ?? null,
    } as never)
    .select('*')
    .single()
  if (error) throw error
  return rowToProjectDocument(data as DbRow)
}

export async function updateProjectDocument(input: {
  projectId: string
  documentId: string
  title?: string
  content?: string
  updatedBy?: string
}): Promise<ProjectDocument | null> {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (input.title !== undefined) patch.title = input.title
  if (input.content !== undefined) patch.content = input.content
  if (input.updatedBy !== undefined) patch.updated_by = input.updatedBy

  const { data, error } = await getClient()
    .from('project_documents')
    .update(patch as never)
    .eq('project_id', input.projectId)
    .eq('id', input.documentId)
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToProjectDocument(data as DbRow)
}
