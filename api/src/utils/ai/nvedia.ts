import { logApiWarn } from '../log.js'

const invokeUrl = 'https://integrate.api.nvidia.com/v1/chat/completions'

const NVIDIA_DEBUG_BODY_PREVIEW_CHARS = 14_000

function outlineMessagesForNvidiaDebug(messages: unknown): Array<{
  role?: string
  contentLen: number
  preview: string
  toolCallsCount?: number
}> {
  if (!Array.isArray(messages)) {
    return []
  }
  return messages.map((raw) => {
    if (typeof raw !== 'object' || raw === null) {
      return { contentLen: 0, preview: '(non-object message)' }
    }
    const m = raw as Record<string, unknown>
    const c = m.content
    const s = typeof c === 'string' ? c : c == null ? '' : JSON.stringify(c)
    return {
      role: typeof m.role === 'string' ? m.role : undefined,
      contentLen: s.length,
      preview: s.slice(0, 280),
      toolCallsCount: Array.isArray(m.tool_calls)
        ? m.tool_calls.length
        : undefined,
    }
  })
}

function logNvidiaCompletionFailureDebug(input: {
  status: number
  nvidiaError: string
  body: Record<string, unknown>
}): void {
  const { status, nvidiaError, body } = input
  const shouldLog =
    status >= 500 || /prompt template|apply prompt|template/i.test(nvidiaError)
  if (!shouldLog) {
    return
  }
  let serialized = ''
  try {
    serialized = JSON.stringify(body)
  } catch {
    serialized = '[JSON.stringify(body) failed]'
  }
  logApiWarn('[nvidiaOpenAiChatCompletion] request failed (debug payload)', {
    nvidiaStatus: status,
    nvidiaError,
    model: body.model,
    toolChoice: body.tool_choice,
    toolsCount: Array.isArray(body.tools) ? body.tools.length : 0,
    messagesOutline: outlineMessagesForNvidiaDebug(body.messages),
    requestBodyLength: serialized.length,
    requestBodyPreview: serialized.slice(0, NVIDIA_DEBUG_BODY_PREVIEW_CHARS),
    requestBodyTruncated: serialized.length > NVIDIA_DEBUG_BODY_PREVIEW_CHARS,
  })
}

export type NvidiaChatCompletionResponse = {
  choices?: Array<{
    message?: {
      role?: string
      content?: string | null
      tool_calls?: Array<{
        id: string
        type?: string
        function: { name: string; arguments: string }
      }>
    }
  }>
  error?: { message?: string }
}

export type NvidiaChatOptions = {
  stream?: boolean
  userContent?: string
}

/**
 * Calls NVIDIA NIM chat completions (OpenAI-compatible).
 * Set `NVIDIA_API_KEY` (Bearer token from build.nvidia.com).
 */
export async function invokeNvidiaChat(
  options: NvidiaChatOptions = {}
): Promise<unknown | void> {
  const stream = options.stream ?? true
  const apiKey = getNvidiaApiKey()

  const payload = {
    model: getChatModel(),
    messages: [{ role: 'user' as const, content: options.userContent ?? '' }],
    max_tokens: 512,
    temperature: 0.2,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream,
  }

  const res = await fetch(invokeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: stream ? 'text/event-stream' : 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`NVIDIA API ${res.status}: ${text || res.statusText}`)
  }

  if (stream) {
    const reader = res.body?.getReader()
    if (!reader) {
      throw new Error('Streaming response has no body')
    }
    const decoder = new TextDecoder()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
       
      console.log(decoder.decode(value, { stream: true }))
    }
    return
  }

  return res.json()
}

function getNvidiaApiKey(): string {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY is not set')
  }
  return apiKey
}

/**
 * Default must support tool calling on integrate.api.nvidia.com (MCP chat sends `tools` + `tool_choice`).
 * Gemma and other models without NIM tool support return 400: "auto" tool choice requires enable-auto-tool-choice.
 * @see https://docs.nvidia.com/nim/large-language-models/latest/function-calling.html
 */
function getChatModel(): string {
  return process.env.NVIDIA_CHAT_MODEL ?? 'nvidia/nemotron-3-super-120b-a12b'
}

function normalizeToolCallsForNvidia(toolCalls: unknown[]): unknown[] {
  return toolCalls.map((tc) => {
    if (typeof tc !== 'object' || tc === null) {
      return tc
    }
    const t = tc as Record<string, unknown>
    const fn = t.function
    if (typeof fn !== 'object' || fn === null) {
      return tc
    }
    const f = fn as Record<string, unknown>
    let args = f.arguments
    if (args != null && typeof args !== 'string') {
      args = JSON.stringify(args)
    }
    const argStr = typeof args === 'string' ? args : '{}'
    return {
      id: String(t.id ?? ''),
      type: 'function',
      function: {
        name: String(f.name ?? ''),
        arguments: sanitizeNvidiaToolOrArgsString(argStr),
      },
    }
  })
}

/**
 * Rich JSON Schema from Zod ($ref, allOf, etc.) can break NVIDIA/vLLM Jinja chat templates.
 * Keep names + descriptions; use a minimal object schema so the template can render.
 */
/** If these appear in text that gets embedded in Jinja, rendering can throw. */
function neutralizeJinjaDelimiters(s: string): string {
  return s.replace(/\{\{/g, '{ {').replace(/\{%/g, '{ %').replace(/%\}/g, '% }')
}

/**
 * Hosted stacks sometimes embed message text in XML/HTML-ish layers without proper
 * escaping. `&` breaks entity parsing; `<` / `>` can start tags. Fullwidth
 * substitutes keep meaning for the model but avoid those parsers.
 */
function sanitizeHostedMarkupSensitiveChars(s: string): string {
  return s
    .replace(/&/g, '\uFF06')
    .replace(/</g, '\uFF1C')
    .replace(/>/g, '\uFF1E')
}

/** User/system/assistant visible text sent to NVIDIA. */
function sanitizeNvidiaPlainTextMessageContent(s: string): string {
  return sanitizeHostedMarkupSensitiveChars(neutralizeJinjaDelimiters(s))
}

/**
 * Tool results (often JSON) and function.arguments must be sanitized too: the next
 * request embeds them in the same template path. `& < >` inside JSON string values
 * are safe to replace; JSON syntax uses `{}[]:",` not angle brackets.
 */
function sanitizeNvidiaToolOrArgsString(s: string): string {
  return sanitizeHostedMarkupSensitiveChars(neutralizeJinjaDelimiters(s))
}

/**
 * Logs show NVIDIA Llama Jinja failing when assistant sends tool_calls with junk
 * visible content (e.g. a lone ";"). Strip punctuation/symbol-only fragments.
 */
export function coerceAssistantContentBesideToolCalls(
  content: string | null | undefined
): string {
  const raw =
    content == null
      ? ''
      : typeof content === 'string'
        ? content
        : String(content)
  const t = raw.trim()
  if (t.length === 0) {
    return ''
  }
  if (
    !/[\n\r]/.test(t) &&
    t.length <= 32 &&
    /^[\p{P}\p{S}\p{Z}\s]+$/u.test(t)
  ) {
    return ''
  }
  return raw
}

function prepareToolsForNvidiaRequest(tools: unknown[]): unknown[] {
  return tools.map((raw) => {
    if (typeof raw !== 'object' || raw === null) {
      return raw
    }
    const o = raw as Record<string, unknown>
    if (o.type !== 'function') {
      return raw
    }
    const fn = o.function
    if (typeof fn !== 'object' || fn === null) {
      return raw
    }
    const f = fn as Record<string, unknown>
    const name = sanitizeNvidiaPlainTextMessageContent(
      typeof f.name === 'string' ? f.name : String(f.name ?? '')
    )
    const descRaw = f.description
    const description =
      typeof descRaw === 'string'
        ? sanitizeNvidiaPlainTextMessageContent(
            descRaw.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
          )
        : ''
    return {
      type: 'function',
      function: {
        name,
        ...(description ? { description: description.slice(0, 4096) } : {}),
        // Only `type` — empty properties + additionalProperties has tripped strict vLLM/Jinja paths.
        parameters: { type: 'object' },
      },
    }
  })
}

/**
 * NVIDIA/vLLM Llama tool chat templates often fail when the first turn is
 * system + user + tools. Folding system into the opening user message avoids that path.
 */
function foldLeadingSystemIntoUser(messages: unknown[]): unknown[] {
  if (messages.length < 2) {
    return messages
  }
  const m0 = messages[0]
  const m1 = messages[1]
  if (
    typeof m0 !== 'object' ||
    m0 === null ||
    typeof m1 !== 'object' ||
    m1 === null
  ) {
    return messages
  }
  const a = m0 as Record<string, unknown>
  const b = m1 as Record<string, unknown>
  if (a.role !== 'system' || b.role !== 'user') {
    return messages
  }
  const sys =
    a.content == null
      ? ''
      : typeof a.content === 'string'
        ? a.content
        : String(a.content)
  const usr =
    b.content == null
      ? ''
      : typeof b.content === 'string'
        ? b.content
        : String(b.content)
  return [
    {
      role: 'user',
      content: sanitizeNvidiaPlainTextMessageContent(`${sys}\n\n---\n\n${usr}`),
    },
    ...messages.slice(2),
  ]
}

/**
 * Llama / vLLM chat templates on NVIDIA often throw "Failed to apply prompt template" when:
 * - assistant has tool_calls but content is null (use empty string)
 * - tool_calls[].function.arguments is an object instead of a JSON string
 * - tool role has extra fields (e.g. name) or non-string content
 * - messages carry unknown keys
 */
function normalizeMessagesForNvidiaChat(messages: unknown[]): unknown[] {
  return messages.map((raw) => {
    if (typeof raw !== 'object' || raw === null) {
      return raw
    }
    const m = raw as Record<string, unknown>
    const role = m.role

    if (role === 'system') {
      const c = m.content
      const content = sanitizeNvidiaPlainTextMessageContent(
        c == null ? '' : typeof c === 'string' ? c : String(c)
      )
      return { role: 'system', content }
    }

    if (role === 'user') {
      const c = m.content
      const content = sanitizeNvidiaPlainTextMessageContent(
        c == null ? '' : typeof c === 'string' ? c : String(c)
      )
      return { role: 'user', content }
    }

    if (role === 'assistant') {
      if (Array.isArray(m.tool_calls) && m.tool_calls.length > 0) {
        const c = m.content
        const coerced = coerceAssistantContentBesideToolCalls(
          c == null ? '' : typeof c === 'string' ? c : String(c)
        )
        const content = sanitizeNvidiaPlainTextMessageContent(coerced)
        return {
          role: 'assistant',
          content,
          tool_calls: normalizeToolCallsForNvidia(m.tool_calls),
        }
      }
      const c = m.content
      const content = sanitizeNvidiaPlainTextMessageContent(
        c == null ? '' : typeof c === 'string' ? c : String(c)
      )
      return { role: 'assistant', content }
    }

    if (role === 'tool') {
      const c = m.content
      const raw = c == null ? '' : typeof c === 'string' ? c : JSON.stringify(c)
      const content = sanitizeNvidiaToolOrArgsString(raw)
      const tool_call_id =
        typeof m.tool_call_id === 'string'
          ? m.tool_call_id
          : String(m.tool_call_id ?? '')
      return { role: 'tool', tool_call_id, content }
    }

    return m
  })
}

/**
 * Non-streaming OpenAI-compatible chat completion (for tool loops).
 */
export async function nvidiaOpenAiChatCompletion(input: {
  messages: unknown[]
  tools?: unknown[]
  tool_choice?: unknown
  max_tokens?: number
}): Promise<NvidiaChatCompletionResponse> {
  const apiKey = getNvidiaApiKey()
  const model = getChatModel()
  const messagesForRequest =
    input.tools?.length && input.messages.length > 0
      ? foldLeadingSystemIntoUser(input.messages)
      : input.messages

  const body: Record<string, unknown> = {
    model,
    messages: normalizeMessagesForNvidiaChat(messagesForRequest),
    max_tokens: input.max_tokens ?? 2048,
    temperature: 0.2,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
  }
  if (input.tools?.length) {
    body.tools = prepareToolsForNvidiaRequest(input.tools)
    body.tool_choice = input.tool_choice ?? 'auto'
  }

  const res = await fetch(invokeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = (await res
    .json()
    .catch(() => ({}))) as NvidiaChatCompletionResponse
  if (!res.ok) {
    const msg =
      data.error?.message ||
      (typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message?: string }).message)
        : res.statusText)
    logNvidiaCompletionFailureDebug({
      status: res.status,
      nvidiaError: msg,
      body,
    })
    throw new Error(`NVIDIA API ${res.status}: ${msg}`)
  }
  return data
}
