import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

import { Avatar } from '@thedatablitz/avatar'
import { Text } from '@thedatablitz/text'
import { Item, Panel, TeamTrigger, Wrap } from './styles'
import type { TeamDropdownProps } from './types'
import { getTeamInitials } from './utils/getTeamInitials'

export function TeamDropdown({
  workspaceId,
  teams,
  selectedTeam,
}: TeamDropdownProps) {
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

  return (
    <Wrap ref={ref}>
      <TeamTrigger
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select team"
      >
        <Avatar name={getTeamInitials(selectedTeam.id)} size="small" />
        <Text variant="body3" as="span">
          {selectedTeam.name}
        </Text>
        <ChevronDown size={16} style={{ flexShrink: 0 }} />
      </TeamTrigger>
      {open && (
        <Panel>
          {teams.map((team) => (
            <Item
              key={team.id}
              type="button"
              $selected={team.id === selectedTeam.id}
              onClick={() => {
                navigate(`/workspace/${workspaceId}/team/${team.id}`)
                setOpen(false)
              }}
            >
              <Avatar name={getTeamInitials(team.id)} size="small" />
              <Text variant="body3" as="span">
                {team.name}
              </Text>
            </Item>
          ))}
        </Panel>
      )}
    </Wrap>
  )
}
