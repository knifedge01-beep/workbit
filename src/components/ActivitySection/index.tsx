import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Text, Flex } from '@design-system'

import { SectionHeader, CollapsibleContent } from '../CollapsibleSection'
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineBody,
  SeeAllLink,
} from './styles'
import type { ActivitySectionProps } from './types'
import { DEFAULT_ACTIVITY } from './utils/defaultActivity'
import { getActivityIcon } from './utils/getActivityIcon'

export type { ActivityItem } from './types'

export function ActivitySection({
  items = DEFAULT_ACTIVITY,
  defaultOpen = true,
  contentOnly = false,
}: ActivitySectionProps) {
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
          <TimelineDot>{getActivityIcon(item.icon)}</TimelineDot>
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
