import styled from 'styled-components'

export const LayoutContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const MainContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  position: relative;
`

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${(p) => p.theme.colors.background};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.colors.backgroundSubtle};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.theme.colors.textMuted};
  }
`

export const ContentInner = styled.div`
  flex: 1;
  padding: ${(p) => p.theme.spacing[8]}px ${(p) => p.theme.spacing[6]}px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 1200px) {
    padding: ${(p) => p.theme.spacing[10]}px ${(p) => p.theme.spacing[8]}px;
  }
`
