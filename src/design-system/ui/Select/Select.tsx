import styled from 'styled-components'

const StyledSelect = styled.select`
  font-size: 0.875rem;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  cursor: pointer;
  min-width: 120px;
  &:focus {
    border-color: ${(p) => p.theme.colors.borderFocus};
  }
`

type Option = { value: string; label: string }

type Props = {
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
}: Props) {
  return (
    <StyledSelect
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
    >
      {placeholder != null && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </StyledSelect>
  )
}
