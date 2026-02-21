import { getStore, saveStore } from './store.js';
import type { Issue, Store } from './types.js';

export async function getTeamIssues(teamId: string, filter?: 'all' | 'active' | 'backlog'): Promise<Issue[]> {
  const s = await getStore();
  let list = s.issues.filter((i) => i.teamId === teamId);
  if (filter === 'active') {
    list = list.filter((i) => i.status !== 'backlog' && i.status !== 'done');
  } else if (filter === 'backlog') {
    list = list.filter((i) => i.status === 'backlog');
  }
  return list;
}

export async function getMyIssues(assigneeId: string): Promise<Issue[]> {
  const s = await getStore();
  return s.issues.filter((i) => i.assigneeId === assigneeId);
}

export async function updateIssue(issueId: string, patch: Partial<Pick<Issue, 'status' | 'assigneeId' | 'assigneeName'>>): Promise<Issue | null> {
  const s = await getStore();
  const issue = s.issues.find((i) => i.id === issueId);
  if (!issue) return null;
  Object.assign(issue, patch);
  await saveStore(s);
  return issue;
}

export async function getIssueById(issueId: string): Promise<Issue | null> {
  const s = await getStore();
  return s.issues.find((i) => i.id === issueId) ?? null;
}
