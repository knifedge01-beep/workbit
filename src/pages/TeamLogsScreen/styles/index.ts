import styled from 'styled-components'

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`

export const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 20px;
    bottom: -8px;
    width: 1px;
    background: ${(p) => p.theme.colors.border};
  }

  &:last-child::before {
    display: none;
  }
`

export const Dot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.backgroundSubtle};
  border: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    color: ${(p) => p.theme.colors.textMuted};
  }
`
