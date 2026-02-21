import styled from 'styled-components'
import { ChevronRight } from 'lucide-react'

const List = styled.ol`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.textMuted};
`

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;

  &:last-child {
    color: ${(p) => p.theme.colors.text};
    font-weight: 500;
  }
`

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export type BreadcrumbItem = { label: string; href?: string }

type Props = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: Props) {
  return (
    <List className={className}>
      {items.map((item, i) => (
        <Item key={i}>
          {i > 0 && <ChevronRight size={12} />}
          {item.href != null ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </Item>
      ))}
    </List>
  )
}
