import { logError } from '../../../utils'

export const issueDetailHandlers = {
  createCommentPayload: (comment: string) => {
    const trimmed = comment.trim()
    if (!trimmed) return null
    return trimmed
  },
}

export const handleDescriptionError = (e: unknown, context: string) => {
  logError(e, `Description update (${context})`)
}
