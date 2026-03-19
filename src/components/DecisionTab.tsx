import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Input, Modal, Stack, Text } from '@design-system'
import {
  createProjectDecision,
  fetchProjectDecisions,
  updateProjectDecision,
} from '../api/client'
import type {
  ApiDecision,
  ApiDecisionStatus,
  ApiDecisionType,
} from '../api/client'
import { formatDateTime } from '../utils/format'
import { logError } from '../utils/errorHandling'

type DecisionForm = {
  title: string
  type: ApiDecisionType
  status: ApiDecisionStatus
  rationale: string
  impact: string
  decisionDate: string
  tagsCsv: string
  linkedIssueIdsCsv: string
  linkedMilestoneIdsCsv: string
}

type Props = {
  projectId?: string
  issues: Array<{ id: string; title: string }>
  milestones: Array<{ id: string; name: string }>
  isActive: boolean
}

const EMPTY_FORM: DecisionForm = {
  title: '',
  type: 'minor',
  status: 'approved',
  rationale: '',
  impact: '',
  decisionDate: '',
  tagsCsv: '',
  linkedIssueIdsCsv: '',
  linkedMilestoneIdsCsv: '',
}

function toCsv(values: string[]): string {
  return values.join(', ')
}

function csvToArray(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function typeBadgeClass(type: ApiDecisionType): string {
  return type === 'major'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-sky-50 text-sky-700 border-sky-200'
}

function statusBadgeClass(status: ApiDecisionStatus): string {
  if (status === 'approved')
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200'
  if (status === 'superseded')
    return 'bg-slate-100 text-slate-700 border-slate-200'
  return 'bg-indigo-50 text-indigo-700 border-indigo-200'
}

export function DecisionTab({
  projectId,
  issues,
  milestones,
  isActive,
}: Props) {
  const [items, setItems] = useState<ApiDecision[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<'all' | ApiDecisionType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ApiDecisionStatus>(
    'all'
  )
  const [mode, setMode] = useState<'mixed' | 'sequential'>('mixed')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DecisionForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const issueMap = useMemo(() => {
    return new Map(issues.map((issue) => [issue.id, issue.title]))
  }, [issues])

  const milestoneMap = useMemo(() => {
    return new Map(
      milestones.map((milestone) => [milestone.id, milestone.name])
    )
  }, [milestones])

  const load = useCallback(async () => {
    if (!projectId) {
      setItems([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await fetchProjectDecisions(projectId, {
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        mode,
        order,
        page: 1,
        pageSize: 100,
      })
      setItems(result.items)
    } catch (e) {
      logError(e, 'DecisionTab.load')
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [mode, order, projectId, statusFilter, typeFilter])

  useEffect(() => {
    if (!isActive) return
    void load()
  }, [isActive, load])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setIsModalOpen(true)
  }

  const openEdit = (decision: ApiDecision) => {
    setEditingId(decision.id)
    setForm({
      title: decision.title,
      type: decision.type,
      status: decision.status,
      rationale: decision.rationale,
      impact: decision.impact ?? '',
      decisionDate: decision.decisionDate ?? '',
      tagsCsv: toCsv(decision.tags),
      linkedIssueIdsCsv: toCsv(decision.linkedIssueIds),
      linkedMilestoneIdsCsv: toCsv(decision.linkedMilestoneIds),
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!projectId) return
    if (!form.title.trim() || !form.rationale.trim()) return

    setSaving(true)
    const payload = {
      title: form.title,
      type: form.type,
      status: form.status,
      rationale: form.rationale,
      impact: form.impact,
      decisionDate: form.decisionDate || undefined,
      tags: csvToArray(form.tagsCsv),
      linkedIssueIds: csvToArray(form.linkedIssueIdsCsv),
      linkedMilestoneIds: csvToArray(form.linkedMilestoneIdsCsv),
    }

    try {
      if (editingId) {
        await updateProjectDecision(projectId, editingId, payload)
      } else {
        await createProjectDecision(projectId, payload)
      }
      setIsModalOpen(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      await load()
    } catch (e) {
      logError(e, 'DecisionTab.save')
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <Stack gap={3}>
        <Flex align="center" justify="space-between" gap={2}>
          <Text size="sm" muted>
            Decisions log for roadmap changes and rationale
          </Text>
          <Button variant="primary" onClick={openCreate} disabled={!projectId}>
            Add decision
          </Button>
        </Flex>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <label className="text-xs text-slate-600">
            Type
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'all' | ApiDecisionType)
              }
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </label>

          <label className="text-xs text-slate-600">
            Status
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | ApiDecisionStatus)
              }
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="proposed">Proposed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="superseded">Superseded</option>
            </select>
          </label>

          <label className="text-xs text-slate-600">
            View mode
            <select
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as 'mixed' | 'sequential')
              }
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              <option value="mixed">Mixed (decision date + created at)</option>
              <option value="sequential">Sequential (created at)</option>
            </select>
          </label>

          <label className="text-xs text-slate-600">
            Sort
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>
        </div>

        {loading ? (
          <Text size="sm" muted>
            Loading decisions...
          </Text>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
            <Text size="sm">{error}</Text>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <Text size="sm" muted>
              No decisions logged yet
            </Text>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((decision) => (
              <div
                key={decision.id}
                className="rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
              >
                <Flex align="center" justify="space-between" gap={2}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {decision.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      By {decision.createdBy.name} •{' '}
                      {formatDateTime(decision.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => openEdit(decision)}
                  >
                    Edit
                  </Button>
                </Flex>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-medium ${typeBadgeClass(decision.type)}`}
                  >
                    {decision.type}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-medium ${statusBadgeClass(decision.status)}`}
                  >
                    {decision.status}
                  </span>
                  <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                    Decision date: {decision.decisionDate ?? 'Not set'}
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                  {decision.rationale}
                </p>
                {decision.impact ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Impact: {decision.impact}
                  </p>
                ) : null}

                {decision.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {decision.tags.map((tag) => (
                      <span
                        key={`${decision.id}:tag:${tag}`}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {(decision.linkedIssueIds.length > 0 ||
                  decision.linkedMilestoneIds.length > 0) && (
                  <div className="mt-2 text-xs text-slate-600">
                    {decision.linkedIssueIds.length > 0 ? (
                      <p>
                        Issues:{' '}
                        {decision.linkedIssueIds
                          .map((id) => issueMap.get(id) ?? id)
                          .join(', ')}
                      </p>
                    ) : null}
                    {decision.linkedMilestoneIds.length > 0 ? (
                      <p>
                        Milestones:{' '}
                        {decision.linkedMilestoneIds
                          .map((id) => milestoneMap.get(id) ?? id)
                          .join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Stack>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit decision' : 'Add decision'}
        primaryLabel={
          saving ? 'Saving...' : editingId ? 'Save changes' : 'Create'
        }
        onPrimary={handleSave}
        secondaryLabel="Cancel"
        onSecondary={() => setIsModalOpen(false)}
      >
        <Stack gap={3}>
          <Input
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Decision title"
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <label className="text-xs text-slate-600">
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as ApiDecisionType,
                  }))
                }
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
              >
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </label>
            <label className="text-xs text-slate-600">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as ApiDecisionStatus,
                  }))
                }
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm"
              >
                <option value="proposed">Proposed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="superseded">Superseded</option>
              </select>
            </label>
            <label className="text-xs text-slate-600">
              Decision date
              <Input
                value={form.decisionDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, decisionDate: e.target.value }))
                }
                placeholder="YYYY-MM-DD"
              />
            </label>
          </div>

          <Input
            value={form.impact}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, impact: e.target.value }))
            }
            placeholder="Impact summary (optional)"
          />
          <textarea
            value={form.rationale}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rationale: e.target.value }))
            }
            placeholder="Rationale"
            className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          <Input
            value={form.tagsCsv}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tagsCsv: e.target.value }))
            }
            placeholder="Tags (comma separated)"
          />
          <Input
            value={form.linkedIssueIdsCsv}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                linkedIssueIdsCsv: e.target.value,
              }))
            }
            placeholder="Linked issue IDs (comma separated)"
          />
          <Input
            value={form.linkedMilestoneIdsCsv}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                linkedMilestoneIdsCsv: e.target.value,
              }))
            }
            placeholder="Linked milestone IDs (comma separated)"
          />
        </Stack>
      </Modal>
    </div>
  )
}
