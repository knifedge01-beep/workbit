import styled from 'styled-components'

const variantStyles = {
  info: (c: { info: string; infoBg: string }) => `background: ${c.infoBg}; color: ${c.info}; border-color: ${c.info};`,
  success: (c: { success: string; successBg: string }) => `background: ${c.successBg}; color: ${c.success}; border-color: ${c.success};`,
  warning: (c: { warning: string; warningBg: string }) => `background: ${c.warningBg}; color: ${c.warning}; border-color: ${c.warning};`,
  error: (c: { error: string; errorBg: string }) => `background: ${c.errorBg}; color: ${c.error}; border-color: ${c.error};`,
}

const StyledAlert = styled.div<{ $variant: keyof typeof variantStyles }>`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  border-radius: 4px;
  border: 1px solid;
  font-size: 0.875rem;
  ${(p) => variantStyles[p.$variant](p.theme.colors)}
`

type Props = {
  variant?: keyof typeof variantStyles
  children: React.ReactNode
  className?: string
}

export function Alert({ variant = 'info', children, className }: Props) {
  return (
    <StyledAlert $variant={variant} className={className} role="alert">
      {children}
    </StyledAlert>
  )
}
