# Decision Tab release checklist

## Test coverage checklist

- API: list decisions with default params returns stable envelope `{ items, pagination }`.
- API: list supports filters by `type`, `status`, `fromDate`, `toDate`.
- API: list honors `mode=mixed` vs `mode=sequential` ordering rules.
- API: list honors `order=asc|desc` and deterministic tie-breaks.
- API: create validates required fields (`title`, `type`, `rationale`).
- API: update rejects unknown decision IDs with `404`.
- API: delete returns `204` on success and `404` when missing.
- API: project scoping is enforced for update/delete.
- Frontend: Decision tab renders loading, empty, and error states.
- Frontend: create decision flow saves and refreshes list.
- Frontend: edit decision flow persists updates.
- Frontend: filter/sort controls trigger refetch and visible ordering changes.
- Frontend: keyboard and focus behavior for modal passes accessibility checks.

## QA scenarios

- Add both major and minor decisions and verify type badges.
- Add decisions with and without `decisionDate`; confirm fallback ordering to `createdAt`.
- Add multiple items with same date/time and verify deterministic order.
- Edit a decision from approved to superseded and verify badge update.
- Enter comma-separated tags and linked IDs; verify round-trip render.
- Reload page and confirm list consistency with backend state.

## Rollout checklist

- Apply Supabase migration `20260319000000_decisions.sql`.
- Deploy API with new `/projects/:projectId/decisions` routes.
- Deploy frontend with Decision tab enabled on project detail.
- Smoke test create/edit/list in staging.
- Validate API error logging in Logbit for bad payloads.
- Monitor post-release for 24h: error rate, latency, failed writes.

## Rollback plan

- Revert frontend deployment to previous version.
- Revert API deployment to previous version.
- Keep `decisions` table as additive schema change (no destructive rollback required).
