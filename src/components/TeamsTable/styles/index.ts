import { motion } from 'framer-motion'
import styled from 'styled-components'

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${(p) => p.theme.spacing[4]}px;
`

export const TeamActionsWrap = styled.div`
  opacity: 0;
  transition: opacity 0.15s;
`

export const TeamCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]}px;
  padding: ${(p) => p.theme.spacing[4]}px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    ${TeamActionsWrap} {
      opacity: 1;
    }
  }
`

export const TeamName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin-top: ${(p) => p.theme.spacing[1]}px;
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  svg {
    flex-shrink: 0;
  }
`

export const SearchWrapper = styled.div`
  margin-top: ${(p) => p.theme.spacing[3]}px;
  margin-bottom: ${(p) => p.theme.spacing[3]}px;
  max-width: 260px;
`
