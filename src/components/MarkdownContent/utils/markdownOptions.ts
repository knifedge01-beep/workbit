import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

export const markdownContentOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
}
