import styled from 'styled-components'

const StyledTextarea = styled.textarea`
  width: 100%;
  font-size: 0.875rem;
  padding: ${(p) => p.theme.spacing[2]}px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  resize: vertical;
  min-height: 64px;
  transition: border-color 0.15s ease;
  &:focus {
    border-color: ${(p) => p.theme.colors.borderFocus};
  }
  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string
}

export function Textarea(props: Props) {
  return <StyledTextarea {...props} />
}
