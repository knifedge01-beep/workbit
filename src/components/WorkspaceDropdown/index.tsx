import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Plus } from 'lucide-react'

import { Avatar, Text } from '@design-system'

import { CreateItem, Divider, Item, Panel, Trigger, Wrap } from './styles'
import type { WorkspaceDropdownProps } from './types'
import { getDisplayWorkspace, getWorkspaceInitials } from './utils/helpers'

export function WorkspaceDropdown({
  workspaces,
  selectedWorkspace,
  onSelect,
}: WorkspaceDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const handleSelect = (workspace: (typeof workspaces)[number]) => {
    onSelect(workspace)
    setOpen(false)
    navigate(`/workspace/${workspace.id}/inbox`)
  }

  const handleCreateNew = () => {
    setOpen(false)
    navigate('/workspaces')
  }

  const displayWorkspace = getDisplayWorkspace(selectedWorkspace, workspaces)

  return (
    <Wrap ref={ref}>
      <Trigger
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select workspace"
      >
        <Avatar name={getWorkspaceInitials(displayWorkspace?.name)} size={28} />
        <Text size="sm" as="span">
          {displayWorkspace?.name ?? 'Workspace'}
        </Text>
        <ChevronDown size={16} style={{ flexShrink: 0 }} />
      </Trigger>
      {open && (
        <Panel>
          {workspaces.map((workspace) => (
            <Item
              key={workspace.id}
              type="button"
              $selected={workspace.id === displayWorkspace?.id}
              onClick={() => handleSelect(workspace)}
            >
              <Avatar name={getWorkspaceInitials(workspace.name)} size={20} />
              <span>{workspace.name}</span>
            </Item>
          ))}
          {workspaces.length > 0 && <Divider />}
          <CreateItem type="button" onClick={handleCreateNew} $selected={false}>
            <Plus size={18} />
            <span>Create new workspace</span>
          </CreateItem>
        </Panel>
      )}
    </Wrap>
  )
}
