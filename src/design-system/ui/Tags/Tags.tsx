import styled from 'styled-components'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const Tag = styled(motion.span)<{ $size: 'large' | 'medium' | 'small' }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: ${(p) =>
    p.$size === 'large'
      ? `${p.theme.spacing[2]}px ${p.theme.spacing[3]}px`
      : p.$size === 'medium'
        ? `${p.theme.spacing[1]}px ${p.theme.spacing[2]}px`
        : `${p.theme.spacing[1]}px ${p.theme.spacing[2]}px`};
  font-size: ${(p) =>
    p.$size === 'large' ? '0.875rem' : p.$size === 'medium' ? '0.8125rem' : '0.75rem'};
  background: ${(p) => p.theme.colors.surfaceHover};
  color: ${(p) => p.theme.colors.text};
  border-radius: 9999px;
  border: none;
  cursor: default;
`

const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  border-radius: 2px;
  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`

type Props = {
  label: string
  onDismiss?: () => void
  size?: 'large' | 'medium' | 'small'
  className?: string
}

export function Tags({
  label,
  onDismiss,
  size = 'medium',
  className,
}: Props) {
  return (
    <Tag
      $size={size}
      className={className}
      layout
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      {label}
      {onDismiss != null && (
        <CloseBtn type="button" onClick={onDismiss} aria-label="Remove">
          <X size={14} />
        </CloseBtn>
      )}
    </Tag>
  )
}
