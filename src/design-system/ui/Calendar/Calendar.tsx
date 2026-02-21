import { useState } from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '../IconButton'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

const Weekday = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  text-align: center;
  padding: ${(p) => p.theme.spacing[1]}px;
`

const Day = styled.button<{ $today?: boolean; $selected?: boolean; $other?: boolean }>`
  width: 28px;
  height: 28px;
  font-size: 0.8125rem;
  border: none;
  border-radius: 4px;
  background: ${(p) => {
    if (p.$selected) return p.theme.colors.primary
    if (p.$today) return p.theme.colors.surfaceHover
    return 'transparent'
  }};
  color: ${(p) => {
    if (p.$selected) return 'white'
    if (p.$other) return p.theme.colors.textMuted
    return p.theme.colors.text
  }};
  cursor: pointer;
  &:hover {
    background: ${(p) => (p.$selected ? p.theme.colors.primaryHover : p.theme.colors.surfaceHover)};
  }
`

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const days: (number | null)[] = Array(startPad).fill(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(d)
  return days
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

type Props = {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export function Calendar({ value, onChange, className }: Props) {
  const [view, setView] = useState(() => {
    const d = value ?? new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const days = getDaysInMonth(view.year, view.month)
  const today = new Date()

  const prev = () => {
    if (view.month === 0) setView({ year: view.year - 1, month: 11 })
    else setView({ year: view.year, month: view.month - 1 })
  }
  const next = () => {
    if (view.month === 11) setView({ year: view.year + 1, month: 0 })
    else setView({ year: view.year, month: view.month + 1 })
  }

  const monthLabel = new Date(view.year, view.month).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className={className}>
      <Header>
        <IconButton aria-label="Previous month" onClick={prev}>
          <ChevronLeft size={16} />
        </IconButton>
        <span>{monthLabel}</span>
        <IconButton aria-label="Next month" onClick={next}>
          <ChevronRight size={16} />
        </IconButton>
      </Header>
      <Grid>
        {WEEKDAYS.map((w) => (
          <Weekday key={w}>{w}</Weekday>
        ))}
        {days.map((d, i) => {
          if (d == null) return <div key={i} />
          const date = new Date(view.year, view.month, d)
          const isOther = date.getMonth() !== view.month
          const isToday = isSameDay(date, today)
          const isSelected = value != null && isSameDay(date, value)
          return (
            <Day
              key={i}
              $today={isToday}
              $selected={isSelected}
              $other={isOther}
              onClick={() => onChange?.(date)}
            >
              {d}
            </Day>
          )
        })}
      </Grid>
    </div>
  )
}
