import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ChevronDown, Plus } from 'lucide-react'
import { Avatar, Text } from '@design-system'
import type { ApiWorkspace } from '../api/client'

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
`

const Panel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 200px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`

const Item = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  background: ${(p) =>
    p.$selected ? p.theme.colors.surfaceHover : 'transparent'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  text-align: left;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: ${(p) => p.theme.spacing[1]}px 0;
`

const CreateItem = styled(Item)`
  color: ${(p) => p.theme.colors.primary};
  font-weight: 500;
`

const Wrap = styled.div`
  position: relative;
  display: inline-block;
`

type Props = {
  workspaces: ApiWorkspace[]
  selectedWorkspace: ApiWorkspace | null
  onSelect: (ws: ApiWorkspace) => void
}

export function WorkspaceDropdown({
  workspaces,
  selectedWorkspace,
  onSelect,
}: Props) {
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

  const handleSelect = (ws: ApiWorkspace) => {
    onSelect(ws)
    setOpen(false)
    navigate(`/workspace/${ws.id}/inbox`)
  }

  const handleCreateNew = () => {
    setOpen(false)
    navigate('/workspaces')
  }

  const displayWorkspace = selectedWorkspace ?? workspaces[0]

  return (
    <Wrap ref={ref}>
      <Trigger
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select workspace"
      >
        <Avatar
          name={(displayWorkspace?.name ?? 'WS').slice(0, 2).toUpperCase()}
          size={28}
        />
        <Text size="sm" as="span">
          {displayWorkspace?.name ?? 'Workspace'}
        </Text>
        <ChevronDown size={16} style={{ flexShrink: 0 }} />
      </Trigger>
      {open && (
        <Panel>
          {workspaces.map((ws) => (
            <Item
              key={ws.id}
              type="button"
              $selected={ws.id === displayWorkspace?.id}
              onClick={() => handleSelect(ws)}
            >
              <Avatar name={ws.name.slice(0, 2).toUpperCase()} size={20} />
              <span>{ws.name}</span>
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
