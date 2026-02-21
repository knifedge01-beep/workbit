import { useState } from 'react'
import styled from 'styled-components'

export type TreeNode = {
  id: string
  label: string
  children?: TreeNode[]
  /** When set, node is expandable and this content is shown when expanded. */
  content?: React.ReactNode
}

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const ListItem = styled.li`
  margin: 0;
  padding: 0;
`

const Row = styled.button<{ $depth: number; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  width: 100%;
  padding: ${(p) => p.theme.spacing[1]}px ${(p) => p.theme.spacing[2]}px;
  padding-left: ${(p) => p.theme.spacing[2] + p.$depth * 16}px;
  margin: 0;
  border: none;
  border-radius: 4px;
  background: ${(p) => (p.$selected ? p.theme.colors.surfaceHover : 'transparent')};
  color: ${(p) => p.theme.colors.text};
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`

const Chevron = styled.button<{ $open: boolean }>`
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transform: rotate(${(p) => (p.$open ? 90 : 0)}deg);
  transition: transform 0.15s ease;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.textMuted};
  &::before {
    content: '›';
  }
`

const Spacer = styled.span`
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
`

const Label = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ContentWrap = styled.div<{ $depth: number }>`
  padding-left: ${(p) => p.theme.spacing[2] + p.$depth * 16 + 16}px;
  padding-right: ${(p) => p.theme.spacing[2]}px;
  padding-bottom: ${(p) => p.theme.spacing[2]}px;
`

type Props = {
  nodes: TreeNode[]
  selectedId?: string
  onSelect?: (node: TreeNode) => void
  defaultExpandedIds?: string[]
  className?: string
}

function TreeRow({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  node: TreeNode
  depth: number
  selectedId?: string
  onSelect?: (node: TreeNode) => void
  expandedIds: Set<string>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children != null && node.children.length > 0
  const hasContent = node.content != null
  const isExpandable = hasChildren || hasContent
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <ListItem>
      <Row
        $depth={depth}
        $selected={isSelected}
        onClick={() => onSelect?.(node)}
        type="button"
      >
        {isExpandable ? (
          <Chevron
            type="button"
            $open={isExpanded}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            aria-expanded={isExpanded}
          />
        ) : (
          <Spacer />
        )}
        <Label>{node.label}</Label>
      </Row>
      {hasContent && isExpanded && (
        <ContentWrap $depth={depth}>{node.content}</ContentWrap>
      )}
      {hasChildren && isExpanded && (
        <List>
          {node.children!.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </List>
      )}
    </ListItem>
  )
}

export function Tree({
  nodes,
  selectedId,
  onSelect,
  defaultExpandedIds = [],
  className,
}: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  )

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <List className={className} role="tree">
      {nodes.map((node) => (
        <TreeRow
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onToggle={handleToggle}
        />
      ))}
    </List>
  )
}
