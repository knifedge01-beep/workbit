import { getClient } from './client.js'
import { rowToStatusUpdateComment } from '../utils/supabaseMappers.js'
import type { StatusUpdateComment } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

export async function getStatusUpdateCommentsByUpdateId(
  updateId: string
): Promise<StatusUpdateComment[]> {
  const { data, error } = await getClient()
    .from('status_update_comments')
    .select('*')
    .eq('update_id', updateId)
    .order('timestamp')
  if (error) throw error
  return (data ?? []).map((r) => rowToStatusUpdateComment(r as DbRow))
}

export async function insertStatusUpdateComment(
  comment: StatusUpdateComment
): Promise<void> {
  const row = {
    id: comment.id,
    update_id: comment.updateId,
    author_name: comment.authorName,
    author_avatar_src: comment.authorAvatarSrc ?? null,
    content: comment.content,
    timestamp: comment.timestamp,
  }
  const { error } = await getClient()
    .from('status_update_comments')
    .insert(row as never)
  if (error) throw error
}
