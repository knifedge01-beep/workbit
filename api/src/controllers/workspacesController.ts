import type { Request, Response } from 'express'
import * as workspacesModel from '../models/workspaces.js'

function sendError(res: Response, err: unknown, status = 500) {
  res
    .status(status)
    .json({ error: err instanceof Error ? err.message : String(err) })
}

export async function getWorkspaces(req: Request, res: Response) {
  try {
    const memberId = (req.query.memberId as string | undefined) ?? undefined

    if (!memberId) {
      sendError(res, 'memberId is required', 400)
      return
    }

    const workspaces = await workspacesModel.getWorkspacesByMemberId(memberId)

    res.json(
      workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        region: w.region,
      }))
    )
  } catch (e) {
    sendError(res, e)
  }
}

export async function createWorkspace(req: Request, res: Response) {
  try {
    const { name, slug, region, memberId } = req.body as {
      name?: string
      slug?: string
      region?: string
      memberId?: string
    }

    if (!name || typeof name !== 'string') {
      sendError(res, 'name is required', 400)
      return
    }

    if (!slug || typeof slug !== 'string') {
      sendError(res, 'slug is required', 400)
      return
    }

    if (!memberId || typeof memberId !== 'string') {
      sendError(res, 'memberId is required', 400)
      return
    }

    try {
      const workspace = await workspacesModel.createWorkspace({
        name,
        slug,
        region,
        memberId,
      })

      res.status(201).json({
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        region: workspace.region,
      })
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'WORKSPACE_SLUG_TAKEN') {
        sendError(res, e.message, 409)
        return
      }
      throw e
    }
  } catch (e) {
    sendError(res, e)
  }
}
