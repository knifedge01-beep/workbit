import styled from 'styled-components'

export type InputVariant = 'default' | 'ghost'

const StyledInput = styled.input<{ $variant: InputVariant }>`
  width: 100%;
  font-size: 0.875rem;
  min-width: 0;
  padding: ${(p) =>
    p.$variant === 'ghost'
      ? 0
      : `${p.theme.spacing[2]}px ${p.theme.spacing[3]}px`};
  border: ${(p) =>
    p.$variant === 'ghost' ? 'none' : `1.5px solid ${p.theme.colors.border}`};
  border-radius: 6px;
  background: ${(p) =>
    p.$variant === 'ghost' ? 'transparent' : p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => (p.$variant === 'ghost' ? 500 : 400)};
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: ${(p) =>
      p.$variant === 'ghost' ? 'transparent' : p.theme.colors.borderFocus};
    box-shadow: ${(p) =>
      p.$variant === 'ghost'
        ? 'none'
        : `0 0 0 3px ${p.theme.colors.primaryBg}`};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }

  &:hover:not(:focus) {
    border-color: ${(p) =>
      p.$variant === 'ghost' ? 'transparent' : p.theme.colors.textMuted};
  }
`

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: InputVariant
  className?: string
}

export function Input({ variant = 'default', ...props }: Props) {
  return <StyledInput $variant={variant} {...props} />
}
