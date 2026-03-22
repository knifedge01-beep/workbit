import { convertToLexicalJson } from '@thedatablitz/text-editor'

function lexicalJsonHasBlockContent(serialized: string): boolean {
  try {
    const parsed = JSON.parse(serialized) as {
      root?: { children?: unknown }
    }
    const children = parsed?.root?.children
    return Array.isArray(children) && children.length > 0
  } catch {
    return false
  }
}

/**
 * Normalizes persisted editor strings for {@link @thedatablitz/text-editor#TextEditor}:
 * - Lexical serialized JSON (object with non-empty `root.children`) is returned as-is
 * - Otherwise treated as Markdown and converted to Lexical JSON
 *
 * Returns `''` when there is no content — TextEditor then omits `editorState` and uses a
 * valid default tree. Passing Lexical JSON with an empty `root` causes
 * `setEditorState: the editor state is empty`.
 */
export function stringToLexicalEditorState(
  raw: string | null | undefined
): string {
  const s = raw ?? ''
  if (!s.trim()) {
    return ''
  }

  try {
    const parsed = JSON.parse(s) as { root?: { children?: unknown } }
    if (parsed && typeof parsed === 'object' && parsed.root != null) {
      return lexicalJsonHasBlockContent(s) ? s : ''
    }
  } catch {
    // not JSON — treat as markdown
  }

  try {
    const converted = convertToLexicalJson(s, 'markdown')
    return lexicalJsonHasBlockContent(converted) ? converted : ''
  } catch {
    return ''
  }
}
