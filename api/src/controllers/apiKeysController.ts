import type { Request, Response } from 'express'
import crypto from 'crypto'
import { supabaseAdmin, isSupabaseConfigured } from '../utils/supabaseServer.js'

const KEY_PREFIX = 'wb_'

function generateSecret(): string {
  return KEY_PREFIX + crypto.randomBytes(32).toString('hex')
}

function generateKeyName(userId: string): string {
  const four = userId.replace(/-/g, '').slice(0, 4)
  const uuid = crypto.randomUUID()
  return `${four}${uuid}`
}

/**
 * POST /api/v1/keys — create a new API key (requires auth).
 * Name is generated automatically if not provided: user_id (first 4 chars) + uuid. Returns the full key once; store it securely.
 */
export async function createKey(req: Request, res: Response) {
  if (!isSupabaseConfigured() || !supabaseAdmin || !req.user) {
    res.status(501).json({ error: 'Auth not configured' })
    return
  }
  const name =
    (req.body?.name as string)?.trim() || generateKeyName(req.user.id)
  const secret = generateSecret()
  const lastFour = secret.slice(-4)

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .insert({
      user_id: req.user.id,
      secret,
      name,
      last_four: lastFour,
    })
    .select('id, name, last_four, created_at')
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json({
    id: data.id,
    key: secret,
    name: data.name,
    last_four: data.last_four,
    created_at: data.created_at,
  })
}

/**
 * GET /api/v1/keys — list API keys for the current user (masked).
 */
export async function listKeys(req: Request, res: Response) {
  if (!isSupabaseConfigured() || !supabaseAdmin || !req.user) {
    res.status(501).json({ error: 'Auth not configured' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, name, last_four, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  const list = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    masked_key: row.last_four ? `••••••••${row.last_four}` : '••••••••',
    created_at: row.created_at,
  }))

  res.json(list)
}

/**
 * DELETE /api/v1/keys/:id — revoke an API key (must own it).
 */
export async function deleteKey(req: Request, res: Response) {
  if (!isSupabaseConfigured() || !supabaseAdmin || !req.user) {
    res.status(501).json({ error: 'Auth not configured' })
    return
  }
  const id = req.params.id
  if (!id) {
    res.status(400).json({ error: 'Key id required' })
    return
  }

  const { error } = await supabaseAdmin
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
}
