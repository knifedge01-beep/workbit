import { useState } from 'react'
import { Paperclip } from 'lucide-react'

import { IconButton } from '@design-system'
import { Dropdown } from '@thedatablitz/dropdown'

import type { ProjectStatus } from '../../constants/projectStatus'
import { MarkdownEditor } from '../MarkdownEditor'
import { ResourceSelector } from '../ResourceSelector'
import {
  TextAreaWrap,
  Divider,
  ActionBar,
  ActionLeft,
  ActionRight,
} from './styles'
import type { StatusUpdateComposerProps } from './types'
import { buildStatusItems } from './utils/buildStatusItems'
import { Box } from '@thedatablitz/box'
import { Button } from '@thedatablitz/button'

export type { ProjectStatus } from '../../constants/projectStatus'

export function StatusUpdateComposer({
  status: controlledStatus,
  onStatusChange,
  placeholder = 'Write a project update...',
  onPost,
  onCancel,
  onChooseFile,
  onCreateDocument,
  onAddLink,
}: StatusUpdateComposerProps) {
  const [internalStatus, setInternalStatus] =
    useState<ProjectStatus>('on-track')
  const [draft, setDraft] = useState('')

  const status = controlledStatus ?? internalStatus
  const setStatus = (nextStatus: ProjectStatus) => {
    if (onStatusChange) {
      onStatusChange(nextStatus)
      return
    }

    setInternalStatus(nextStatus)
  }

  const statusItems = buildStatusItems()

  const handlePost = () => {
    const trimmed = draft.trim()
    if (!trimmed || !onPost) return
    onPost(trimmed, status)
    setDraft('')
  }

  return (
    <Box border padding="050">
      <Dropdown
        options={statusItems}
        value={status}
        onChange={(value: string) => setStatus(value as ProjectStatus)}
        placeholder="Select status"
        size="small"
      />
      <TextAreaWrap>
        <MarkdownEditor
          value={draft}
          onChange={setDraft}
          placeholder={placeholder}
          preview="edit"
          minHeight={96}
          visibleDragbar={false}
          textareaProps={{
            'aria-label': 'Project update',
          }}
        />
      </TextAreaWrap>

      <Divider aria-hidden />

      <ActionBar>
        <ActionLeft>
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
        </ActionLeft>
        <ActionRight>
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePost}
            disabled={!draft.trim()}
          >
            Post update
          </Button>
        </ActionRight>
      </ActionBar>
    </Box>
  )
}
