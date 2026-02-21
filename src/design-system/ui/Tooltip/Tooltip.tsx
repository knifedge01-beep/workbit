import { useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

type TooltipVariant = 'light' | 'dark'
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

const Popover = styled.div<{
  $variant: TooltipVariant
  $position: TooltipPosition
}>`
  position: absolute;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.8125rem;
  line-height: 1.4;
  white-space: nowrap;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  pointer-events: none;
  z-index: 100;
  background: ${(p) =>
    p.$variant === 'dark'
      ? p.theme.colors.tooltipDarkBg ?? '#2C3E50'
      : p.theme.colors.background};
  color: ${(p) =>
    p.$variant === 'dark' ? '#FFFFFF' : p.theme.colors.text};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  ${(p) =>
    p.$position === 'top' &&
    `bottom: 100%; left: 50%; transform: translate(-50%, -8px); margin-bottom: 2px;`}
  ${(p) =>
    p.$position === 'bottom' &&
    `top: 100%; left: 50%; transform: translate(-50%, 8px); margin-top: 2px;`}
  ${(p) =>
    p.$position === 'left' &&
    `right: 100%; top: 50%; transform: translate(-8px, -50%); margin-right: 2px;`}
  ${(p) =>
    p.$position === 'right' &&
    `left: 100%; top: 50%; transform: translate(8px, -50%); margin-left: 2px;`}
  &::after {
    content: '';
    position: absolute;
    border: 6px solid transparent;
    ${(p) => {
      const bg =
        p.$variant === 'dark'
          ? p.theme.colors.tooltipDarkBg ?? '#2C3E50'
          : p.theme.colors.background
      switch (p.$position) {
        case 'top':
          return `top: 100%; left: 50%; margin-left: -6px; border-top-color: ${bg}; border-bottom: none;`
        case 'bottom':
          return `bottom: 100%; left: 50%; margin-left: -6px; border-bottom-color: ${bg}; border-top: none;`
        case 'left':
          return `left: 100%; top: 50%; margin-top: -6px; border-left-color: ${bg}; border-right: none;`
        case 'right':
          return `right: 100%; top: 50%; margin-top: -6px; border-right-color: ${bg}; border-left: none;`
      }
    }}
  }
`

type Props = {
  title: string
  variant?: TooltipVariant
  position?: TooltipPosition
  children: React.ReactNode
}

export function Tooltip({
  title,
  variant = 'dark',
  position = 'top',
  children,
}: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <Wrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <Popover $variant={variant} $position={position} role="tooltip">
            <motion.span
              style={{ display: 'block' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {title}
            </motion.span>
          </Popover>
        )}
      </AnimatePresence>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`
