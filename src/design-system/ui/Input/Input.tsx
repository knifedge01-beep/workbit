import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  font-size: 0.875rem;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[2]}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  transition: border-color 0.15s ease;
  &:focus {
    border-color: ${(p) => p.theme.colors.borderFocus};
  }
  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  className?: string
}

export function Input(props: Props) {
  return <StyledInput {...props} />
}
