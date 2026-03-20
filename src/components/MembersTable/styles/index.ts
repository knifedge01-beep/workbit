import styled from 'styled-components'

export const TableContainer = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.lg ?? 8}px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]}px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: ${(p) => p.theme.spacing[2]}px;
  }
`

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
  min-width: 0;
  overflow: hidden;
`

export const MemberName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(p) => p.theme.colors.surfaceSecondary};
  color: ${(p) => p.theme.colors.textMuted};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  border: 1px solid ${(p) => p.theme.colors.border};
`
