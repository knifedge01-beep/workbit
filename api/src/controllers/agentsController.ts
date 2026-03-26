import type { Request, Response } from 'express'
import { logApiError } from '../utils/log.js'
import {
  runProjectAgent,
  type AgentRunMode,
} from '../utils/ai/projectAgentMcp.js'

function parseMode(raw: unknown): AgentRunMode {
  if (raw === 'auto') {
    return 'auto'
  }
  if (raw === 'planner_worker') {
    return 'planner_worker'
  }
  return 'single'
}

export async function postAgentRun(req: Request, res: Response) {
  const auth = req.workbitUpstreamAuth
  if (!auth) {
    res.status(400).json({
      error:
        'Agents require Authorization: Bearer (session JWT) or x-api-key on this request.',
    })
    return
  }

  if (!process.env.NVIDIA_API_KEY) {
    res.status(503).json({
      error: 'Agents are not configured (NVIDIA_API_KEY is not set).',
    })
    return
  }

  const body = req.body as {
    projectId?: unknown
    instructions?: unknown
    maxRounds?: unknown
    mode?: unknown
  }

  if (typeof body.projectId !== 'string' || !body.projectId.trim()) {
    res
      .status(400)
      .json({ error: 'Body must include a non-empty string "projectId".' })
    return
  }

  let maxRounds: number | undefined
  if (body.maxRounds !== undefined && body.maxRounds !== null) {
    if (
      typeof body.maxRounds !== 'number' ||
      !Number.isFinite(body.maxRounds)
    ) {
      res
        .status(400)
        .json({ error: '"maxRounds" must be a finite number when provided.' })
      return
    }
    if (body.maxRounds < 1 || body.maxRounds > 200) {
      res.status(400).json({ error: '"maxRounds" must be between 1 and 200.' })
      return
    }
    maxRounds = Math.floor(body.maxRounds)
  }

  const instructions =
    typeof body.instructions === 'string' ? body.instructions : undefined
  const mode = body.mode === undefined ? 'auto' : parseMode(body.mode)

  try {
    const result = await runProjectAgent(auth, {
      projectId: body.projectId.trim(),
      instructions,
      maxRounds,
      mode,
    })
    res.json({
      summary: result.summary,
      finishedReason: result.finishedReason,
      mode: result.mode,
      ...(result.plan !== undefined ? { plan: result.plan } : {}),
    })
  } catch (err) {
    logApiError(err, 'agents.postAgentRun', { projectId: body.projectId, mode })
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Agent run failed.',
    })
  }
}
