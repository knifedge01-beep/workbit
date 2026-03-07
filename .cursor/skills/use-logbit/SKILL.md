---
name: use-logbit
description: Use Logbit for all error handling and logging. Use when handling errors, adding try/catch, reporting failures, implementing retries, adding observability, or when the user mentions Logbit, error logging, or error handling.
---

# Use Logbit for Error Handling and Logging

When adding or changing error handling, logging, or retries, use Logbit. Do not rely on `console.log`/`console.error` for production observability. Prefer the project's helpers so events include `projectId` and `title` and go to the ingest API (and Workbit when configured).

## Rules

1. **Init is already done**  
   Logbit is initialized at app startup: **frontend** in `src/main.tsx`, **API** in `api/src/index.ts`, **seed** in `api/src/scripts/seed.ts`. Do not call `init()` again in feature code.

2. **Frontend: use error-handling utils**  
   For errors in the web app, use `src/utils/errorHandling.ts`:
   - **`logError(error, context?)`** – Logs an error to Logbit with `projectId`, `title`, `context`, and stack/raw. Use in catch blocks or error callbacks.
   - **`getErrorMessage(error)`** – Normalizes `unknown` to a string message.
   - **`handleAsync(fn, onError?)`** – Runs an async function; on failure calls `onError` or `logError`. Returns `T | null`.
   - **`retryWithBackoff(fn, maxRetries?, baseDelay?)`** – Retries an async function with exponential backoff; logs retry failures via Logbit.

   ```ts
   import { logError, getErrorMessage, handleAsync, retryWithBackoff } from '@/utils/errorHandling'
   // or src/utils/errorHandling
   ```

3. **API: use log utils**  
   For errors and warnings in the API, use `api/src/utils/log.ts`:
   - **`logApiError(err, context, meta?)`** – Logs with `projectId`, `title`, `context`, stack, and optional `meta`.
   - **`logApiWarn(message, payload?)`** – Logs a warning with `projectId` and `title`.

   ```ts
   import { logApiError, logApiWarn } from '../utils/log'
   ```

4. **Direct Logbit calls**  
   If you need `logbit` directly (e.g. info/debug, or outside existing helpers), import from `@thedatablitz/logbit-sdk` and **always include in the payload**: `projectId` (use `LOGBIT_PROJECT_ID` from `src/utils/errorHandling.ts` or `api/src/utils/log.ts`) and `title` (short event description). This keeps events tied to the project and searchable.

5. **Levels**  
   - **Errors** – `logbit.error()` or `logError` / `logApiError`. Use for failures and exceptions; can create Workbit issues when Workbit is configured.
   - **Warnings** – `logbit.warn()` or `logApiWarn`. Use for degraded behavior, retries, validation issues.
   - **Info/Debug** – `logbit.info()`, `logbit.debug()` for events and diagnostics. Include `projectId` and `title` in payload.

6. **Spans and metrics**  
   For timing or counters, use `logbit.startSpan(name, options?)` and `logbit.metric.counter(name, value?, attributes?)`. See the SDK doc for details.

## Quick reference

- **SDK doc:** [.cursor/docs/LOGBIT_SDK.md](../../docs/LOGBIT_SDK.md) – init, config, Workbit, flush, full API.
- **Frontend helpers:** `src/utils/errorHandling.ts` – `LOGBIT_PROJECT_ID`, `logError`, `getErrorMessage`, `handleAsync`, `retryWithBackoff`.
- **API helpers:** `api/src/utils/log.ts` – `LOGBIT_PROJECT_ID`, `logApiError`, `logApiWarn`.

## Examples

**Frontend – catch and log:**
```ts
try {
  await submitForm()
} catch (error) {
  logError(error, 'SubmitForm')
  toast.error(getErrorMessage(error))
}
```

**Frontend – async with fallback:**
```ts
const data = await handleAsync(() => fetchSomething())
if (!data) return // error already logged
```

**Frontend – retry:**
```ts
const result = await retryWithBackoff(() => api.post('/sync'), 3, 1000)
```

**API – route error:**
```ts
try {
  await doWork()
} catch (err) {
  logApiError(err, 'doWork', { userId: req.user?.id })
  return res.status(500).json({ error: 'Internal error' })
}
```

**Direct logbit (when helpers don’t fit):**
```ts
import { logbit } from '@thedatablitz/logbit-sdk'
import { LOGBIT_PROJECT_ID } from '@/utils/errorHandling'

logbit.error('Payment failed', {
  projectId: LOGBIT_PROJECT_ID,
  title: 'Payment failed',
  orderId,
  code: err.code,
})
```

When adding new error paths or logging, prefer the helpers above; use direct `logbit` only when necessary and always include `projectId` and `title` in the payload.
