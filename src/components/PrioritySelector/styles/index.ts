import styled from 'styled-components'

export const Wrapper = styled.div<{ $iconOnly?: boolean }>`
  position: relative;
  display: inline-block;
  min-width: ${(p) => (p.$iconOnly ? 'auto' : '0')};
  width: ${(p) => (p.$iconOnly ? 'auto' : '100%')};
`

export const Trigger = styled.button<{ $iconOnly?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$iconOnly ? 'center' : 'flex-start')};
  gap: ${(p) => p.theme.spacing[2]}px;
  width: ${(p) => (p.$iconOnly ? 'auto' : '100%')};
  padding: ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[1])}px
    ${(p) => (p.$iconOnly ? p.theme.spacing[1] : p.theme.spacing[2])}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => (p.$iconOnly ? 'transparent' : p.theme.colors.surface)};
  border: ${(p) =>
    p.$iconOnly ? 'none' : `1px solid ${p.theme.colors.border}`};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:hover {
    border-color: ${(p) =>
      p.$iconOnly ? 'transparent' : p.theme.colors.borderFocus};
    background: ${(p) =>
      p.$iconOnly ? p.theme.colors.surfaceHover : 'inherit'};
  }
  svg {
    flex-shrink: 0;
    color: ${(p) => p.theme.colors.textMuted};
  }
`

export const TriggerLabel = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Panel = styled.div<{ $openUp: boolean }>`
  position: fixed;
  top: var(--menu-top, 0px);
  left: var(--menu-left, 0px);
  transform: ${(p) => (p.$openUp ? 'translateY(-100%)' : 'none')};
  min-width: 160px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1200;
  overflow: hidden;
`

export const List = styled.div`
  padding: ${(p) => p.theme.spacing[1]}px 0;
`

export const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.text};
  background: ${(p) =>
    p.$selected
      ? (p.theme.colors.dropdownSelectedBg ?? '#E0F2FF')
      : 'transparent'};
  border: none;
  cursor: pointer;
  text-align: left;
  &:hover {
    background: ${(p) =>
      p.theme.colors.dropdownHoverBg ?? p.theme.colors.surfaceHover};
  }
`

export const ItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.textMuted};
`

export const ItemLabel = styled.span`
  flex: 1;
`

export const ItemCheck = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.primary};
`
