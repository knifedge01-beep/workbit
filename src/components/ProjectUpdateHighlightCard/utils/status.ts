import { STATUS_CONFIG } from '../../../constants/projectStatus'
import type { UpdateItem } from '../../UpdatesTree'
import type { StatusTone } from '../types'

export function getStatusLabel(update: UpdateItem): string {
  return update.status ? STATUS_CONFIG[update.status].label : 'On track'
}

export function getStatusTone(update: UpdateItem): StatusTone {
  return update.status === 'at-risk'
    ? 'warning'
    : update.status === 'off-track'
      ? 'error'
      : 'success'
}

export function getReactionCount(update: UpdateItem): number {
  return Object.values(update.reactions ?? {}).reduce((acc, v) => acc + v, 0)
}
