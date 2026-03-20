import type { RegionOption } from '../types'

export const REGION_OPTIONS: RegionOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
]

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function workspaceInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
