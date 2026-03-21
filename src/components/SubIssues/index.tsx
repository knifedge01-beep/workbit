import { useState } from 'react'
import { Text } from '@thedatablitz/text'
import { Table, type ColumnDef } from '@thedatablitz/table'
import { TextInput } from '@thedatablitz/text-input'
import { Button } from '@thedatablitz/button'
import { createIssue, fetchIssue, fetchSubIssues } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { formatDateTime, logError } from '../../utils'
import { Inline } from '@thedatablitz/inline'
import { Box } from '@thedatablitz/box'
import { Stack } from '@thedatablitz/stack'

export type SubIssuesProps = {
  parentIssueId: string
}

type SubIssueRow = {
  id: string
  title: string
  status: string
  createdAt: string
}

const columns: ColumnDef<SubIssueRow>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Created' },
]

export function SubIssues({ parentIssueId }: SubIssuesProps) {
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const { data: parentIssue } = useFetch(
    () => fetchIssue(parentIssueId),
    [parentIssueId]
  )
  const {
    data: subIssuesData,
    loading,
    error,
    reload,
  } = useFetch(() => fetchSubIssues(parentIssueId), [parentIssueId])

  const subIssues = subIssuesData ?? []
  const rows: SubIssueRow[] = subIssues.map((subIssue) => ({
    id: subIssue.id,
    title: subIssue.title,
    status: subIssue.status,
    createdAt: formatDateTime(subIssue.date),
  }))

  const handleAddSubIssue = async () => {
    const trimmed = title.trim()
    if (!trimmed || creating || !parentIssue) return
    setCreating(true)
    try {
      await createIssue(parentIssue.teamId, {
        title: trimmed,
        projectId: parentIssue.project?.id,
        parentIssueId,
      })
      setTitle('')
      await reload()
    } catch (e) {
      logError(e, 'Create sub-issue')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Stack gap="100">
      <Text as="h2" variant="body2">
        Sub-issues
      </Text>
      <Inline gap="100" fullWidth>
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void handleAddSubIssue()
            }
          }}
          placeholder="Create sub-issue..."
          disabled={creating}
        />
        <Button
          onClick={() => void handleAddSubIssue()}
          disabled={!title.trim() || creating || !parentIssue}
        >
          Add
        </Button>
      </Inline>

      <Box>
        {loading && (
          <Text as="p" variant="body3">
            Loading sub-issues...
          </Text>
        )}

        {!loading && error && (
          <Text as="p" variant="body3">
            {error}
          </Text>
        )}

        {!loading &&
          !error &&
          (rows.length > 0 ? (
            <Table<SubIssueRow>
              searchable={false}
              columnFilterable={false}
              columns={columns}
              data={rows}
            />
          ) : (
            <Text as="p" variant="body3">
              No sub-issues yet.
            </Text>
          ))}
      </Box>
    </Stack>
  )
}
