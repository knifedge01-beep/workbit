export type StatusOption = {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: number
}

export type StatusSelectorProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: StatusOption[]
  /** When true, trigger shows only the status icon (for use in issue cards). */
  triggerVariant?: 'default' | 'icon'
  className?: string
  triggerClassName?: string
}
