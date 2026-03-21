import { Dropdown } from '@thedatablitz/dropdown'

import type { PriorityOption, PrioritySelectorProps } from './types'
import { DEFAULT_PRIORITIES } from './utils/defaultPriorities'

export type { PriorityOption } from './types'

export function PrioritySelector({
  value,
  onChange,
  placeholder = 'Priority',
  options = DEFAULT_PRIORITIES,
  triggerVariant,
}: PrioritySelectorProps) {
  const dropdownOptions = options.map((opt: PriorityOption) => ({
    value: opt.id,
    label: opt.label,
    icon: opt.icon,
  }))

  void triggerVariant

  return (
    <Dropdown
      options={dropdownOptions}
      value={value}
      placeholder={placeholder}
      size="medium"
      onChange={(nextValue) => {
        if (typeof nextValue === 'string') {
          onChange?.(nextValue)
        }
      }}
    />
  )
}
