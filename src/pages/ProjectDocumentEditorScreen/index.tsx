import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box } from '@thedatablitz/box'
import { Inline } from '@thedatablitz/inline'
import { Stack } from '@thedatablitz/stack'
import { Text } from '@thedatablitz/text'
import { TextInput as Input } from '@thedatablitz/text-input'
import { TextEditor } from '@thedatablitz/text-editor'
import { Button } from '@thedatablitz/button'
import { Alert } from '@thedatablitz/alert'

import {
  createProjectDocument,
  fetchProjectDocument,
  updateProjectDocument,
} from '../../api/client'
import { logError } from '../../utils/errorHandling'
import { stringToLexicalEditorState } from '../../utils/textEditorState'

export type ProjectDocumentEditorScreenProps = {
  projectName: string
  mode: 'new' | 'edit'
}

export function ProjectDocumentEditorScreen({
  projectName,
  mode,
}: ProjectDocumentEditorScreenProps) {
  const { workspaceId, teamId, projectId, documentId } = useParams<{
    workspaceId: string
    teamId: string
    projectId: string
    documentId?: string
  }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('Untitled')
  const [content, setContent] = useState('')
  const [initialTitle, setInitialTitle] = useState('Untitled')
  const [initialContent, setInitialContent] = useState('')
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editorKey, setEditorKey] = useState(0)

  const listPath =
    workspaceId && teamId && projectId
      ? `/workspace/${workspaceId}/team/${teamId}/projects/${projectId}/documentation`
      : '#'

  useEffect(() => {
    if (mode !== 'edit' || !projectId || !documentId) return
    setLoading(true)
    setError(null)
    fetchProjectDocument(projectId, documentId)
      .then((d) => {
        const t = d.title?.trim() ? d.title : 'Untitled'
        const c = d.content ?? ''
        setTitle(t)
        setInitialTitle(t)
        setInitialContent(c)
        setContent(c)
        setEditorKey((k) => k + 1)
      })
      .catch((e) => {
        logError(e, 'ProjectDocumentEditor.fetch')
        setError(e instanceof Error ? e.message : 'Failed to load document')
      })
      .finally(() => setLoading(false))
  }, [mode, projectId, documentId])

  const defaultLexical = useMemo(
    () => stringToLexicalEditorState(mode === 'edit' ? initialContent : ''),
    [mode, initialContent, editorKey]
  )

  const handleContentChange = useCallback((next: string) => {
    setContent(next)
  }, [])

  const isDirty =
    title.trim() !== initialTitle.trim() || content !== initialContent

  const handleSave = () => {
    if (!projectId || saving) return
    const trimmedTitle = title.trim() || 'Untitled'
    setSaving(true)
    setError(null)
    if (mode === 'new') {
      createProjectDocument(projectId, {
        title: trimmedTitle,
        content,
      })
        .then(() => navigate(listPath))
        .catch((e) => {
          logError(e, 'ProjectDocumentEditor.create')
          setError(e instanceof Error ? e.message : 'Failed to save')
        })
        .finally(() => setSaving(false))
      return
    }
    if (!documentId) {
      setSaving(false)
      return
    }
    updateProjectDocument(projectId, documentId, {
      title: trimmedTitle,
      content,
    })
      .then(() => {
        setInitialTitle(trimmedTitle)
        setInitialContent(content)
        setTitle(trimmedTitle)
      })
      .catch((e) => {
        logError(e, 'ProjectDocumentEditor.update')
        setError(e instanceof Error ? e.message : 'Failed to save')
      })
      .finally(() => setSaving(false))
  }

  const handleCancel = () => {
    navigate(listPath)
  }

  if (!workspaceId || !projectId) {
    return (
      <Box border padding="400">
        <Text variant="body3" color="color.text.subtle">
          Missing project context.
        </Text>
      </Box>
    )
  }

  if (mode === 'edit' && !documentId) {
    return (
      <Box border padding="400">
        <Text variant="body3" color="color.text.subtle">
          Document not found.
        </Text>
      </Box>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_330px]">
      <section className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>Projects</span>
          <span>&gt;</span>
          <span className="font-medium text-slate-800">{projectName}</span>
          <span>&gt;</span>
          <button
            type="button"
            className="text-slate-600 underline hover:text-slate-800"
            onClick={() => navigate(listPath)}
          >
            Documentation
          </button>
          <span>&gt;</span>
          <span className="font-medium text-slate-800">
            {mode === 'new' ? 'New document' : title}
          </span>
        </div>

        <Box border padding="400">
          <Stack gap="300">
            <Inline align="center" justify="space-between" fullWidth>
              <Text variant="heading5">
                {mode === 'new' ? 'New document' : 'Edit document'}
              </Text>
              <Inline gap="100">
                <Button variant="glass" size="small" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={saving || (mode === 'edit' && !isDirty)}
                >
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </Inline>
            </Inline>

            {error ? (
              <Alert
                variant="error"
                placement="inline"
                description={error}
                className="w-full"
              />
            ) : null}

            {loading ? (
              <Text variant="body3" color="color.text.subtle">
                Loading…
              </Text>
            ) : (
              <>
                <div>
                  <Text variant="caption2" color="color.text.subtle">
                    Title
                  </Text>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                  />
                </div>
                <div className="min-w-0 overflow-visible">
                  <TextEditor
                    key={`doc-${editorKey}`}
                    defaultEditorState={defaultLexical}
                    onChange={handleContentChange}
                    autoFocus={false}
                  />
                </div>
              </>
            )}
          </Stack>
        </Box>
      </section>

      <aside>
        <Box border padding="300">
          <Text variant="body3" color="color.text.subtle">
            Changes are saved to project documentation. Cancel returns to the
            document list without saving new documents until you press Save.
          </Text>
        </Box>
      </aside>
    </div>
  )
}
