import { STATUS_CONFIG } from '../../../constants/projectStatus'

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export function buildStatusItems(): DropdownOption[] {
  return (['on-track', 'at-risk', 'off-track'] as const).map((key) => {
    const config = STATUS_CONFIG[key]
    const Icon = config.Icon

    return {
      value: key,
      label: config.label,
      icon: (
        <Icon
          size={16}
          style={{ color: `var(--status-${key})` } as React.CSSProperties}
        />
      ),
    }
  })
}
