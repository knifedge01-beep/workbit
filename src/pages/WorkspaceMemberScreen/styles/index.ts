import styled from 'styled-components'

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[4]}px;
  margin-bottom: ${(p) => p.theme.spacing[6]}px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${(p) => p.theme.spacing[4]}px;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]}px;
`
