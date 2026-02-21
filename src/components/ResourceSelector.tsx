import styled from 'styled-components'
import { Button, Menu } from '@design-system'
import type { MenuEntry } from '@design-system'
import { Plus, Upload, FileText, Link } from 'lucide-react'

const RESOURCE_MENU_ITEMS: MenuEntry[] = [
  { id: 'choose-file', label: 'Choose file', icon: <Upload size={16} />, onClick: () => {} },
  { id: 'create-document', label: 'Create document...', icon: <FileText size={16} />, onClick: () => {} },
  { id: 'add-link', label: 'Add a link...', icon: <Link size={16} />, right: <span>Ctrl L</span>, onClick: () => {} },
]

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.textMuted};
`

type Props = {
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

export function ResourceSelector({
  onChooseFile,
  onCreateDocument,
  onAddLink,
  label = 'Resources',
  triggerLabel = 'Add document or link...',
  trigger,
  className,
}: Props) {
  const handleAction = (id: string) => {
    if (id === 'choose-file') onChooseFile?.()
    else if (id === 'create-document') onCreateDocument?.()
    else if (id === 'add-link') onAddLink?.()
  }

  const items: MenuEntry[] = RESOURCE_MENU_ITEMS.map((entry) =>
    'type' in entry ? entry : { ...entry, onClick: () => handleAction(entry.id) }
  )

  const menuTrigger =
    trigger ?? (
      <Button variant="ghost" size="sm">
        <Plus size={16} style={{ flexShrink: 0 }} />
        {triggerLabel}
      </Button>
    )

  if (trigger != null) {
    return <Menu trigger={menuTrigger} items={items} className={className} />
  }

  return (
    <Section className={className}>
      {label ? <Label>{label}</Label> : null}
      <Menu trigger={menuTrigger} items={items} />
    </Section>
  )
}
