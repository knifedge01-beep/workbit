import styled from 'styled-components'
import { motion } from 'framer-motion'

const variants = {
  primary: (colors: { primary: string; primaryHover: string }) => `
    background: ${colors.primary};
    color: white;
    border: none;
    &:hover { background: ${colors.primaryHover}; }
  `,
  secondary: (colors: { secondary: string; secondaryHover: string }) => `
    background: ${colors.secondary};
    color: white;
    border: none;
    &:hover { background: ${colors.secondaryHover}; }
  `,
  outline: (colors: { border: string; text: string }) => `
    background: transparent;
    color: ${colors.text};
    border: 1px solid ${colors.border};
    &:hover { background: ${colors.border}; }
  `,
  ghost: (colors: { text: string; surfaceHover: string }) => `
    background: transparent;
    color: ${colors.text};
    border: none;
    &:hover { background: ${colors.surfaceHover}; }
  `,
}

const StyledButton = styled(motion.button)<{
  $variant: keyof typeof variants
  $size?: 'sm' | 'md'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  font-size: ${(p) => (p.$size === 'sm' ? '0.8125rem' : '0.875rem')};
  font-weight: 500;
  padding: ${(p) => (p.$size === 'sm' ? `${p.theme.spacing[1]}px ${p.theme.spacing[2]}px` : `${p.theme.spacing[2]}px ${p.theme.spacing[3]}px`)};
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s ease;
  ${(p) => variants[p.$variant](p.theme.colors)}
`

type Props = {
  variant?: keyof typeof variants
  size?: 'sm' | 'md'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled,
  children,
  className,
}: Props) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </StyledButton>
  )
}
