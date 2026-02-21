import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { IconButton } from '../IconButton'
import { Button } from '../Button'

const CloseWrap = styled.span<{ $promotional?: boolean }>`
  ${(p) => p.$promotional && 'color: #FFFFFF;'}
`

const PrimaryButton = styled(Button)<{
  $destructive?: boolean
  $promotional?: boolean
}>`
  ${(p) =>
    p.$destructive &&
    `background: ${p.theme.colors.error}; border-color: ${p.theme.colors.error}; &:hover { opacity: 0.9; }`}
  ${(p) =>
    p.$promotional &&
    `background: #FFFFFF; color: ${p.theme.colors.primary}; &:hover { opacity: 0.9; }`}
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${(p) => p.theme.spacing[4]}px;
`

const Panel = styled.div<{ $variant: ModalVariant }>`
  background: ${(p) =>
    p.$variant === 'promotional' ? p.theme.colors.primary : p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.lg ?? 8}px;
  max-width: 100%;
  max-height: 90vh;
  overflow: auto;
`

const Header = styled.div<{ $centered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[4]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  ${(p) => p.$centered && 'justify-content: center;'}
`

const Title = styled.span<{ $promotional?: boolean }>`
  font-weight: 600;
  font-size: 1rem;
  color: ${(p) => (p.$promotional ? '#FFFFFF' : p.theme.colors.text)};
`

const Body = styled.div<{ $centered?: boolean; $promotional?: boolean }>`
  padding: ${(p) => p.theme.spacing[4]}px;
  color: ${(p) => (p.$promotional ? '#FFFFFF' : p.theme.colors.text)};
  ${(p) => p.$centered && 'text-align: center;'}
`

const Footer = styled.div<{ $centered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[4]}px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  ${(p) => p.$centered && 'justify-content: center;'}
`

const IconWrap = styled.div<{ $promotional?: boolean }>`
  display: flex;
  justify-content: center;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
  color: ${(p) => (p.$promotional ? '#FFFFFF' : p.theme.colors.primary)};
`

export type ModalVariant =
  | 'regular'
  | 'destructive'
  | 'message'
  | 'success'
  | 'form'
  | 'promotional'
  | 'blank'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  variant?: ModalVariant
  /** For message/success: icon node */
  icon?: React.ReactNode
  /** Primary action label */
  primaryLabel?: string
  /** Primary action handler (e.g. Confirm, Delete) */
  onPrimary?: () => void
  /** Secondary label (e.g. Cancel) */
  secondaryLabel?: string
  /** Secondary action handler */
  onSecondary?: () => void
  children: React.ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  variant = 'regular',
  icon,
  primaryLabel,
  onPrimary,
  secondaryLabel = 'Cancel',
  onSecondary,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const isCentered = variant === 'message' || variant === 'success'
  const isPromotional = variant === 'promotional'
  const isBlank = variant === 'blank'
  const isDestructive = variant === 'destructive'

  return createPortal(
    <AnimatePresence>
      {open && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Panel
            as={motion.div}
            $variant={variant}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
        {!isBlank && (
          <Header $centered={isCentered && !title}>
            {title != null ? (
              <Title $promotional={isPromotional}>{title}</Title>
            ) : null}
            <CloseWrap $promotional={isPromotional}>
              <IconButton aria-label="Close" onClick={onClose}>
                <X size={16} />
              </IconButton>
            </CloseWrap>
          </Header>
        )}
        {isBlank && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton aria-label="Close" onClick={onClose}>
              <X size={16} />
            </IconButton>
          </div>
        )}
        <Body $centered={isCentered} $promotional={isPromotional}>
          {icon != null && (variant === 'message' || variant === 'success') && (
            <IconWrap $promotional={isPromotional}>{icon}</IconWrap>
          )}
          {children}
        </Body>
        {!isBlank && (primaryLabel != null || secondaryLabel != null) && (
          <Footer $centered={isCentered && secondaryLabel == null}>
            {secondaryLabel != null && onSecondary != null && (
              <Button variant="ghost" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
            {primaryLabel != null && onPrimary != null && (
              <PrimaryButton
                $destructive={isDestructive}
                $promotional={isPromotional}
                variant="primary"
                onClick={onPrimary}
              >
                {primaryLabel}
              </PrimaryButton>
            )}
          </Footer>
        )}
          </Panel>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  )
}
