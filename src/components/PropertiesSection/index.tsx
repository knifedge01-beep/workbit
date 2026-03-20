import { useState } from 'react'
import {
  ChevronDown,
  Plus,
  UserPlus,
  Users,
  Building2,
  Tag,
} from 'lucide-react'

import { Text, IconButton, Stack, Flex, DateRange } from '@design-system'

import { PrioritySelector } from '../PrioritySelector'
import { SectionHeader, CollapsibleContent } from '../CollapsibleSection'
import { StatusSelector } from '../StatusSelector'
import { Row } from './styles'
import type { PropertiesSectionProps } from './types'
import { projectStatusOptions } from './utils/projectStatusOptions'

export function PropertiesSection({
  defaultOpen = true,
  contentOnly = false,
  defaultStatus = 'planned',
  defaultPriority = 'high',
  defaultStartDate,
  defaultEndDate,
  onStatusChange,
  onPriorityChange,
}: PropertiesSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [status, setStatus] = useState(defaultStatus)
  const [priority, setPriority] = useState(defaultPriority)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate)

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onStatusChange?.(value)
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
    onPriorityChange?.(value)
  }

  const content = (
    <>
      <Row>
        <span className="row-label">Status</span>
        <span className="row-value">
          <StatusSelector
            value={status}
            onChange={handleStatusChange}
            placeholder="Status"
            options={projectStatusOptions}
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Priority</span>
        <span className="row-value">
          <PrioritySelector
            value={priority}
            onChange={handlePriorityChange}
            placeholder="Priority"
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Lead</span>
        <span className="row-value">
          <UserPlus size={14} className="row-icon" />
          <Text size="sm" muted>
            Add lead
          </Text>
        </span>
      </Row>
      <Row>
        <span className="row-label">Members</span>
        <span className="row-value">
          <Users size={14} className="row-icon" />
          <Text size="sm" muted>
            Add members
          </Text>
        </span>
      </Row>
      <Row $alignTop>
        <span className="row-label">Dates</span>
        <span className="row-value row-value-date-range">
          <DateRange
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            startPlaceholder="Start"
            endPlaceholder="Target"
          />
        </span>
      </Row>
      <Row>
        <span className="row-label">Teams</span>
        <span className="row-value">
          <Building2 size={14} className="row-icon" />
          <Text size="sm" muted>
            Add team
          </Text>
        </span>
      </Row>
      <Row>
        <span className="row-label">Labels</span>
        <span className="row-value">
          <Tag size={14} className="row-icon" />
          <Text size="sm" muted>
            Add label
          </Text>
        </span>
      </Row>
    </>
  )

  if (contentOnly) return <Stack gap={0}>{content}</Stack>

  return (
    <Stack gap={0}>
      <SectionHeader type="button" onClick={() => setOpen((o) => !o)}>
        <Flex align="center" gap={2}>
          <ChevronDown
            size={16}
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          <span>Properties</span>
        </Flex>
        <IconButton aria-label="Add property">
          <Plus size={16} />
        </IconButton>
      </SectionHeader>
      <CollapsibleContent $open={open}>{content}</CollapsibleContent>
    </Stack>
  )
}
