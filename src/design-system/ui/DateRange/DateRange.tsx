import styled from 'styled-components'
import { DatePicker } from '../DatePicker'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]}px;
  align-items: stretch;
  min-width: 0;
`

const Separator = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  align-self: center;
  line-height: 1;
`

type Props = {
  startDate?: Date
  endDate?: Date
  onStartChange?: (date: Date) => void
  onEndChange?: (date: Date) => void
  startPlaceholder?: string
  endPlaceholder?: string
  className?: string
}

export function DateRange({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  startPlaceholder = 'Start',
  endPlaceholder = 'Target',
  className,
}: Props) {
  return (
    <Wrapper className={className}>
      <DatePicker
        value={startDate}
        onChange={onStartChange}
        placeholder={startPlaceholder}
      />
      <Separator aria-hidden>→</Separator>
      <DatePicker
        value={endDate}
        onChange={onEndChange}
        placeholder={endPlaceholder}
      />
    </Wrapper>
  )
}
