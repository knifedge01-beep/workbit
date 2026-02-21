import { useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '../Input'
import { IconButton } from '../IconButton'

const InlineWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  max-width: 100%;
`

const InlineInputWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  svg {
    position: absolute;
    left: ${(p) => p.theme.spacing[2]}px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${(p) => p.theme.colors.textMuted};
    pointer-events: none;
  }
  input {
    padding-left: ${(p) => p.theme.spacing[2] + 20}px;
  }
`

const ExpandableInput = styled(Input)`
  width: 100%;
`

export type SearchVariant = 'expandable' | 'inline'

type BaseProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

type ExpandableProps = BaseProps & {
  variant?: 'expandable'
  /** Width of the input when expanded (px). */
  expandedWidth?: number
  /** Called when the expanded input loses focus. */
  onBlur?: () => void
}

type InlineProps = BaseProps & {
  variant: 'inline'
}

type Props = ExpandableProps | InlineProps

export function Search(props: Props) {
  const {
    placeholder = 'Search...',
    value,
    onChange,
    className,
    variant = 'expandable',
  } = props

  const [expanded, setExpanded] = useState(false)
  const [internalValue, setInternalValue] = useState('')
  const isControlled = value !== undefined
  const searchValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (!isControlled) setInternalValue(v)
    onChange?.(v)
  }

  const handleBlur = () => {
    if (props.variant === 'expandable' && 'onBlur' in props) {
      props.onBlur?.()
    }
    setExpanded(false)
  }

  if (variant === 'inline') {
    return (
      <InlineWrap className={className}>
        <InlineInputWrap>
          <SearchIcon size={16} />
          <Input
            type="search"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleChange}
            aria-label={placeholder}
          />
        </InlineInputWrap>
      </InlineWrap>
    )
  }

  const expandedWidth = 'expandedWidth' in props ? props.expandedWidth ?? 200 : 200

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: expandedWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', display: 'inline-block' }}
          >
            <ExpandableInput
              type="search"
              placeholder={placeholder}
              value={searchValue}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              aria-label={placeholder}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <IconButton
        aria-label={placeholder}
        onClick={() => setExpanded((e) => !e)}
      >
        <SearchIcon size={18} />
      </IconButton>
    </>
  )
}
