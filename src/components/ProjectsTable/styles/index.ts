import styled from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[2]}px 0;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: 5px ${(p) => p.theme.spacing[2]}px;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  flex: 1;
  max-width: 260px;
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    width: 100%;
    &::placeholder {
      color: ${(p) => p.theme.colors.textMuted};
    }
  }
  svg {
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`

export const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
    color: ${(p) => p.theme.colors.text};
  }
`

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[3]}px;
  margin-bottom: ${(p) => p.theme.spacing[2]}px;
`

export const TitleBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${(p) => p.theme.spacing[2]}px;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`

export const Count = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${(p) => p.theme.colors.textMuted};
`

export const ProjectNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .proj-icon {
    color: ${(p) => p.theme.colors.primary};
    flex-shrink: 0;
  }
`
