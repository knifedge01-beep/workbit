import styled from 'styled-components'

export const EditorWrap = styled.div`
  .w-md-editor {
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: ${(p) => p.theme.radii?.md ?? 6}px;
    box-shadow: none;
  }

  .w-md-editor-toolbar {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }

  .w-md-editor-toolbar li > button {
    color: ${(p) => p.theme.colors.text};
  }

  .w-md-editor-content,
  .w-md-editor-text,
  .w-md-editor-text-pre,
  .w-md-editor-text-input,
  .w-md-editor-text-pre > code,
  .wmde-markdown {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.surface};
  }

  .w-md-editor-text-input::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }

  .wmde-markdown {
    background: ${(p) => p.theme.colors.surface};
  }
`
