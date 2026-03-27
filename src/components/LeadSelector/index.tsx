import { Check, Plus, UserPlus } from 'lucide-react'
import { Avatar } from '@thedatablitz/avatar'
import { Button } from '@thedatablitz/button'
import { Inline } from '@thedatablitz/inline'
import { Modal } from '@thedatablitz/modal'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { useSelectionModalState } from '../hooks/useSelectionModalState'

type TeamMemberOption = {
  id: string
  name: string
  avatarSrc?: string
}

type LeadSelectorProps = {
  value?: string
  teamMembers: TeamMemberOption[]
  onChange?: (leadId?: string) => void
}

export function LeadSelector({
  value,
  teamMembers,
  onChange,
}: LeadSelectorProps) {
  const selectedLead = teamMembers.find((member) => member.id === value)
  const {
    open,
    draftValue,
    setDraftValue,
    openPicker,
    closePicker,
    savePicker,
  } = useSelectionModalState<string | undefined>(value, (nextValue) =>
    onChange?.(nextValue)
  )

  return (
    <>
      <Inline align="center" gap="100">
        {selectedLead ? (
          <Avatar
            variant="brand"
            name={selectedLead.name}
            src={selectedLead.avatarSrc}
            size="small"
          />
        ) : (
          <>
            <UserPlus size={14} className="row-icon" />
            <Text variant="body3" color="color.text.subtle">
              Add lead
            </Text>
          </>
        )}
        <Button
          buttonType="icon"
          size="small"
          variant="primary"
          icon={<Plus size={14} />}
          aria-label="Select lead"
          onClick={openPicker}
        />
      </Inline>
      <Modal
        open={open}
        onClose={closePicker}
        title="Select lead"
        size="medium"
        footer={
          <Inline justify="flex-end" gap="100" fullWidth>
            <Button variant="glass" onClick={closePicker}>
              Cancel
            </Button>
            <Button variant="primary" onClick={savePicker}>
              Save
            </Button>
          </Inline>
        }
      >
        <Stack gap="100">
          <Button variant="glass" onClick={() => setDraftValue(undefined)}>
            <Inline fullWidth align="center" justify="space-between">
              <Text variant="body3">No lead</Text>
              {draftValue === undefined ? (
                <Check size={16} color="var(--color-success-600)" />
              ) : null}
            </Inline>
          </Button>
          {teamMembers.map((member) => (
            <Button
              key={member.id}
              variant="glass"
              onClick={() => setDraftValue(member.id)}
            >
              <Inline fullWidth align="center" justify="space-between">
                <Inline align="center" gap="100">
                  <Avatar
                    name={member.name}
                    src={member.avatarSrc}
                    size="small"
                  />
                  <Text variant="body3">{member.name}</Text>
                </Inline>
                {draftValue === member.id ? (
                  <Check size={16} color="var(--color-success-600)" />
                ) : null}
              </Inline>
            </Button>
          ))}
        </Stack>
      </Modal>
    </>
  )
}
