export type ResourceSelectorProps = {
  /** Called when "Choose file" is selected. */
  onChooseFile?: () => void
  /** Called when "Create document" is selected. */
  onCreateDocument?: () => void
  /** Called when "Add a link" is selected. */
  onAddLink?: () => void
  /** Section label. Omit when using custom trigger. */
  label?: string
  /** Trigger button label. Ignored when trigger is provided. */
  triggerLabel?: string
  /** Custom trigger (e.g. icon-only). When set, label is not rendered. */
  trigger?: React.ReactNode
  className?: string
}
