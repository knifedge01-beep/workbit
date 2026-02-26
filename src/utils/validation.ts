/**
 * Validation utilities for forms and user input
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is not empty (after trimming)
 */
export function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  min?: number,
  max?: number
): boolean {
  const len = value.length
  if (min != null && len < min) return false
  if (max != null && len > max) return false
  return true
}

/**
 * Validate required field
 */
export function isRequired(value: string | null | undefined): boolean {
  return value != null && value.trim().length > 0
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateStr)) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

/**
 * Sanitize user input (basic HTML escape)
 */
export function sanitize(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char)
}
