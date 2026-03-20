import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

export const markdownPreviewOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
}
