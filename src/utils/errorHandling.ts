/**
 * Error handling utilities for API calls and general error management
 */

/**
 * Extract a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}

/**
 * Log error to console in development, could be extended to send to error tracking service
 */
export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error)
  const prefix = context ? `[${context}]` : ''
  console.error(`${prefix} Error:`, message, error)
}

/**
 * Handle async errors with optional callback
 */
export async function handleAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    if (onError) {
      onError(error)
    } else {
      logError(error)
    }
    return null
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}
