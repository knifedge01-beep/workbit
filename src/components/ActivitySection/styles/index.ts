import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`

export const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -6px;
    width: 1px;
    background: ${(p) => p.theme.colors.border};
  }
  &:last-child::before {
    display: none;
  }
`

export const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export const TimelineBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
`

export const SeeAllLink = styled.button`
  font-size: 13px;
  color: ${(p) => p.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`
