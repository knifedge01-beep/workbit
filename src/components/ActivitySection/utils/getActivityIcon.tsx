import { Box, Diamond } from 'lucide-react'

import type { ActivityIcon } from '../types'

export function getActivityIcon(icon: ActivityIcon, size = 8) {
  if (icon === 'milestone') {
    return <Diamond size={size} />
  }

  return <Box size={size} />
}
