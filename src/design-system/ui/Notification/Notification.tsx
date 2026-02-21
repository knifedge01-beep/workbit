import styled from 'styled-components'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

type NotificationType = 'primary' | 'success' | 'error' | 'alert' | 'neutral'

const Bar = styled.div<{ $variant: 'solid' | 'light'; $type: NotificationType }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  font-size: 0.875rem;
  gap: ${(p) => p.theme.spacing[2]}px;
  ${(p) => {
    if (p.$variant === 'solid') {
      const colors: Record<NotificationType, { bg: string; text: string }> = {
        primary: { bg: p.theme.colors.primary, text: '#FFFFFF' },
        success: { bg: p.theme.colors.success, text: '#FFFFFF' },
        error: { bg: p.theme.colors.error, text: '#FFFFFF' },
        alert: { bg: p.theme.colors.warning, text: '#FFFFFF' },
        neutral: {
          bg: p.theme.colors.notificationNeutral ?? '#2C3E50',
          text: '#FFFFFF',
        },
      }
      const c = colors[p.$type]
      return `background: ${c.bg}; color: ${c.text};`
    }
    const lightColors: Record<
      NotificationType,
      { bg: string; text: string }
    > = {
      primary: { bg: p.theme.colors.infoBg, text: p.theme.colors.primary },
      success: { bg: p.theme.colors.successBg, text: p.theme.colors.success },
      error: { bg: p.theme.colors.errorBg, text: p.theme.colors.error },
      alert: { bg: p.theme.colors.warningBg, text: p.theme.colors.warning },
      neutral: {
        bg: p.theme.colors.notificationNeutralBg ?? '#F3F4F6',
        text: p.theme.colors.text,
      },
    }
    const c = lightColors[p.$type]
    return `background: ${c.bg}; color: ${c.text};`
  }};
`

const CloseBtn = styled.button`
  display: inline-flex;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`

type Props = {
  variant?: 'solid' | 'light'
  type?: NotificationType
  onDismiss?: () => void
  children: React.ReactNode
  className?: string
}

export function Notification({
  variant = 'solid',
  type = 'primary',
  onDismiss,
  children,
  className,
}: Props) {
  return (
    <Bar
      as={motion.div}
      $variant={variant}
      $type={type}
      className={className}
      initial={{ x: 48, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 48, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span>{children}</span>
      {onDismiss != null && (
        <CloseBtn type="button" onClick={onDismiss} aria-label="Dismiss">
          <X size={16} />
        </CloseBtn>
      )}
    </Bar>
  )
}
