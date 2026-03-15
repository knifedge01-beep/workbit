import { getClient } from './client.js'
import type { IssueComment } from '../models/types.js'
import type { DbRow } from '../utils/supabaseMappers.js'

function rowToIssueComment(r: DbRow): IssueComment {
  return {
    id: r.id as string,
    issueId: r.issue_id as string,
    authorName: r.author_name as string,
    authorAvatarSrc: r.author_avatar_src as string | undefined,
    content: r.content as string,
    createdAt: r.created_at as string,
  }
}

export async function getIssueCommentsByIssueId(
  issueId: string
): Promise<IssueComment[]> {
  const { data, error } = await getClient()
    .from('issue_comments')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => rowToIssueComment(r as DbRow))
}

export async function insertIssueComment(comment: IssueComment): Promise<void> {
  const row = {
    id: comment.id,
    issue_id: comment.issueId,
    author_name: comment.authorName,
    author_avatar_src: comment.authorAvatarSrc ?? null,
    content: comment.content,
    created_at: comment.createdAt,
  }
  const { error } = await getClient()
    .from('issue_comments')
    .insert(row as never)
  if (error) throw error
}
