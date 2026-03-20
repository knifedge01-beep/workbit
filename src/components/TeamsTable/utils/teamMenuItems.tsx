import { Eye, Folder, Settings, Pencil } from 'lucide-react'

import type { MenuEntry } from '@design-system'

export const TEAM_MENU_ITEMS: MenuEntry[] = [
  {
    id: 'view-issues',
    label: 'View issues',
    icon: <Eye size={16} />,
    onClick: () => {},
  },
  {
    id: 'view-projects',
    label: 'View projects',
    icon: <Folder size={16} />,
    onClick: () => {},
  },
  { type: 'divider' },
  {
    id: 'settings',
    label: 'Team settings',
    icon: <Settings size={16} />,
    onClick: () => {},
  },
  {
    id: 'rename',
    label: 'Rename team',
    icon: <Pencil size={16} />,
    onClick: () => {},
  },
]
