import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

export type PopupPlacement = 'top' | 'bottom' | 'left' | 'right'

/** Alignment along the secondary axis (e.g. for placement "right", start = top, end = bottom). */
export type PopupAlign = 'start' | 'center' | 'end'

const PopupPanel = styled.div<{
  $placement: PopupPlacement
  $align: PopupAlign
}>`
  position: absolute;
  min-width: 160px;
  max-width: 320px;
  padding: ${(p) => p.theme.spacing[3]}px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  pointer-events: auto;
  ${(p) => {
    const gap = 8
    const a = p.$align
    const vertAlign =
      a === 'start' ? 'top: 0' : a === 'end' ? 'bottom: 0' : 'top: 50%; transform: translateY(-50%)'
    const horzAlign =
      a === 'start' ? 'left: 0' : a === 'end' ? 'right: 0' : 'left: 50%; transform: translateX(-50%)'
    switch (p.$placement) {
      case 'top':
        return `bottom: 100%; ${horzAlign}; margin-bottom: ${gap}px;`
      case 'bottom':
        return `top: 100%; ${horzAlign}; margin-top: ${gap}px;`
      case 'left':
        return `right: 100%; ${vertAlign}; margin-right: ${gap}px;`
      case 'right':
        return `left: 100%; ${vertAlign}; margin-left: ${gap}px;`
    }
  }}
`

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`

type BaseProps = {
  placement?: PopupPlacement
  /** Alignment along the secondary axis (e.g. placement "right" + align "start" = popup top aligns with trigger top). */
  align?: PopupAlign
  openOnHover?: boolean
  openOnClick?: boolean
  className?: string
}

type UncontrolledProps = BaseProps & {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen?: never
  onOpenChange?: never
  content?: never
}

type ControlledProps = BaseProps & {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  content: React.ReactNode
  children: React.ReactNode
  trigger?: never
}

export type Props = UncontrolledProps | ControlledProps

function isControlled(props: Props): props is ControlledProps {
  return props.isOpen !== undefined && props.onOpenChange !== undefined
}

export function Popup(props: Props) {
  const {
    placement = 'right',
    align = 'center',
    openOnHover = false,
    openOnClick = true,
    className,
  } = props

  const uncontrolledOpen = useState(false)
  const [openedByClick, setOpenedByClick] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isControlledMode = isControlled(props)
  const open = isControlledMode ? props.isOpen : uncontrolledOpen[0]
  const setOpen = isControlledMode ? props.onOpenChange : uncontrolledOpen[1]

  const openPopup = (byClick: boolean) => {
    setOpen(true)
    if (byClick) setOpenedByClick(true)
  }

  const closePopup = () => {
    setOpen(false)
    setOpenedByClick(false)
  }

  useEffect(() => {
    if (!open || !openedByClick) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closePopup()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, openedByClick])

  const handleTriggerClick = () => {
    if (openOnClick) {
      if (openedByClick) closePopup()
      else openPopup(true)
    }
  }

  const handlePointerEnter = () => {
    if (openOnHover) openPopup(false)
  }

  const handlePointerLeave = () => {
    if (openOnHover && !openedByClick) setOpen(false)
  }

  return (
    <Wrapper
      ref={ref}
      className={className}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <div
        role={openOnClick ? 'button' : undefined}
        tabIndex={openOnClick ? 0 : undefined}
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (openOnClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleTriggerClick()
          }
        }}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isControlledMode ? props.children : props.trigger}
      </div>
      <AnimatePresence>
        {open && (
          <PopupPanel
            $placement={placement}
            $align={align}
            as={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {isControlledMode ? props.content : props.children}
          </PopupPanel>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}
