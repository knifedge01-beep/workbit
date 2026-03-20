import styled from 'styled-components'

export const EditorContainer = styled.div`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceSecondary};
`

export const ToolButton = styled.button`
  height: 28px;
  min-width: 28px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

export const EditorArea = styled.textarea`
  width: 100%;
  min-height: 320px;
  border: 0;
  resize: none;
  overflow: hidden;
  outline: none;
  padding: 12px;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font-size: 15px;
  line-height: 1.6;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`
