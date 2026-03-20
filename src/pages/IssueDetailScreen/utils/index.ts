import { logError } from '../../../utils'

export const issueDetailHandlers = {
  handleAddSubIssue: (subIssueTitle: string) => {
    const title = subIssueTitle.trim()
    if (!title) return null
    return {
      id: `${Date.now()}-${Math.random()}`,
      title,
      completed: false,
    }
  },

  createCommentPayload: (comment: string) => {
    const trimmed = comment.trim()
    if (!trimmed) return null
    return trimmed
  },
}

export const handleDescriptionError = (e: unknown, context: string) => {
  logError(e, `Description update (${context})`)
}
