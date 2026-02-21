import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../utils/supabaseServer.js';

export interface AuthUser {
  id: string;
  email: string | undefined;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const BEARER_PREFIX = 'Bearer ';

/**
 * Optional auth: if Supabase is configured and a valid Bearer token is sent,
 * sets req.user. Otherwise req.user stays undefined (callers can use a default user id).
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    next();
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    next();
    return;
  }
  const token = authHeader.slice(BEARER_PREFIX.length);
  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      req.user = { id: user.id, email: user.email };
    }
  } catch {
    // Invalid token; leave req.user undefined
  }
  next();
}

/**
 * Requires a valid Supabase session. Responds 401 if not configured or no valid token.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isSupabaseConfigured()) {
    res.status(501).json({ error: 'Auth not configured' });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

export function getUserId(req: Request, defaultId: string): string {
  return req.user?.id ?? defaultId;
}

/**
 * When Supabase is configured, require auth (401 if no valid session).
 * When not configured, pass through so existing x-user-id/default user still works.
 * Skips auth requirement for /auth/* routes (e.g. login).
 */
export function requireAuthWhenConfigured(req: Request, res: Response, next: NextFunction): void {
  if (!isSupabaseConfigured()) {
    next();
    return;
  }
  const apiPrefix = process.env.API_PREFIX ?? '/api/v1';
  if (req.path.startsWith(`${apiPrefix}/auth`)) {
    next();
    return;
  }
  requireAuth(req, res, next);
}
