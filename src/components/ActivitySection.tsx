import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Text, Flex } from '@design-system'
import { ChevronDown, Diamond, Box } from 'lucide-react'
import { SectionHeader, CollapsibleContent } from './CollapsibleSection'

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`

const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -6px;
    width: 1px;
    background: ${(p) => p.theme.colors.border};
  }
  &:last-child::before {
    display: none;
  }
`

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

const TimelineBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
`

const SeeAllLink = styled.button`
  font-size: 13px;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
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
  contentOnly?: boolean
}

const DEFAULT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    icon: 'milestone',
    message: 'Manoj Bhat added milestones test and test2',
    date: 'Feb 21',
  },
  {
    id: '2',
    icon: 'project',
    message: 'Manoj Bhat created the project',
    date: 'Feb 11',
  },
]

export function ActivitySection({
  items = DEFAULT_ACTIVITY,
  defaultOpen = true,
  contentOnly = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  const content = (
    <Timeline>
      {items.map((item, i) => (
        <TimelineItem
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, delay: i * 0.09 }}
        >
          <TimelineDot>
            {item.icon === 'milestone' ? (
              <Diamond size={8} />
            ) : (
              <Box size={8} />
            )}
          </TimelineDot>
          <TimelineBody>
            <Text size="sm" as="span">
              {item.message}
            </Text>
            <Text size="xs" muted as="span">
              · {item.date}
            </Text>
          </TimelineBody>
        </TimelineItem>
      ))}
    </Timeline>
  )

  if (contentOnly) return content

  return (
    <div>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={14}
            style={{
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Activity</span>
        </Flex>
        <SeeAllLink type="button">See all</SeeAllLink>
      </SectionHeader>
      <CollapsibleContent $open={open}>{content}</CollapsibleContent>
    </div>
  )
}
