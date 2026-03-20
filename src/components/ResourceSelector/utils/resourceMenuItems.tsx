import type { MenuEntry } from '@design-system'
import { Upload, FileText, Link } from 'lucide-react'

export const RESOURCE_MENU_ITEMS: MenuEntry[] = [
  {
    id: 'choose-file',
    label: 'Choose file',
    icon: <Upload size={16} />,
    onClick: () => {},
  },
  {
    id: 'create-document',
    label: 'Create document...',
    icon: <FileText size={16} />,
    onClick: () => {},
  },
  {
    id: 'add-link',
    label: 'Add a link...',
    icon: <Link size={16} />,
    right: <span>Ctrl L</span>,
    onClick: () => {},
  },
]
