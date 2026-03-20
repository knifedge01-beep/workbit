import styled from 'styled-components'

export const ContentWrap = styled.div`
  .wmde-markdown {
    color: ${(p) => p.theme.colors.text};
    background: transparent;
  }

  .wmde-markdown p,
  .wmde-markdown li,
  .wmde-markdown blockquote,
  .wmde-markdown td,
  .wmde-markdown th {
    color: ${(p) => p.theme.colors.text};
  }

  .wmde-markdown pre {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border: 1px solid ${(p) => p.theme.colors.border};
  }

  .wmde-markdown code {
    background: ${(p) => p.theme.colors.surfaceSecondary};
    border-radius: 4px;
  }
`
