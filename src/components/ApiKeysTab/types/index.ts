import type { ApiKeyListItem } from '../../../hooks/useApiKeys'

export type KeyRow = ApiKeyListItem & {
  revoking?: boolean
}

export type BadgeColor = 'blue' | 'grey' | 'green' | 'red' | 'orange'
