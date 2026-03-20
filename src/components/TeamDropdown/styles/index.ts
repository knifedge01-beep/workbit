import styled from 'styled-components'

export const TeamTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
`

export const Panel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 160px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`

export const Item = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  background: ${(p) =>
    p.$selected ? p.theme.colors.surfaceHover : 'transparent'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  text-align: left;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

export const Wrap = styled.div`
  position: relative;
  display: inline-block;
`
