import type { Request, Response } from 'express'
import * as model from '../models/projectDocumentation.js'
import { logApiError } from '../utils/log.js'

export async function getProjectDocumentation(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const doc = await model.getProjectDocumentationForApi(projectId)
    res.json(doc)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocumentation.get', {
      projectId: req.params.projectId,
    })
    if (msg === 'Project not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}

export async function patchProjectDocumentation(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const { content } = req.body as { content?: string }
    if (typeof content !== 'string') {
      res.status(400).json({ error: 'content is required' })
      return
    }
    const doc = await model.updateProjectDocumentationForApi({
      projectId,
      content,
      updatedBy: req.user?.email,
    })
    res.json(doc)
  } catch (e) {
    const msg = (e as Error).message
    logApiError(e, 'projectDocumentation.patch', {
      projectId: req.params.projectId,
    })
    if (msg === 'Project not found') {
      res.status(404).json({ error: msg })
      return
    }
    res.status(500).json({ error: msg })
  }
}
