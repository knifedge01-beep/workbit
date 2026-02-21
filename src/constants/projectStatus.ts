import { Activity, AlertTriangle, TrendingDown } from 'lucide-react'

export type ProjectStatus = 'on-track' | 'at-risk' | 'off-track'

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; Icon: typeof Activity }
> = {
  'on-track': { label: 'On track', color: 'success', Icon: Activity },
  'at-risk': { label: 'At risk', color: 'warning', Icon: AlertTriangle },
  'off-track': { label: 'Off track', color: 'error', Icon: TrendingDown },
}
