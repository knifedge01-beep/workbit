import styled from 'styled-components'
import { motion } from 'framer-motion'

const StyledIconButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

type Props = {
  'aria-label': string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function IconButton({
  'aria-label': ariaLabel,
  onClick,
  disabled,
  children,
  className,
}: Props) {
  return (
    <StyledIconButton
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.12 }}
    >
      {children}
    </StyledIconButton>
  )
}
