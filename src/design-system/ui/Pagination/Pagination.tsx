import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Wrap = styled.nav`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing[1]}px;
`

const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? '#FFFFFF' : p.theme.colors.text)};
  background: ${(p) => (p.$active ? p.theme.colors.primary : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  border-radius: ${(p) => p.theme.radii?.sm ?? 4}px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${(p) => (p.$active ? p.theme.colors.primaryHover : p.theme.colors.surfaceHover)};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: Props) {
  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('ellipsis')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) pages.push(i)
    }
    if (page < totalPages - 2) pages.push('ellipsis')
    if (totalPages > 1) pages.push(totalPages)
  }

  return (
    <Wrap className={className} aria-label="Pagination">
      <PageBtn
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </PageBtn>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} style={{ padding: '0 4px' }}>
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            type="button"
            $active={page === p}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageBtn>
        )
      )}
      <PageBtn
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next"
      >
        <ChevronRight size={18} />
      </PageBtn>
    </Wrap>
  )
}
