import { Plus } from 'lucide-react'

import { Button, Menu } from '@design-system'

import { Label, Section } from './styles'
import type { ResourceSelectorProps } from './types'
import { buildResourceItems } from './utils/buildResourceItems'
import { RESOURCE_MENU_ITEMS } from './utils/resourceMenuItems'

export function ResourceSelector({
  onChooseFile,
  onCreateDocument,
  onAddLink,
  label = 'Resources',
  triggerLabel = 'Add document or link...',
  trigger,
  className,
}: ResourceSelectorProps) {
  const handleAction = (id: string) => {
    if (id === 'choose-file') onChooseFile?.()
    else if (id === 'create-document') onCreateDocument?.()
    else if (id === 'add-link') onAddLink?.()
  }

  const items = buildResourceItems(RESOURCE_MENU_ITEMS, handleAction)

  const menuTrigger = trigger ?? (
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
