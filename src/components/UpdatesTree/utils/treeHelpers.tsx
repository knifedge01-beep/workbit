import { Flame, Smile, ThumbsUp, Zap } from 'lucide-react'

import { STATUS_CONFIG } from '../../../constants/projectStatus'
import type { UpdateItem } from '../types'

export const QUICK_EMOJIS = ['thumbs-up', 'fire', 'zap', 'smile'] as const

export const EMOJI_ICON = {
  'thumbs-up': <ThumbsUp size={13} />,
  fire: <Flame size={13} />,
  zap: <Zap size={13} />,
  smile: <Smile size={13} />,
}

export const EMOJI_LABEL = {
  'thumbs-up': 'Like',
  fire: 'Fire',
  zap: 'Zap',
  smile: 'Smile',
}

export function firstLine(input: string): string {
  return (input ?? '').split('\n')[0] || ''
}

export function countAllComments(item: UpdateItem): number {
  const direct = item.comments?.length ?? 0
  if (!item.comments || item.comments.length === 0) return direct
  return direct + item.comments.reduce((acc, c) => acc + countAllComments(c), 0)
}

export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function filterRecursive(
  item: UpdateItem,
  term: string
): UpdateItem | null {
  if (term.trim() === '') return item
  const q = term.trim().toLowerCase()
  const hit =
    item.content.toLowerCase().includes(q) ||
    item.author.toLowerCase().includes(q) ||
    item.timestamp.toLowerCase().includes(q) ||
    (item.status
      ? STATUS_CONFIG[item.status].label.toLowerCase().includes(q)
      : false)

  const filteredChildren = (item.comments ?? [])
    .map((child) => filterRecursive(child, q))
    .filter((child): child is UpdateItem => child != null)

  if (hit || filteredChildren.length > 0) {
    return { ...item, comments: filteredChildren }
  }
  return null
}
