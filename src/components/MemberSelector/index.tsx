import { Check, Plus, Users } from 'lucide-react'
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

type MemberSelectorProps = {
  value: string[]
  teamMembers: TeamMemberOption[]
  onChange?: (memberIds: string[]) => void
}

export function MemberSelector({
  value,
  teamMembers,
  onChange,
}: MemberSelectorProps) {
  const selectedMembers = teamMembers.filter((member) =>
    value.includes(member.id)
  )
  const {
    open,
    draftValue,
    setDraftValue,
    openPicker,
    closePicker,
    savePicker,
  } = useSelectionModalState<string[]>(value, (nextValue) =>
    onChange?.(nextValue)
  )

  const toggleDraftMember = (id: string) => {
    setDraftValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <>
      <Inline align="center" gap="100">
        {selectedMembers.length > 0 ? (
          <>
            <Inline align="center" gap="050">
              {selectedMembers.slice(0, 4).map((member) => (
                <Avatar
                  variant="success"
                  key={member.id}
                  name={member.name}
                  src={member.avatarSrc}
                  size="small"
                />
              ))}
              {selectedMembers.length > 4 ? (
                <Text variant="caption2" color="color.text.subtle">
                  +{selectedMembers.length - 4}
                </Text>
              ) : null}
            </Inline>
          </>
        ) : (
          <>
            <Users size={14} className="row-icon" />
            <Text variant="body3" color="color.text.subtle">
              Add members
            </Text>
          </>
        )}
        <Button
          buttonType="icon"
          size="small"
          variant="success"
          icon={<Plus size={14} />}
          aria-label="Select members"
          onClick={openPicker}
        />
      </Inline>
      <Modal
        open={open}
        onClose={closePicker}
        title="Select members"
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
          {teamMembers.length === 0 ? (
            <Text variant="body3" color="color.text.subtle">
              No members found for this team.
            </Text>
          ) : (
            teamMembers.map((member) => {
              const selected = draftValue.includes(member.id)
              return (
                <Button
                  key={member.id}
                  variant="glass"
                  onClick={() => toggleDraftMember(member.id)}
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
                    {selected ? (
                      <Check size={16} color="var(--color-success-600)" />
                    ) : null}
                  </Inline>
                </Button>
              )
            })
          )}
        </Stack>
      </Modal>
    </>
  )
}
