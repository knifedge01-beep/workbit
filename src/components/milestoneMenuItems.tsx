import type { MenuEntry } from '@design-system'
import {
  Pencil,
  Copy,
  History,
  Diamond,
  Box,
  Trash2,
  ChevronRight,
} from 'lucide-react'

export const MILESTONE_MENU_ITEMS: MenuEntry[] = [
  { id: 'edit', label: 'Edit...', icon: <Pencil size={16} />, onClick: () => {} },
  { id: 'copy', label: 'Copy', icon: <Copy size={16} />, right: <ChevronRight size={14} />, onClick: () => {} },
  { id: 'history', label: 'Show version history', icon: <History size={16} />, onClick: () => {} },
  { type: 'divider' },
  { id: 'move', label: 'Move milestone to', icon: <Diamond size={16} />, right: <ChevronRight size={14} />, onClick: () => {} },
  { id: 'convert', label: 'Convert to project', icon: <Box size={16} />, onClick: () => {} },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, right: <span>⌘⌫</span>, onClick: () => {} },
]
