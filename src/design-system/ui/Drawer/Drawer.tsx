import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { IconButton } from '../IconButton'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`

const Panel = styled.div<{ $width: number }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${(p) => p.$width}px;
  max-width: 100%;
  background: ${(p) => p.theme.colors.surface};
  border-left: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1001;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing[3]}px ${(p) => p.theme.spacing[4]}px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

const Title = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${(p) => p.theme.colors.text};
`

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing[4]}px;
`

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  /** Width of the drawer panel in px. */
  width?: number
  children: React.ReactNode
}

export function Drawer({
  open,
  onClose,
  title,
  width = 400,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <Overlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <Panel
            as={motion.div}
            $width={width}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <Header>
              {title != null ? <Title>{title}</Title> : <span />}
              <IconButton aria-label="Close" onClick={onClose}>
                <X size={18} />
              </IconButton>
            </Header>
            <Body>{children}</Body>
          </Panel>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
