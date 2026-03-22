import type { Request, Response } from 'express'
import * as model from '../models/projectDocuments.js'
import { logApiError } from '../utils/log.js'

export async function listProjectDocuments(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const list = await model.listProjectDocumentsForApi(projectId)
    res.json(list)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocuments.list', {
      projectId: req.params.projectId,
    })
    if (msg === 'Project not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function createProjectDocument(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const { title, content } = req.body as {
      title?: unknown
      content?: unknown
    }
    if (typeof title !== 'string' || typeof content !== 'string') {
      res.status(400).json({ error: 'title and content are required' })
      return
    }
    const doc = await model.createProjectDocumentForApi({
      projectId,
      title,
      content,
      updatedBy: req.user?.email,
    })
    res.status(201).json(doc)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocuments.create', {
      projectId: req.params.projectId,
    })
    if (msg === 'Project not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function getProjectDocument(req: Request, res: Response) {
  try {
    const { projectId, documentId } = req.params
    const doc = await model.getProjectDocumentForApi(projectId, documentId)
    res.json(doc)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocuments.get', {
      projectId: req.params.projectId,
      documentId: req.params.documentId,
    })
    if (msg === 'Project not found' || msg === 'Document not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function patchProjectDocument(req: Request, res: Response) {
  try {
    const { projectId, documentId } = req.params
    const body = req.body as { title?: unknown; content?: unknown }
    if (body.title !== undefined && typeof body.title !== 'string') {
      res.status(400).json({ error: 'title must be a string' })
      return
    }
    if (body.content !== undefined && typeof body.content !== 'string') {
      res.status(400).json({ error: 'content must be a string' })
      return
    }
    const title = body.title === undefined ? undefined : body.title
    const content = body.content === undefined ? undefined : body.content
    if (title === undefined && content === undefined) {
      res
        .status(400)
        .json({ error: 'At least one of title or content is required' })
      return
    }
    const doc = await model.updateProjectDocumentForApi({
      projectId,
      documentId,
      title,
      content,
      updatedBy: req.user?.email,
    })
    res.json(doc)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocuments.patch', {
      projectId: req.params.projectId,
      documentId: req.params.documentId,
    })
    if (msg === 'Project not found' || msg === 'Document not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}
