const KNIFEEDGE_PREFIX = '!knifedge'

export type KnifeedgeLexicalResult = {
  /** Serialized Lexical JSON safe to persist (prefix removed from tree). */
  visibleSerialized: string
  knifeedgeMessage: string
}

type LexChild = Record<string, unknown>

export function isLexicalEditorStateJson(value: string): boolean {
  const t = value.trim()
  if (!t.startsWith('{')) return false
  try {
    const o = JSON.parse(t) as { root?: LexChild }
    return (
      typeof o === 'object' &&
      o !== null &&
      typeof o.root === 'object' &&
      o.root !== null &&
      o.root.type === 'root'
    )
  } catch {
    return false
  }
}

/** Plain text approximation (block children joined with newlines) for trigger detection. */
export function lexicalSerializedApproxPlainText(serialized: string): string {
  const doc = JSON.parse(serialized) as { root: LexChild }
  return rootPlainText(doc.root)
}

function collectBlockText(node: LexChild): string {
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text.replace(/\u00a0/g, ' ')
  }
  if (!Array.isArray(node.children)) return ''
  return node.children.map((ch) => collectBlockText(ch as LexChild)).join('')
}

function rootPlainText(root: LexChild): string {
  if (!Array.isArray(root.children)) return ''
  const segments: string[] = []
  for (const child of root.children) {
    segments.push(collectBlockText(child as LexChild))
  }
  return segments.join('\n')
}

/**
 * Removes a leading `!knifedge` token (case-insensitive, optional surrounding
 * whitespace) from the first matching text node in document order.
 */
function stripFromSubtree(node: LexChild): boolean {
  if (node.type === 'text' && typeof node.text === 'string') {
    const next = node.text.replace(/^\s*!knifedge(?:\s+|$)/i, '')
    if (next !== node.text) {
      node.text = next
      return true
    }
  }
  if (!Array.isArray(node.children)) return false
  for (const ch of node.children) {
    if (stripFromSubtree(ch as LexChild)) return true
  }
  return false
}

function stripLeadingKnifeedgeFromDoc(root: LexChild): boolean {
  if (!Array.isArray(root.children)) return false
  for (const block of root.children) {
    if (stripFromSubtree(block as LexChild)) return true
  }
  return false
}

/**
 * If `serialized` is Lexical JSON whose plain text starts with `!knifedge`,
 * returns a new serialized state without that prefix and the message for the AI.
 */
export function tryLexicalKnifeedgeTransform(
  serialized: string
): KnifeedgeLexicalResult | null {
  if (!isLexicalEditorStateJson(serialized)) return null
  const plain = lexicalSerializedApproxPlainText(serialized).trim()
  if (!plain.toLowerCase().startsWith(KNIFEEDGE_PREFIX.toLowerCase())) {
    return null
  }

  const doc = JSON.parse(serialized) as { root: LexChild }
  const strippedOk = stripLeadingKnifeedgeFromDoc(doc.root)
  if (!strippedOk) return null

  const visibleSerialized = JSON.stringify(doc)
  const knifeedgeMessage =
    lexicalSerializedApproxPlainText(visibleSerialized).trim()

  return { visibleSerialized, knifeedgeMessage }
}

/** True if persisted comment body is empty (plain or Lexical JSON). */
export function isSerializedCommentEmpty(content: string): boolean {
  if (!content.trim()) return true
  if (isLexicalEditorStateJson(content)) {
    return lexicalSerializedApproxPlainText(content).trim() === ''
  }
  return false
}
