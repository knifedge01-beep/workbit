import { Dropdown } from '@thedatablitz/dropdown'

import type { StatusSelectorProps } from './types'
import { STATUS_OPTIONS } from './utils/statusOptions'

export type { StatusOption } from './types'
export { STATUS_OPTIONS } from './utils/statusOptions'

export function StatusSelector({
  value,
  onChange,
  placeholder = 'Change status...',
  options = STATUS_OPTIONS,
  triggerVariant,
  className,
  triggerClassName,
}: StatusSelectorProps) {
  const dropdownOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.label,
    icon: opt.icon,
  }))

  const mergedClassName = [className, triggerClassName]
    .filter(Boolean)
    .join(' ')

  void triggerVariant

  return (
    <Dropdown
      options={dropdownOptions}
      value={value}
      placeholder={placeholder}
      size="medium"
      className={mergedClassName || undefined}
      onChange={(nextValue) => {
        if (typeof nextValue === 'string') {
          onChange?.(nextValue)
        }
      }}
    />
  )
}
