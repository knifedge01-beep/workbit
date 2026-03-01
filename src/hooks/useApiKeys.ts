import { useCallback } from 'react'
import { useFetch } from './useFetch'
import * as api from '../pages/apiKeysApi'

export type ApiKeyListItem = api.ApiKeyListItem
export type CreateKeyResponse = api.CreateKeyResponse

/**
 * List API keys with useFetch; create and delete call API then reload.
 */
export function useApiKeys() {
  const { data: keys, loading, error, reload } = useFetch(api.listApiKeys, [])

  const createKey = useCallback(
    async (name?: string): Promise<api.CreateKeyResponse> => {
      const res = await api.createApiKey(name)
      await reload()
      return res
    },
    [reload]
  )

  const deleteKey = useCallback(
    async (id: string): Promise<void> => {
      await api.deleteApiKey(id)
      await reload()
    },
    [reload]
  )

  return {
    keys: keys ?? [],
    loading,
    error,
    reload,
    createKey,
    deleteKey,
  }
}
