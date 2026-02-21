import styled from 'styled-components'
import { Star } from 'lucide-react'

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`

const StarFilled = styled(Star)`
  color: #EAB308;
  fill: #EAB308;
`

const StarEmpty = styled(Star)`
  color: #D1D5DB;
`

const StarHalfWrap = styled.span`
  position: relative;
  display: inline-flex;
  .bg {
    color: #D1D5DB;
  }
  .fg {
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    overflow: hidden;
    color: #EAB308;
    fill: #EAB308;
  }
`

type Props = {
  value: number
  max?: number
  size?: number
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function StarRating({
  value,
  max = 5,
  size = 20,
  readOnly = true,
  onChange,
  className,
}: Props) {
  const stars: ('full' | 'half' | 'empty')[] = []
  for (let i = 0; i < max; i++) {
    if (value >= i + 1) stars.push('full')
    else if (value > i && value < i + 1) stars.push('half')
    else stars.push('empty')
  }

  const handleClick = (v: number) => {
    if (!readOnly && onChange) onChange(v)
  }

  return (
    <Wrap className={className}>
      {stars.map((type, i) => {
        const v = i + 1
        const clickable = !readOnly && onChange
        if (type === 'full') {
          return (
            <StarFilled
              key={i}
              size={size}
              onClick={clickable ? () => handleClick(v) : undefined}
              style={clickable ? { cursor: 'pointer' } : undefined}
            />
          )
        }
        if (type === 'half') {
          return (
            <StarHalfWrap key={i}>
              <Star size={size} className="bg" />
              <span className="fg" style={{ width: '50%' }}>
                <Star size={size} fill="currentColor" />
              </span>
            </StarHalfWrap>
          )
        }
        return (
          <StarEmpty
            key={i}
            size={size}
            onClick={clickable ? () => handleClick(v) : undefined}
            style={clickable ? { cursor: 'pointer' } : undefined}
          />
        )
      })}
    </Wrap>
  )
}
