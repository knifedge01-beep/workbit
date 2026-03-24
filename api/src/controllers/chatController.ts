import type { Request, Response } from 'express'
import { runChatWithMcp } from '../utils/ai/chatMcp.js'
import { logApiError } from '../utils/log.js'

export async function postChat(req: Request, res: Response) {
  const auth = req.workbitUpstreamAuth
  if (!auth) {
    res.status(400).json({
      error:
        'Chat requires Authorization: Bearer (session JWT) or x-api-key on this request.',
    })
    return
  }

  if (!process.env.NVIDIA_API_KEY) {
    res.status(503).json({
      error: 'Chat is not configured (NVIDIA_API_KEY is not set).',
    })
    return
  }

  const body = req.body as { message?: unknown }
  if (typeof body.message !== 'string' || !body.message.trim()) {
    res
      .status(400)
      .json({ error: 'Body must include a non-empty string "message".' })
    return
  }

  try {
    const reply = await runChatWithMcp(auth, body.message)
    res.json({ reply })
  } catch (err) {
    logApiError(err, 'chat.postChat')
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Chat failed.',
    })
  }
}
