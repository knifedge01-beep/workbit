import styled from 'styled-components'
import MDEditor from '@uiw/react-md-editor'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const ContentWrap = styled.div`
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

type Props = {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: Props) {
  return (
    <ContentWrap className={className} data-color-mode="light">
      <MDEditor.Markdown
        source={content || ''}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      />
    </ContentWrap>
  )
}
