import { init, logbit } from '@thedatablitz/logbit-sdk'

export const LOGBIT_PROJECT_ID = 'be4bc17d-3776-4b6c-b1cd-b9a473f10f77'

let initialized = false

export function initLogging(): void {
  if (initialized) return
  initialized = true

  init({
    service: 'workbit-mcp',
    env: process.env.NODE_ENV ?? 'development',
    release: process.env.APP_VERSION ?? '0.0.1',
    ...(process.env.LOGBIT_API_BASE_URL && {
      apiBaseUrl: process.env.LOGBIT_API_BASE_URL,
    }),
    ...(process.env.LOGBIT_ENDPOINT && {
      endpoint: process.env.LOGBIT_ENDPOINT,
    }),
    ...(process.env.WORKBIT_API_KEY && {
      workbit: { apiKey: process.env.WORKBIT_API_KEY },
    }),
  })
}

export function logMcpError(
  err: unknown,
  context: string,
  meta?: Record<string, unknown>
): void {
  const message =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Unknown error'

  const payload: Record<string, unknown> = {
    projectId: LOGBIT_PROJECT_ID,
    title: `[${context}] ${message}`,
    context,
    error: message,
    ...meta,
  }

  if (err instanceof Error && err.stack) {
    payload.stack = err.stack
  }

  logbit.error(`[${context}] ${message}`, payload)
}
