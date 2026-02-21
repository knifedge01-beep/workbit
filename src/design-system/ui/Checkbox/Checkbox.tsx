import styled from 'styled-components'

const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
`

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const Box = styled.span<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 3px;
  background: ${(p) => (p.$checked ? p.theme.colors.primary : p.theme.colors.surface)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

type Props = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: React.ReactNode
  className?: string
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  className,
}: Props) {
  return (
    <Wrapper className={className}>
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <Box $checked={checked}>{checked && '✓'}</Box>
      {label != null && <span>{label}</span>}
    </Wrapper>
  )
}
