import type { Request, Response } from 'express';
import { supabaseAuth, isSupabaseAuthConfigured } from '../utils/supabaseServer.js';

export async function login(req: Request, res: Response) {
  if (!isSupabaseAuthConfigured() || !supabaseAuth) {
    res.status(501).json({ error: 'Auth not configured' });
    return;
  }

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

  if (error) {
    res.status(401).json({ error: error.message });
    return;
  }

  if (!data.session || !data.user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}
