export function buildMoreItems(onMore?: (action: 'edit' | 'delete') => void) {
  if (!onMore) {
    return []
  }

  return [
    { id: 'edit', label: 'Edit', onClick: () => onMore('edit') },
    { id: 'delete', label: 'Delete', onClick: () => onMore('delete') },
  ]
}
