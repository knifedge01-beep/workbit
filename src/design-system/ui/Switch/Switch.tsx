import styled from 'styled-components'
import { motion } from 'framer-motion'

const Track = styled.span<{ $on: boolean }>`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: ${(p) => (p.$on ? p.theme.colors.primary : p.theme.colors.border)};
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: background 0.15s ease;
`

const Thumb = styled(motion.span)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
`

const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
`

type Props = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
  className?: string
}

export function Switch({
  checked = false,
  onChange,
  label,
  className,
}: Props) {
  return (
    <Wrapper className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <Track $on={checked} onClick={() => onChange?.(!checked)}>
        <Thumb
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </Track>
      {label != null && <span>{label}</span>}
    </Wrapper>
  )
}
