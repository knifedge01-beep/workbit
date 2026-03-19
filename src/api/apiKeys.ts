import { authFetch } from './client'

export type ApiKeyListItem = {
  id: string
  name: string | null
  masked_key: string
  created_at: string
  last_used_at?: string | null
  permissions?: string[] | null
  environment?: string | null
}

export type CreateKeyResponse = {
  id: string
  key: string
  name: string | null
  last_four: string
  created_at: string
}

export async function listApiKeys(): Promise<ApiKeyListItem[]> {
  return authFetch('/keys') as Promise<ApiKeyListItem[]>
}

export async function createApiKey(name?: string): Promise<CreateKeyResponse> {
  return authFetch('/keys', {
    method: 'POST',
    body: JSON.stringify(name != null ? { name } : {}),
  }) as Promise<CreateKeyResponse>
}

export async function deleteApiKey(id: string): Promise<void> {
  await authFetch(`/keys/${id}`, { method: 'DELETE' })
}
