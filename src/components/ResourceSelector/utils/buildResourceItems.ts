import type { MenuEntry } from '@design-system'

export function buildResourceItems(
  baseItems: MenuEntry[],
  handleAction: (id: string) => void
): MenuEntry[] {
  return baseItems.map((entry) =>
    'type' in entry
      ? entry
      : { ...entry, onClick: () => handleAction(entry.id) }
  )
}
