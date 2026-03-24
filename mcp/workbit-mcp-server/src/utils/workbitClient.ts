import { WORKBIT_API_BASE_URL, WORKBIT_API_KEY_HEADER } from '../constants.js'

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const bearer = process.env.WORKBIT_BEARER_TOKEN
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`
    return headers
  }
  const apiKey = process.env.WORKBIT_API_KEY
  if (apiKey) {
    headers[WORKBIT_API_KEY_HEADER] = apiKey
  }
  return headers
}

export async function makeWorkbitRequest<T>(path: string): Promise<T> {
  const url = `${WORKBIT_API_BASE_URL}${path}`
  const response = await fetch(url, { headers: getHeaders() })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(
      `Workbit API request failed: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ''
      }`
    )
  }

  return (await response.json()) as T
}

export async function makeWorkbitPostRequest<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const url = `${WORKBIT_API_BASE_URL}${path}`
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      `Workbit API request failed: ${response.status} ${response.statusText}${
        text ? ` - ${text}` : ''
      }`
    )
  }
  return (await response.json()) as T
}

export async function makeWorkbitPatchRequest<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const url = `${WORKBIT_API_BASE_URL}${path}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      `Workbit API request failed: ${response.status} ${response.statusText}${
        text ? ` - ${text}` : ''
      }`
    )
  }
  return (await response.json()) as T
}
