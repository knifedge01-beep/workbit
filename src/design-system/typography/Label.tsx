import styled from 'styled-components'

const StyledLabel = styled.label`
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: ${(p) => p.theme.spacing[1]}px;
`

type Props = {
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

export function Label({ htmlFor, children, className }: Props) {
  return (
    <StyledLabel htmlFor={htmlFor} className={className}>
      {children}
    </StyledLabel>
  )
}
