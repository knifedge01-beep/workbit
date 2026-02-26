/**
 * Array utilities for common data operations
 */

/**
 * Group array items by a key
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Remove duplicates by a key
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>()
  return array.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Sort array by a key
 */
export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Count occurrences of items
 */
export function countBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, number> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item)
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

/**
 * Check if array is empty or null/undefined
 */
export function isEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0
}

/**
 * Get first item or null
 */
export function first<T>(array: T[]): T | null {
  return array.length > 0 ? array[0] : null
}

/**
 * Get last item or null
 */
export function last<T>(array: T[]): T | null {
  return array.length > 0 ? array[array.length - 1] : null
}
