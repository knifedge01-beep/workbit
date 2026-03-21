import { useCallback, useMemo, useState } from 'react'
import {
  CommentThread,
  type CommentItem,
  type CommentSubmitPayload,
} from '@thedatablitz/comment'
import {
  fetchIssueComments,
  postIssueComment,
  type ApiIssueComment,
} from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { logError } from '../../utils'

export type IssueActivityProps = {
  /** Issue id (comments are loaded from `/issues/:id/comments`). */
  entityId: string
}

function mapApiCommentToItem(c: ApiIssueComment): CommentItem {
  return {
    commentId: c.id,
    commentText: c.content,
    commentDate: c.createdAt,
    commentAuthor: c.authorName,
    commentAuthorAvatar: c.authorAvatarSrc ?? '',
    parentCommentId: c.parentCommentId,
    likes: c.likes,
    mentionAuthorIds: c.mentionAuthorIds,
  }
}

export function IssueActivity({ entityId }: IssueActivityProps) {
  const [posting, setPosting] = useState(false)

  const {
    data: rawComments,
    loading,
    error,
    reload,
  } = useFetch(() => fetchIssueComments(entityId), [entityId])

  const comments = useMemo(
    () => (rawComments ?? []).map(mapApiCommentToItem),
    [rawComments]
  )

  const handleSubmitComment = useCallback(
    (payload: CommentSubmitPayload) => {
      const text = payload.commentText.trim()
      if (!text) return
      setPosting(true)
      void postIssueComment(entityId, text, {
        parentCommentId: payload.parentCommentId,
      })
        .then(() => reload())
        .catch((e) => logError(e, 'Post issue comment'))
        .finally(() => setPosting(false))
    },
    [entityId, reload]
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Activity</h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            className="hover:text-foreground transition-colors"
          >
            Subscribe
          </button>
        </div>
      </div>

      <CommentThread
        comments={comments}
        onSubmitComment={handleSubmitComment}
        placeholder="Leave a comment..."
        submitButtonText="Post"
        loading={loading}
        disabled={posting}
        error={Boolean(error)}
        errorMessage={error ?? 'Unable to load comments'}
      />
    </div>
  )
}
