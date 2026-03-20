import { motion } from 'framer-motion'
import styled from 'styled-components'

export const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const MilestoneRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
  &:hover .ms-actions {
    opacity: 1;
  }
`

export const MilestoneName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ProgressTrack = styled.div`
  flex: 1;
  max-width: 120px;
  height: 5px;
  background: ${(p) => p.theme.colors.border};
  border-radius: 9999px;
  overflow: hidden;
`

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 9999px;
`

export const ProgressLabel = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  min-width: 28px;
  text-align: right;
`

export const DueDate = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  white-space: nowrap;
  min-width: 44px;
  text-align: right;
`

export const MsActions = styled.div`
  opacity: 0;
  transition: opacity 0.15s;
  display: flex;
  align-items: center;
`
