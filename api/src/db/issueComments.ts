import { getClient } from './client.js'
import type { IssueComment } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

const DEFAULT_COMMENT_OPTIONS = {
  hideReplies: false,
  hideLikes: false,
} as const

function parseCommentOptions(raw: unknown): {
  hideReplies: boolean
  hideLikes: boolean
} {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_COMMENT_OPTIONS }
  const o = raw as Record<string, unknown>
  return {
    hideReplies: Boolean(o.hideReplies),
    hideLikes: Boolean(o.hideLikes),
  }
}

function rowToIssueComment(r: DbRow): IssueComment {
  const createdRaw = r.comment_date
  const createdAt =
    typeof createdRaw === 'string'
      ? createdRaw
      : createdRaw instanceof Date
        ? createdRaw.toISOString()
        : new Date().toISOString()

  return {
    id: r.id as string,
    entityId: (r.entity_id as string) ?? '',
    authorName: r.comment_author as string,
    authorAvatarSrc: (r.comment_author_avatar as string) || undefined,
    content: r.comment_text as string,
    createdAt,
    parentCommentId: (r.parent_comment_id as string) ?? null,
    likes: Number(r.likes ?? 0),
    mentionAuthorIds: Array.isArray(r.mention_author_ids)
      ? (r.mention_author_ids as string[])
      : [],
    commentOptions: parseCommentOptions(r.comment_options),
  }
}

export async function getIssueCommentsByIssueId(
  issueId: string
): Promise<IssueComment[]> {
  const { data, error } = await getClient()
    .from('comments')
    .select('*')
    .eq('entity_id', issueId)
    .order('comment_date', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => rowToIssueComment(r as DbRow))
}

export async function getIssueCommentById(
  commentId: string
): Promise<IssueComment | null> {
  const { data, error } = await getClient()
    .from('comments')
    .select('*')
    .eq('id', commentId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return rowToIssueComment(data as DbRow)
}

export async function insertIssueComment(comment: IssueComment): Promise<void> {
  const row = {
    id: comment.id,
    entity_id: comment.entityId,
    comment_text: comment.content,
    comment_date: comment.createdAt,
    comment_author: comment.authorName,
    comment_author_avatar: comment.authorAvatarSrc ?? null,
    parent_comment_id: comment.parentCommentId,
    likes: comment.likes,
    mention_author_ids: comment.mentionAuthorIds,
    comment_options: comment.commentOptions,
  }
  const { error } = await getClient()
    .from('comments')
    .insert(row as never)
  if (error) throw error
}
