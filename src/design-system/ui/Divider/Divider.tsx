import styled from 'styled-components'

const StyledDivider = styled.hr<{ $vertical?: boolean }>`
  border: none;
  background: ${(p) => p.theme.colors.border};
  ${(p) =>
    p.$vertical
      ? `width: 1px; height: 100%; min-height: 16px;`
      : `height: 1px; width: 100%;`}
`

type Props = {
  vertical?: boolean
  className?: string
}

export function Divider({ vertical, className }: Props) {
  return <StyledDivider $vertical={vertical} className={className} />
}
