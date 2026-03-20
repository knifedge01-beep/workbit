import styled from 'styled-components'

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 440px);
  align-self: center;
  margin: 8vh auto 0;
  text-align: center;
  padding: ${(p) => p.theme.spacing[8]}px ${(p) => p.theme.spacing[6]}px;
  background: ${(p) => p.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    width: 100%;
    margin-top: 4vh;
    padding: ${(p) => p.theme.spacing[6]}px ${(p) => p.theme.spacing[4]}px;
  }
`

export const EmptyIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: ${(p) => p.theme.spacing[4]}px;
  background: ${(p) =>
    p.theme.colors.backgroundSubtle || p.theme.colors.surfaceSecondary};
  border-radius: 50%;
  opacity: 0.9;

  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export const ActionButtons = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing[3]}px;
  width: 100%;
  justify-content: center;

  > * {
    min-height: 40px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }
`
