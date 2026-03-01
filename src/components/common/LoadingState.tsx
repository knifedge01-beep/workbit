import styled from 'styled-components'

const Container = styled.div<{ fullHeight?: boolean }>`
  padding: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  ${(p) =>
    p.fullHeight &&
    'min-height: 200px; display: flex; align-items: center; justify-content: center;'}
`

interface Props {
  message?: string
  fullHeight?: boolean
}

export function LoadingState({ message = 'Loading...', fullHeight }: Props) {
  return <Container fullHeight={fullHeight}>{message}</Container>
}
