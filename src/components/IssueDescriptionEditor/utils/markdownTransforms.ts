export function surroundSelectionContent(
  content: string,
  left: string,
  right: string,
  start: number,
  end: number
) {
  const selected = content.slice(start, end)
  const next = `${content.slice(0, start)}${left}${selected}${right}${content.slice(end)}`
  const cursor = start + left.length + selected.length + right.length
  return { next, cursor }
}

export function prefixLinesContent(
  content: string,
  prefix: string,
  start: number,
  end: number
) {
  const selected = content.slice(start, end)
  const block = selected || 'Item'
  const nextBlock = block
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n')
  const next = `${content.slice(0, start)}${nextBlock}${content.slice(end)}`
  const cursor = start + nextBlock.length
  return { next, cursor }
}
