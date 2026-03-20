import MDEditor from '@uiw/react-md-editor'

import { ContentWrap } from './styles'
import type { MarkdownContentProps } from './types'
import { markdownContentOptions } from './utils/markdownOptions'

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <ContentWrap className={className} data-color-mode="light">
      <MDEditor.Markdown source={content || ''} {...markdownContentOptions} />
    </ContentWrap>
  )
}
