import styled from 'styled-components'

import { Button } from '@design-system'

export const Section = styled.section`
  padding: 8px 0 0;

  @media (max-width: 640px) {
    padding-top: 4px;
  }
`

export const HeaderBlock = styled.div`
  margin-bottom: 10px;

  h3 {
    margin-bottom: 4px;
  }
`

export const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 340px);
  gap: 8px;
  align-items: center;

  @media (max-width: 920px) {
    grid-template-columns: 1fr auto;
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

export const Divider = styled.div`
  margin: 10px 0;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`

export const CreateControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media (max-width: 760px) {
    width: 100%;
    flex-wrap: wrap;
  }
`

export const CreateInputWrap = styled.div`
  flex: 1;
  min-width: 220px;
`

export const SecurityHint = styled.div`
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surfaceSecondary};
`

export const KeyRevealPanel = styled.div`
  margin-top: 8px;
  padding: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surfaceSecondary};
`

export const MonospaceKey = styled.code`
  display: block;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  overflow-x: auto;
`

export const ActiveHeader = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const SearchWrap = styled.div`
  width: 100%;
`

export const KeysList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const KeyItem = styled.article`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 12px;
  background: ${(p) => p.theme.colors.surface};
`

export const KeyItemGrid = styled.div`
  display: grid;
  grid-template-columns:
    minmax(140px, 1fr) minmax(180px, 1.4fr) minmax(160px, 1fr)
    auto;
  gap: 10px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

export const KeyMetaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`

export const DangerButton = styled(Button)`
  border: 1px solid ${(p) => p.theme.colors.error};
  color: ${(p) => p.theme.colors.error};

  &:hover {
    background: ${(p) => p.theme.colors.errorBg};
  }
`

export const ActionsWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`
