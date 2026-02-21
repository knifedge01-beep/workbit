import { useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

type AccordionSize = 'large' | 'medium' | 'small'

const sizeMap = {
  large: { headerPadding: '16px 20px', contentPadding: '16px 20px', fontSize: '1rem', contentSize: '0.9375rem' },
  medium: { headerPadding: '12px 16px', contentPadding: '12px 16px', fontSize: '0.9375rem', contentSize: '0.875rem' },
  small: { headerPadding: '8px 12px', contentPadding: '8px 12px', fontSize: '0.875rem', contentSize: '0.8125rem' },
}

const Item = styled.div`
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`

const Header = styled.button<{ $open: boolean; $size: AccordionSize }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${(p) => sizeMap[p.$size].headerPadding};
  font-size: ${(p) => sizeMap[p.$size].fontSize};
  font-weight: ${(p) => (p.$open ? 600 : 400)};
  color: ${(p) => p.theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  svg {
    flex-shrink: 0;
    transition: transform 0.2s;
    transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'none')};
  }
`

const ContentInner = styled.div<{ $size: AccordionSize }>`
  font-size: ${(p) => sizeMap[p.$size].contentSize};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.5;
  padding: ${(p) => sizeMap[p.$size].contentPadding};
  padding-top: 0;
`

export type AccordionItem = {
  id: string
  label: string
  content: React.ReactNode
}

type Props = {
  items: AccordionItem[]
  size?: AccordionSize
  /** If set, only one item can be open at a time */
  singleOpen?: boolean
  className?: string
}

export function Accordion({
  items,
  size = 'medium',
  singleOpen = true,
  className,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => {
      if (prev === id) return null
      return singleOpen ? id : (prev ? `${prev},${id}` : id) as unknown as string
    })
  }

  const isOpen = (id: string) => openId === id

  return (
    <div className={className}>
      {items.map((item) => (
        <Item key={item.id}>
          <Header
            $open={isOpen(item.id)}
            $size={size}
            onClick={() => toggle(item.id)}
          >
            {item.label}
            <ChevronDown size={18} />
          </Header>
          <AnimatePresence initial={false}>
            {isOpen(item.id) && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <ContentInner $size={size}>{item.content}</ContentInner>
              </motion.div>
            )}
          </AnimatePresence>
        </Item>
      ))}
    </div>
  )
}
