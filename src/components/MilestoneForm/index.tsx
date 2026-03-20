import { useState } from 'react'
import { Card, Text, Input, DatePicker, IconButton, Menu } from '@design-system'
import {
  Diamond,
  MoreHorizontal,
  GripVertical,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  Paperclip,
} from 'lucide-react'

import { ResourceSelector } from '../ResourceSelector'
import { MILESTONE_MENU_ITEMS } from '../milestoneMenuItems'
import {
  DatePickerGroup,
  Divider,
  MutedLabel,
  HeaderRow,
  LeftGroup,
  DataGroup,
  InputRow,
  ChatAvatar,
  InputWrap,
  StyledInput,
  ResourceWrap,
  SendButton,
  SummaryDot,
} from './styles'
import type { MilestoneFormProps } from './types'
import { formatShortDate, TARGET_DATE_PLACEHOLDER } from './utils/date'

export function MilestoneForm({
  milestoneName = '',
  description = '',
  targetDate,
  issueCount = 0,
  defaultExpanded = true,
  currentUserName = 'You',
  onMilestoneNameChange,
  onDescriptionChange,
  onTargetDateChange,
  onChooseFile,
  onCreateDocument,
  onAddLink,
}: MilestoneFormProps) {
  const [name, setName] = useState(milestoneName)
  const [desc, setDesc] = useState(description)
  const [expanded, setExpanded] = useState(defaultExpanded)

  const progress = 0
  const dateLabel = targetDate ? formatShortDate(targetDate) : '—'

  return (
    <Card>
      <HeaderRow>
        <LeftGroup>
          <IconButton aria-label="Drag to reorder">
            <GripVertical size={18} />
          </IconButton>
          <Diamond
            size={20}
            style={{ color: 'var(--milestone-icon, #EAB308)', flexShrink: 0 }}
          />
          <Input
            variant="ghost"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              onMilestoneNameChange?.(e.target.value)
            }}
            placeholder="Milestone name"
          />
          <IconButton
            aria-label={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded((isExpanded) => !isExpanded)}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </IconButton>
        </LeftGroup>
        <DataGroup>
          {expanded ? (
            <>
              <DatePickerGroup>
                <MutedLabel>Set target date</MutedLabel>
                <DatePicker
                  value={targetDate}
                  onChange={(date) => onTargetDateChange?.(date)}
                  placeholder={TARGET_DATE_PLACEHOLDER}
                />
              </DatePickerGroup>
              <Divider aria-hidden />
              <Text size="sm" muted>
                {issueCount} Issues · {progress}%
              </Text>
            </>
          ) : (
            <Text size="sm" muted>
              {dateLabel}
              <SummaryDot>·</SummaryDot>
              {issueCount} issues
              <SummaryDot>·</SummaryDot>
              {progress}%
            </Text>
          )}
          <Menu
            trigger={
              <IconButton aria-label="More options">
                <MoreHorizontal size={18} />
              </IconButton>
            }
            items={MILESTONE_MENU_ITEMS}
          />
        </DataGroup>
      </HeaderRow>
      {expanded && (
        <InputRow>
          <ChatAvatar name={currentUserName} size={32} />
          <InputWrap>
            <StyledInput
              variant="default"
              placeholder="Add a description..."
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value)
                onDescriptionChange?.(e.target.value)
              }}
              aria-label="Milestone description"
            />
          </InputWrap>
          {(onChooseFile || onCreateDocument || onAddLink) && (
            <ResourceWrap>
              <ResourceSelector
                trigger={
                  <IconButton aria-label="Attach file or link">
                    <Paperclip size={18} />
                  </IconButton>
                }
                onChooseFile={onChooseFile}
                onCreateDocument={onCreateDocument}
                onAddLink={onAddLink}
              />
            </ResourceWrap>
          )}
          <SendButton
            type="button"
            disabled={!desc.trim()}
            aria-label="Save description"
            onClick={() => onDescriptionChange?.(desc.trim())}
          >
            <ArrowUp size={18} />
          </SendButton>
        </InputRow>
      )}
    </Card>
  )
}
