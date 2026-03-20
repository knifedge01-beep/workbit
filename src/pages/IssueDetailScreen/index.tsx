import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Star,
  Link2,
  MoreHorizontal,
  CircleDot,
  Plus,
  Trash2,
  SmilePlus,
  Paperclip,
  ArrowUp,
  CalendarClock,
  Tag,
} from 'lucide-react'
import { Text } from '@thedatablitz/text'
import { Avatar, Select } from '@design-system'
import {
  StatusSelector,
  PrioritySelector,
  LoadingState,
  ErrorState,
  IssueDescriptionEditor,
} from '../../components'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useFetch } from '../../hooks/useFetch'
import { fetchIssue, updateIssue, fetchMembers } from '../../api/client'
import { formatDateTime, logError, IconBtn } from '../../utils'
import { cn } from '@design-system-v2/lib/utils'
import type { IssueDetailScreenProps, SubIssue, IssueComment } from './types'

// ===== MAIN COMPONENT =====

export function IssueDetailScreen({
  issueId,
  teamName,
  projectName,
}: IssueDetailScreenProps) {
  const [comment, setComment] = useState('')
  const [priority, setPriority] = useState('medium')
  const [subIssues, setSubIssues] = useState<SubIssue[]>([])
  const [showSubIssueComposer, setShowSubIssueComposer] = useState(false)
  const [subIssueTitle, setSubIssueTitle] = useState('')
  const { projects: workspaceProjects } = useWorkspace()
  const teamId = workspaceProjects.find((p) => p.name === projectName)?.team.id

  const {
    data: issueData,
    loading,
    error,
    reload,
  } = useFetch(() => fetchIssue(issueId), [issueId])

  const { data: members } = useFetch(() => fetchMembers(), [])

  const teamProjects = teamId
    ? workspaceProjects.filter((p) => p.team.id === teamId)
    : []

  const projectOptions = [
    { value: '', label: 'No project' },
    ...teamProjects.map((p) => ({ value: p.id, label: p.name })),
  ]

  const assigneeOptions = [
    { value: '', label: 'No assignee' },
    ...(members ?? []).map((m) => ({ value: m.id, label: m.name })),
  ]

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateIssue(issueId, { status: newStatus })
      reload()
    } catch (e) {
      logError(e, 'Status update')
    }
  }

  const handleProjectChange = async (value: string) => {
    try {
      await updateIssue(issueId, { projectId: value === '' ? null : value })
      reload()
    } catch (e) {
      logError(e, 'Project update')
    }
  }

  const handleAssigneeChange = async (value: string) => {
    try {
      const member = (members ?? []).find((m) => m.id === value)
      await updateIssue(issueId, {
        assigneeId: value === '' ? undefined : value,
        assigneeName: member?.name,
      })
      reload()
    } catch (e) {
      logError(e, 'Assignee update')
    }
  }

  const descriptionLatestRef = useRef('')
  const descriptionDirtyRef = useRef(false)
  const propertiesBarRef = useRef<HTMLDivElement>(null)
  const [propertiesBarHeight, setPropertiesBarHeight] = useState(0)

  useEffect(() => {
    const el = propertiesBarRef.current
    if (!el) return
    const obs = new ResizeObserver(() =>
      setPropertiesBarHeight(el.offsetHeight)
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleDescriptionChange = useCallback((html: string) => {
    descriptionLatestRef.current = html
    descriptionDirtyRef.current = true
  }, [])

  const handleDescriptionBlur = useCallback(() => {
    if (!descriptionDirtyRef.current) return
    descriptionDirtyRef.current = false
    updateIssue(issueId, { description: descriptionLatestRef.current }).catch(
      (e) => logError(e, 'Description update')
    )
  }, [issueId])

  const handleSendComment = async () => {
    if (!comment.trim()) return
    // TODO: Implement comment API when backend supports it
    console.log('Comment:', comment)
    setComment('')
  }

  const handleAddSubIssue = useCallback(() => {
    const title = subIssueTitle.trim()
    if (!title) return
    setSubIssues((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, title, completed: false },
    ])
    setSubIssueTitle('')
    setShowSubIssueComposer(false)
  }, [subIssueTitle])

  const handleToggleSubIssue = useCallback((subIssueId: string) => {
    setSubIssues((prev) =>
      prev.map((subIssue) =>
        subIssue.id === subIssueId
          ? { ...subIssue, completed: !subIssue.completed }
          : subIssue
      )
    )
  }, [])

  const handleRemoveSubIssue = useCallback((subIssueId: string) => {
    setSubIssues((prev) =>
      prev.filter((subIssue) => subIssue.id !== subIssueId)
    )
  }, [])

  const descriptionForEditor = issueData?.description ?? ''
  const editorKey = `editor-${issueId}`

  if (loading) {
    return (
      <div className="h-full overflow-hidden">
        <div className="flex flex-col p-12">
          <LoadingState message="Loading issue details..." fullHeight />
        </div>
      </div>
    )
  }

  if (error || !issueData) {
    return (
      <div className="h-full overflow-hidden">
        <div className="flex flex-col p-12">
          <ErrorState error={error} message="Issue not found" fullHeight />
        </div>
      </div>
    )
  }

  const issue = {
    id: issueData.id,
    title: issueData.title,
    description: issueData.description ?? '',
    createdBy: issueData.assignee?.name || 'Unknown',
    createdAt: formatDateTime(issueData.date),
    status: issueData.status,
    priority: 'medium',
    assignee: issueData.assignee?.name || 'Unassigned',
    labels: [],
    project: issueData.project?.name || projectName || 'No Project',
    dueDate: formatDateTime(issueData.date),
    teamId: issueData.teamId,
  }

  // Mock comments — comment API not yet implemented
  const comments: IssueComment[] = []

  return (
    <div className="h-full overflow-hidden border-t border-border -mt-8 xl:-mt-10">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Sticky top bar */}
        <div className="flex items-center justify-between h-14 px-8 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Text
              as="span"
              variant="body2"
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              {teamName}
            </Text>
            <Text as="span" variant="body3">
              /
            </Text>
            <Text
              as="span"
              variant="body2"
              className="hover:text-foreground cursor-pointer transition-colors"
            >
              {issue.project}
            </Text>
            <Text as="span" variant="body3">
              /
            </Text>
            <Text
              as="span"
              variant="body2"
              className="text-foreground font-medium"
            >
              {issue.id}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <IconBtn>
              <Star size={15} />
            </IconBtn>
            <IconBtn>
              <Link2 size={15} />
            </IconBtn>
            <IconBtn>
              <MoreHorizontal size={15} />
            </IconBtn>
          </div>
        </div>

        {/* Sticky properties toolbar below indicator and above markdown */}
        <div
          ref={propertiesBarRef}
          className="sticky top-14 z-[9] border-b border-border bg-background/95 backdrop-blur-sm"
        >
          <div className="px-8 py-2 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[168px]">
                <StatusSelector
                  value={issue.status}
                  onChange={handleStatusChange}
                  triggerClassName="h-8 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted/40 transition-colors cursor-pointer [&_svg]:h-3.5 [&_svg]:w-3.5"
                />
              </div>

              <div className="w-[168px]">
                <PrioritySelector
                  value={priority}
                  onChange={setPriority}
                  triggerClassName="h-8 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted/40 transition-colors cursor-pointer [&_svg]:h-3.5 [&_svg]:w-3.5"
                />
              </div>

              <div className="w-[156px]">
                <Select
                  value={issueData?.assignee?.id ?? ''}
                  onChange={handleAssigneeChange}
                  options={assigneeOptions}
                  placeholder="No assignee"
                  className="h-8 px-3 rounded-md border-border bg-background text-xs font-medium cursor-pointer hover:bg-muted/40"
                />
              </div>

              <div className="w-[156px]">
                <Select
                  value={issueData?.project?.id ?? ''}
                  onChange={handleProjectChange}
                  options={projectOptions}
                  placeholder="No project"
                  className="h-8 px-3 rounded-md border-border bg-background text-xs font-medium cursor-pointer hover:bg-muted/40"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 h-8 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <Tag size={13} />
                Add label
              </button>

              <Text
                as="span"
                variant="body3"
                className="inline-flex items-center gap-1.5 h-8 text-muted-foreground md:ml-auto"
              >
                <CalendarClock size={13} />
                {issue.createdAt}
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 w-full">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-foreground mb-3 leading-tight tracking-tight">
            {issue.title}
          </h1>

          {/* Description */}
          <div className="text-[15px] leading-relaxed text-foreground mb-6">
            <IssueDescriptionEditor
              key={editorKey}
              defaultValue={descriptionForEditor}
              value={undefined}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              placeholder="Add description..."
              stickyToolbar={false}
              toolbarTop={56 + propertiesBarHeight}
              alwaysShowToolbar={false}
            />
          </div>

          {/* Sub-issues + meta row */}
          <div className="mb-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSubIssueComposer((prev) => !prev)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <Plus size={14} />
                {showSubIssueComposer ? 'Cancel sub-issue' : 'Add sub-issues'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title="Subscribe"
                >
                  <SmilePlus size={15} />
                </button>
                <button
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy link"
                >
                  <Link2 size={15} />
                </button>
              </div>
            </div>

            {(showSubIssueComposer || subIssues.length > 0) && (
              <div className="mt-3 space-y-2">
                {showSubIssueComposer && (
                  <div className="flex items-center gap-2">
                    <input
                      value={subIssueTitle}
                      onChange={(e) => setSubIssueTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSubIssue()
                        }
                        if (e.key === 'Escape') {
                          setShowSubIssueComposer(false)
                          setSubIssueTitle('')
                        }
                      }}
                      placeholder="Sub-issue title"
                      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubIssue}
                      disabled={!subIssueTitle.trim()}
                      className={cn(
                        'h-9 px-3 rounded-md text-xs font-medium transition-colors',
                        subIssueTitle.trim()
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground cursor-default'
                      )}
                    >
                      Add
                    </button>
                  </div>
                )}

                {subIssues.map((subIssue) => (
                  <div
                    key={subIssue.id}
                    className="flex items-center justify-between rounded-md border border-border/70 bg-card px-2.5 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubIssue(subIssue.id)}
                      className="flex min-w-0 items-center gap-2 text-left"
                    >
                      <CircleDot
                        size={14}
                        className={
                          subIssue.completed
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }
                      />
                      <Text
                        as="span"
                        variant="body2"
                        className={cn(
                          'text-sm truncate',
                          subIssue.completed
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        )}
                      >
                        {subIssue.title}
                      </Text>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSubIssue(subIssue.id)}
                      className="inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                      title="Remove sub-issue"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Activity
              </h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <button className="hover:text-foreground transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Comment list */}
            {comments.length > 0 && (
              <div className="flex flex-col gap-5 mb-5">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar name={c.author} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Text
                          as="span"
                          variant="body2"
                          className="font-medium text-foreground"
                        >
                          {c.author}
                        </Text>
                        <Text
                          as="span"
                          variant="body3"
                          className="text-muted-foreground"
                        >
                          {c.timestamp}
                        </Text>
                      </div>
                      <Text
                        as="p"
                        variant="body2"
                        className="text-foreground leading-relaxed"
                      >
                        {c.body}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment composer */}
            <div className="rounded-lg border border-border/70 bg-card overflow-hidden">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                rows={2}
                className="w-full px-3.5 pt-2.5 pb-2 text-sm bg-transparent resize-none outline-none placeholder:text-muted-foreground text-foreground"
              />
              <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-1">
                  <IconBtn>
                    <Paperclip size={15} />
                  </IconBtn>
                  <IconBtn>
                    <SmilePlus size={15} />
                  </IconBtn>
                </div>
                <button
                  onClick={handleSendComment}
                  disabled={!comment.trim()}
                  className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-md transition-colors',
                    comment.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-default'
                  )}
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
