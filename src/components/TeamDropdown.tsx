import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { Avatar, Text } from '@design-system'
import type { Team } from '../constants'

const TeamTrigger = styled.button`
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
  min-width: 160px;
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
  background: ${(p) => (p.$selected ? p.theme.colors.surfaceHover : 'transparent')};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  text-align: left;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const Wrap = styled.div`
  position: relative;
  display: inline-block;
`

type Props = {
  teams: Team[]
  selectedTeam: Team
}

export function TeamDropdown({ teams, selectedTeam }: Props) {
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
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select team"
      >
        <Avatar name={selectedTeam.id.slice(0, 2).toUpperCase()} size={28} />
        <Text size="sm" as="span">{selectedTeam.name}</Text>
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
                navigate(`/team/${team.id}`)
                setOpen(false)
              }}
            >
              <Avatar name={team.id.slice(0, 2).toUpperCase()} size={20} />
              <span>{team.name}</span>
            </Item>
          ))}
        </Panel>
      )}
    </Wrap>
  )
}
