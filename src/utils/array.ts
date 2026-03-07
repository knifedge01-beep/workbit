/**
 * Array utilities for common data operations
 */

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
