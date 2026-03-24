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

/** GET /api/v1/projects/:projectId/status-updates */
export async function getProjectStatusUpdates(req: Request, res: Response) {
  try {
    const { projectId } = req.params
    const payload =
      await workspaceModel.getProjectStatusUpdatesForApi(projectId)
    if (!payload) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json(payload)
  } catch (e) {
    logApiError(e, 'projects.getProjectStatusUpdates', {
      projectId: req.params.projectId,
    })
    res.status(500).json({ error: (e as Error).message })
  }
}
