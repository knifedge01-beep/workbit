import styled from 'styled-components'
import { X } from 'lucide-react'
import { IconButton } from '../IconButton'

const variantStyles = {
  info: (c: { info: string; infoBg: string }) =>
    `background: ${c.infoBg}; color: ${c.info}; border-color: ${c.info};`,
  success: (c: { success: string; successBg: string }) =>
    `background: ${c.successBg}; color: ${c.success}; border-color: ${c.success};`,
  warning: (c: { warning: string; warningBg: string }) =>
    `background: ${c.warningBg}; color: ${c.warning}; border-color: ${c.warning};`,
  error: (c: { error: string; errorBg: string }) =>
    `background: ${c.errorBg}; color: ${c.error}; border-color: ${c.error};`,
}

const StyledBanner = styled.div<{
  $variant: keyof typeof variantStyles
}>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-width: 0 0 1px 0;
  border-style: solid;
  font-size: 0.875rem;
  ${(p) => variantStyles[p.$variant](p.theme.colors)}
`

const Content = styled.div`
  flex: 1;
`

type Props = {
  variant?: keyof typeof variantStyles
  onDismiss?: () => void
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Banner({
  variant = 'info',
  onDismiss,
  action,
  children,
  className,
}: Props) {
  return (
    <StyledBanner $variant={variant} className={className}>
      <Content>{children}</Content>
      {action}
      {onDismiss != null && (
        <IconButton aria-label="Dismiss" onClick={onDismiss}>
          <X size={16} />
        </IconButton>
      )}
    </StyledBanner>
  )
}
