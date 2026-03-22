import * as db from '../db/projectDocumentation.js'
import { getProjectById } from '../db/projects.js'

export type ProjectDocumentationApi = {
  projectId: string
  content: string
  updatedAt: string | null
  updatedBy: string | null
}

function toApi(doc: {
  projectId: string
  content: string
  updatedAt?: string
  updatedBy?: string
}): ProjectDocumentationApi {
  return {
    projectId: doc.projectId,
    content: doc.content,
    updatedAt: doc.updatedAt ?? null,
    updatedBy: doc.updatedBy ?? null,
  }
}

export async function getProjectDocumentationForApi(
  projectId: string
): Promise<ProjectDocumentationApi> {
  const project = await getProjectById(projectId)
  if (!project) throw new Error('Project not found')
  const doc = await db.getProjectDocumentation(projectId)
  if (!doc) {
    return {
      projectId,
      content: '',
      updatedAt: null,
      updatedBy: null,
    }
  }
  return toApi(doc)
}

export async function updateProjectDocumentationForApi(input: {
  projectId: string
  content: string
  updatedBy?: string
}): Promise<ProjectDocumentationApi> {
  const project = await getProjectById(input.projectId)
  if (!project) throw new Error('Project not found')
  const updated = await db.upsertProjectDocumentation({
    projectId: input.projectId,
    content: input.content,
    updatedAt: new Date().toISOString(),
    updatedBy: input.updatedBy,
  })
  return toApi(updated)
}
