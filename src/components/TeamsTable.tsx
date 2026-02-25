import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  Folder,
  MoreHorizontal,
  Eye,
  Settings,
  Pencil,
} from 'lucide-react'
import { Avatar, Menu } from '@design-system'
import type { MenuEntry } from '@design-system'

export type TeamTableRow = {
  id: string
  teamName: string
  members: string
  project: string
}

const TEAM_MENU_ITEMS: MenuEntry[] = [
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

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  margin-bottom: ${(p) => p.theme.spacing[3]}px;
`

const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  margin-bottom: ${(p) => p.theme.spacing[3]}px;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  flex: 1;
  max-width: 260px;
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    width: 100%;
    &::placeholder {
      color: ${(p) => p.theme.colors.textMuted};
    }
  }
  svg {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${(p) => p.theme.spacing[4]}px;
`

const TeamActionsWrap = styled.div`
  opacity: 0;
  transition: opacity 0.15s;
`

const TeamCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[4]}px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    ${TeamActionsWrap} {
      opacity: 1;
    }
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TeamName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin-top: ${(p) => p.theme.spacing[1]}px;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  svg {
    flex-shrink: 0;
  }
`

const ActionsBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${(p) => p.theme.colors.textMuted};
  transition: background 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
`

type Props = {
  teams: TeamTableRow[]
  className?: string
}

export function TeamsTable({ teams, className }: Props) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const filtered = query
    ? teams.filter((t) =>
        t.teamName.toLowerCase().includes(query.toLowerCase())
      )
    : teams

  return (
    <section className={className}>
      <SectionHeader>
        <TitleBlock>
          <Title>Teams</Title>
          <Count>{teams.length}</Count>
        </TitleBlock>
      </SectionHeader>
      <Toolbar>
        <SearchBox>
          <Search size={13} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter teams..."
          />
        </SearchBox>
      </Toolbar>
      <CardGrid>
        {filtered.map((team, i) => (
          <TeamCard
            key={team.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: i * 0.07 }}
            whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/team/${team.id}/issues/active`)}
          >
            <CardTop>
              <Avatar name={team.teamName} size={36} />
              <TeamActionsWrap onClick={(e) => e.stopPropagation()}>
                <Menu
                  trigger={
                    <ActionsBtn aria-label="More options">
                      <MoreHorizontal size={14} />
                    </ActionsBtn>
                  }
                  items={TEAM_MENU_ITEMS}
                />
              </TeamActionsWrap>
            </CardTop>
            <TeamName>{team.teamName}</TeamName>
            <MetaRow>
              <Users size={12} />
              <span>{team.members} members</span>
            </MetaRow>
            {team.project && (
              <MetaRow>
                <Folder size={12} />
                <span>{team.project}</span>
              </MetaRow>
            )}
          </TeamCard>
        ))}
      </CardGrid>
    </section>
  )
}
