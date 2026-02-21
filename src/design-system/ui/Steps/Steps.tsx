import styled from 'styled-components'
import { Check } from 'lucide-react'

type StepStatus = 'completed' | 'active' | 'upcoming'

const Container = styled.div<{ $vertical?: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.$vertical ? 'column' : 'row')};
  align-items: ${(p) => (p.$vertical ? 'flex-start' : 'center')};
  gap: ${(p) => p.theme.spacing[2]}px;
`

const StepWrap = styled.div<{ $vertical?: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.$vertical ? 'row' : 'column')};
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]}px;
`

const Circle = styled.div<{ $status: StepStatus }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  background: ${(p) =>
    p.$status === 'completed'
      ? p.theme.colors.primary
      : p.$status === 'active'
        ? p.theme.colors.primary
        : p.theme.colors.surfaceHover};
  color: ${(p) =>
    p.$status === 'completed' || p.$status === 'active' ? '#FFFFFF' : p.theme.colors.textMuted};
  border: 2px solid
    ${(p) =>
      p.$status === 'upcoming' ? p.theme.colors.border : p.theme.colors.primary};
`

const Label = styled.span<{ $status: StepStatus }>`
  font-size: 0.875rem;
  color: ${(p) =>
    p.$status === 'upcoming' ? p.theme.colors.textMuted : p.theme.colors.text};
`

const Connector = styled.div`
  width: 24px;
  height: 2px;
  background: ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`

const ConnectorVertical = styled.div`
  width: 2px;
  min-height: 16px;
  margin-left: 11px;
  background: ${(p) => p.theme.colors.border};
`

export type StepItem = { id: string; label: string; status: StepStatus }

type Props = {
  steps: StepItem[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Steps({
  steps,
  orientation = 'horizontal',
  className,
}: Props) {
  const vertical = orientation === 'vertical'

  return (
    <Container $vertical={vertical} className={className}>
      {steps.map((step, i) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && (vertical ? <ConnectorVertical /> : <Connector />)}
          <StepWrap $vertical={vertical}>
            <Circle $status={step.status}>
              {step.status === 'completed' ? <Check size={14} /> : i + 1}
            </Circle>
            <Label $status={step.status}>{step.label}</Label>
          </StepWrap>
        </div>
      ))}
    </Container>
  )
}
