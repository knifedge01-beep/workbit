import type { ApiKeyListItem } from '../../../hooks/useApiKeys'

import type { BadgeColor, KeyRow } from '../types'

export function maskForPreview(rawKey: string, visible = 4): string {
  if (rawKey.length <= visible * 2) return rawKey
  return `${rawKey.slice(0, visible)}${'*'.repeat(12)}${rawKey.slice(-visible)}`
}

export function badgeColorForEnvironment(
  environment?: string | null
): BadgeColor {
  const value = (environment ?? '').toLowerCase()
  if (value.includes('prod')) return 'red'
  if (value.includes('stag')) return 'orange'
  if (value.includes('dev') || value.includes('test')) return 'green'
  return 'blue'
}

export function copyLabel(
  copiedToken: string | null,
  token: string,
  fallback: string
): string {
  return copiedToken === token ? 'Copied' : fallback
}

export function toKeyRows(
  keys: ApiKeyListItem[],
  revokingId: string | null
): KeyRow[] {
  return [...keys]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .map((k) => ({
      ...k,
      revoking: revokingId === k.id,
    }))
}

export function filterKeyRows(rows: KeyRow[], query: string): KeyRow[] {
  const term = query.trim().toLowerCase()
  if (!term) return rows
  return rows.filter((row) => {
    const name = (row.name ?? '').toLowerCase()
    return (
      name.includes(term) ||
      row.masked_key.toLowerCase().includes(term) ||
      row.id.toLowerCase().includes(term)
    )
  })
}
