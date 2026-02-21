import styled from 'styled-components'
import { Select } from '../Select'

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Sep = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 0.875rem;
`

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: pad(i),
  label: pad(i),
}))
const MINUTES = Array.from({ length: 60 }, (_, i) => ({
  value: pad(i),
  label: pad(i),
}))

type Props = {
  value?: { hours: number; minutes: number }
  onChange?: (value: { hours: number; minutes: number }) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: Props) {
  const hours = value?.hours ?? 0
  const minutes = value?.minutes ?? 0

  return (
    <Row className={className}>
      <Select
        options={HOURS}
        value={pad(hours)}
        onChange={(v) => onChange?.({ hours: parseInt(v, 10), minutes })}
      />
      <Sep>:</Sep>
      <Select
        options={MINUTES}
        value={pad(minutes)}
        onChange={(v) => onChange?.({ hours, minutes: parseInt(v, 10) })}
      />
    </Row>
  )
}
