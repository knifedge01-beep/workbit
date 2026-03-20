export type PriorityOption = {
  id: string
  label: string
  icon: React.ReactNode
}

export type PrioritySelectorProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: PriorityOption[]
  /** When true, trigger shows only the priority icon (for use in issue cards). */
  triggerVariant?: 'default' | 'icon'
  className?: string
  triggerClassName?: string
}
