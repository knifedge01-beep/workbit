import type { ReactNode } from 'react'
import styled from 'styled-components'

export type TabItem = { id: string; label: string; icon?: ReactNode }

const ContainerHorizontal = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`

const ContainerVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]}px;
`

const TabHorizontal = styled.button<{ $active: boolean }>`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  transition: color 0.15s ease;
  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`

const TabVertical = styled.button<{ $active: boolean }>`
  padding: ${(p) => p.theme.spacing[2]}px ${(p) => p.theme.spacing[3]}px;
  font-size: 0.875rem;
  font-weight: 400;
  text-align: left;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.text)};
  background: ${(p) => (p.$active ? p.theme.colors.infoBg ?? '#E0F2FE' : 'transparent')};
  border: none;
  border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
  transition: background 0.15s ease, color 0.15s ease;
  &:hover {
    background: ${(p) => (p.$active ? p.theme.colors.infoBg : p.theme.colors.surfaceHover)};
  }
`

type Orientation = 'horizontal' | 'vertical'

type Props = {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  orientation?: Orientation
  className?: string
}

export function Tabs({
  tabs,
  activeId,
  onChange,
  orientation = 'horizontal',
  className,
}: Props) {
  const isVertical = orientation === 'vertical'
  const Container = isVertical ? ContainerVertical : ContainerHorizontal
  const Tab = isVertical ? TabVertical : TabHorizontal

  return (
    <Container className={className}>
      {tabs.map((t) => (
        <Tab
          key={t.id}
          $active={t.id === activeId}
          onClick={() => onChange(t.id)}
        >
          {t.icon}
          <span>{t.label}</span>
        </Tab>
      ))}
    </Container>
  )
}
