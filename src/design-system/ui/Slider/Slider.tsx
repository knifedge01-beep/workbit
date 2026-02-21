import { useCallback, useState } from 'react'
import styled from 'styled-components'

const Track = styled.div`
  height: 6px;
  background: ${(p) => p.theme.colors.surfaceHover};
  border-radius: 3px;
  position: relative;
  cursor: pointer;
`

const Fill = styled.div<{ $left: number; $width: number }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  width: ${(p) => p.$width}%;
  height: 100%;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 3px;
  pointer-events: none;
`

const Thumb = styled.div<{ $left: number }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  &:active {
    cursor: grabbing;
  }
`

const Wrap = styled.div`
  width: 100%;
  min-width: 120px;
  padding: 8px 0;
`

type Props = {
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  className?: string
}

export function Slider({
  min = 0,
  max = 100,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  className,
}: Props) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const value = controlledValue ?? uncontrolled
  const update = useCallback(
    (v: number) => {
      const clamped = Math.min(max, Math.max(min, v))
      if (controlledValue === undefined) setUncontrolled(clamped)
      onChange?.(clamped)
    },
    [min, max, controlledValue, onChange]
  )

  const pct = ((value - min) / (max - min)) * 100

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const v = min + pct * (max - min)
    update(v)
  }

  return (
    <Wrap className={className}>
      <Track onClick={onTrackClick}>
        <Fill $left={0} $width={pct} />
        <Thumb
          $left={pct}
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startVal = value
            const onMove = (e2: MouseEvent) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const delta = (e2.clientX - startX) / rect.width
              update(startVal + delta * (max - min))
            }
            const onUp = () => {
              document.removeEventListener('mousemove', onMove)
              document.removeEventListener('mouseup', onUp)
            }
            document.addEventListener('mousemove', onMove)
            document.addEventListener('mouseup', onUp)
          }}
        />
      </Track>
    </Wrap>
  )
}

