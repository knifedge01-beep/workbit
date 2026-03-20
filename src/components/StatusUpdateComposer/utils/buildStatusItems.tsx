import type { MenuEntry } from '@design-system'

import {
  STATUS_CONFIG,
  type ProjectStatus,
} from '../../../constants/projectStatus'

export function buildStatusItems(
  setStatus: (status: ProjectStatus) => void
): MenuEntry[] {
  return (['on-track', 'at-risk', 'off-track'] as const).map((key) => {
    const config = STATUS_CONFIG[key]
    const Icon = config.Icon

    return {
      id: key,
      label: config.label,
      icon: (
        <Icon
          size={16}
          style={{ color: `var(--status-${key})` } as React.CSSProperties}
        />
      ),
      onClick: () => setStatus(key),
    }
  })
}
