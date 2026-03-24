import type { Request, Response } from 'express'
import * as workspaceModel from '../models/workspace.js'
import { logApiError } from '../utils/log.js'

/** GET /api/v1/projects/:projectId */
export async function getProject(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const project = await workspaceModel.getProjectByIdForApi(projectId)
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json(project)
  } catch (e) {
    logApiError(e, 'projects.getProject', { projectId: req.params.projectId })
    res.status(500).json({ error: (e as Error).message })
  }
}
