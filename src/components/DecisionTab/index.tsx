import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Flex, Input, Modal, Stack, Text } from '@design-system'

import {
  createProjectDecision,
  fetchProjectDecisions,
  updateProjectDecision,
} from '../../api/client'
import type {
  ApiDecision,
  ApiDecisionStatus,
  ApiDecisionType,
} from '../../api/client'
import { logError } from '../../utils/errorHandling'
import { formatDateTime } from '../../utils/format'
import { decisionTabClasses } from './styles/classes'
import type { DecisionForm, DecisionTabProps } from './types'
import {
  csvToArray,
  EMPTY_FORM,
  statusBadgeClass,
  toCsv,
  typeBadgeClass,
} from './utils/helpers'

export function DecisionTab({
  projectId,
  issues,
  milestones,
  isActive,
}: DecisionTabProps) {
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
    <div className={decisionTabClasses.container}>
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
          <label className={decisionTabClasses.label}>
            Type
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'all' | ApiDecisionType)
              }
              className={decisionTabClasses.select}
            >
              <option value="all">All</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </label>

          <label className={decisionTabClasses.label}>
            Status
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | ApiDecisionStatus)
              }
              className={decisionTabClasses.select}
            >
              <option value="all">All</option>
              <option value="proposed">Proposed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="superseded">Superseded</option>
            </select>
          </label>

          <label className={decisionTabClasses.label}>
            View mode
            <select
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as 'mixed' | 'sequential')
              }
              className={decisionTabClasses.select}
            >
              <option value="mixed">Mixed (decision date + created at)</option>
              <option value="sequential">Sequential (created at)</option>
            </select>
          </label>

          <label className={decisionTabClasses.label}>
            Sort
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className={decisionTabClasses.select}
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
          <div className={decisionTabClasses.errorPanel}>
            <Text size="sm">{error}</Text>
          </div>
        ) : items.length === 0 ? (
          <div className={decisionTabClasses.emptyPanel}>
            <Text size="sm" muted>
              No decisions logged yet
            </Text>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((decision) => (
              <div key={decision.id} className={decisionTabClasses.itemCard}>
                <Flex align="center" justify="space-between" gap={2}>
                  <div className="min-w-0">
                    <p className={decisionTabClasses.itemTitle}>
                      {decision.title}
                    </p>
                    <p className={decisionTabClasses.meta}>
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
                    className={`${decisionTabClasses.badge} ${typeBadgeClass(decision.type)}`}
                  >
                    {decision.type}
                  </span>
                  <span
                    className={`${decisionTabClasses.badge} ${statusBadgeClass(decision.status)}`}
                  >
                    {decision.status}
                  </span>
                  <span className={decisionTabClasses.subtleBadge}>
                    Decision date: {decision.decisionDate ?? 'Not set'}
                  </span>
                </div>

                <p className={decisionTabClasses.rationale}>
                  {decision.rationale}
                </p>
                {decision.impact ? (
                  <p className={decisionTabClasses.impact}>
                    Impact: {decision.impact}
                  </p>
                ) : null}

                {decision.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {decision.tags.map((tag) => (
                      <span
                        key={`${decision.id}:tag:${tag}`}
                        className={decisionTabClasses.tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {(decision.linkedIssueIds.length > 0 ||
                  decision.linkedMilestoneIds.length > 0) && (
                  <div className={decisionTabClasses.links}>
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
            <label className={decisionTabClasses.label}>
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as ApiDecisionType,
                  }))
                }
                className={decisionTabClasses.select}
              >
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </label>
            <label className={decisionTabClasses.label}>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as ApiDecisionStatus,
                  }))
                }
                className={decisionTabClasses.select}
              >
                <option value="proposed">Proposed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="superseded">Superseded</option>
              </select>
            </label>
            <label className={decisionTabClasses.label}>
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
            className={decisionTabClasses.textarea}
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
