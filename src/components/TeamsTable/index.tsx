import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Folder, MoreHorizontal } from 'lucide-react'

import {
  Avatar,
  Menu,
  Flex,
  Heading,
  Text,
  Search,
  IconButton,
} from '@design-system'

import {
  CardGrid,
  TeamActionsWrap,
  TeamCard,
  TeamName,
  MetaRow,
  SearchWrapper,
} from './styles'
import type { TeamTableRow, TeamsTableProps } from './types'
import { filterTeams } from './utils/filterTeams'
import { TEAM_MENU_ITEMS } from './utils/teamMenuItems'

export type { TeamTableRow } from './types'

export function TeamsTable({ workspaceId, teams, className }: TeamsTableProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const filtered = filterTeams(teams, query)

  return (
    <section className={className}>
      <Flex justify="space-between" align="center" gap={3}>
        <Flex align="baseline" gap={2}>
          <Heading level={3} as="h2">
            Teams
          </Heading>
          <Text size="sm" muted as="span">
            {teams.length}
          </Text>
        </Flex>
      </Flex>
      <SearchWrapper>
        <Search
          variant="inline"
          value={query}
          onChange={(value) => setQuery(value)}
          placeholder="Filter teams..."
        />
      </SearchWrapper>
      <CardGrid>
        {filtered.map((team: TeamTableRow, i) => (
          <TeamCard
            key={team.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: i * 0.07 }}
            whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() =>
              navigate(
                `/workspace/${workspaceId}/team/${team.id}/issues/active`
              )
            }
          >
            <Flex justify="space-between" align="center">
              <Avatar name={team.teamName} size={36} />
              <TeamActionsWrap onClick={(e) => e.stopPropagation()}>
                <Menu
                  trigger={
                    <IconButton aria-label="More options">
                      <MoreHorizontal size={14} />
                    </IconButton>
                  }
                  items={TEAM_MENU_ITEMS}
                />
              </TeamActionsWrap>
            </Flex>
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
