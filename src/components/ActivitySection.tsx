import { useState } from 'react'
import styled from 'styled-components'
import { Text, Stack, Flex } from '@design-system'
import { ChevronDown, Diamond, Box } from 'lucide-react'
import { SectionHeader, CollapsibleContent } from './CollapsibleSection'

const SeeAllLink = styled.button`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`

const ActivityRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  font-size: 0.875rem;
  .activity-icon {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
    margin-top: 2px;
  }
`

export type ActivityItem = {
  id: string
  icon: 'milestone' | 'project'
  message: string
  date: string
}

type Props = {
  items?: ActivityItem[]
  defaultOpen?: boolean
  /** When true, render only the content (no header). Use when embedding in Tree. */
  contentOnly?: boolean
}

const DEFAULT_ACTIVITY: ActivityItem[] = [
  { id: '1', icon: 'milestone', message: 'Manoj Bhat added milestones test and test2', date: 'Feb 21' },
  { id: '2', icon: 'project', message: 'Manoj Bhat created the project', date: 'Feb 11' },
]

export function ActivitySection({
  items = DEFAULT_ACTIVITY,
  defaultOpen = true,
  contentOnly = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  const content = (
    <Stack gap={0}>
      {items.map((item) => (
        <ActivityRow key={item.id}>
          <span className="activity-icon">
            {item.icon === 'milestone' ? (
              <Diamond size={16} />
            ) : (
              <Box size={16} />
            )}
          </span>
          <Text size="sm">
            {item.message}
            <Text as="span" size="sm" muted> · {item.date}</Text>
          </Text>
        </ActivityRow>
      ))}
    </Stack>
  )

  if (contentOnly) return content

  return (
    <Stack gap={0}>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={16}
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          <span>Activity</span>
        </Flex>
        <SeeAllLink type="button">See all</SeeAllLink>
      </SectionHeader>
      <CollapsibleContent $open={open}>{content}</CollapsibleContent>
    </Stack>
  )
}
