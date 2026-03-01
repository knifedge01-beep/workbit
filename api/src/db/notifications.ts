import { getClient } from './client.js'
import { rowToNotification } from '../utils/supabaseMappers.js'
import type { Notification } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getNotifications(
  _userId: string,
  first = 50
): Promise<Notification[]> {
  const { data, error } = await getClient()
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(first)
  if (error) throw error
  return (data ?? []).map((r) => rowToNotification(r as DbRow))
}
