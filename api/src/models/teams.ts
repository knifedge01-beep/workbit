import { getStore, saveStore, generateId } from './store.js';
import type {
  Team,
  StatusUpdate,
  StatusUpdateComment,
  ProjectProperties,
  Milestone,
  ActivityItem,
  View,
  Store,
} from './types.js';

export async function getTeamById(teamId: string): Promise<Team | null> {
  const s = await getStore();
  return s.teams.find((t) => t.id === teamId) ?? null;
}

export async function getTeamProject(teamId: string) {
  const s = await getStore();
  const team = s.teams.find((t) => t.id === teamId);
  if (!team) return null;
  const updates = s.statusUpdates
    .filter((u) => u.teamId === teamId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);
  const properties = s.projectPropertiesByTeam[teamId] ?? {
    status: 'planned',
    priority: 'high',
    teamIds: [],
    labelIds: [],
  };
  const milestones = s.milestones.filter((m) => m.teamId === teamId);
  const activity = s.activity
    .filter((a) => a.teamId === teamId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return {
    team: { id: team.id, name: team.name },
    project: {
      id: team.projectId ?? teamId,
      statusUpdates: { nodes: updates },
      properties,
      milestones,
      activity,
    },
  };
}

export async function getStatusUpdateComments(updateId: string): Promise<StatusUpdateComment[]> {
  const s = await getStore();
  return s.statusUpdateComments.filter((c) => c.updateId === updateId);
}

export async function addStatusUpdate(
  teamId: string,
  content: string,
  status: 'on-track' | 'at-risk' | 'off-track',
  author: { id: string; name: string; avatarSrc?: string }
): Promise<StatusUpdate> {
  const s = await getStore();
  const update: StatusUpdate = {
    id: generateId(),
    teamId,
    status,
    content,
    authorId: author.id,
    authorName: author.name,
    authorAvatarSrc: author.avatarSrc,
    createdAt: new Date().toISOString(),
    commentCount: 0,
  };
  s.statusUpdates.unshift(update);
  await saveStore(s);
  return update;
}

export async function addStatusUpdateComment(
  teamId: string,
  updateId: string,
  content: string,
  authorName: string,
  authorAvatarSrc?: string
): Promise<StatusUpdateComment> {
  const s = await getStore();
  const update = s.statusUpdates.find((u) => u.id === updateId && u.teamId === teamId);
  if (!update) throw new Error('Update not found');
  const comment: StatusUpdateComment = {
    id: generateId(),
    updateId,
    authorName,
    authorAvatarSrc,
    content,
    timestamp: new Date().toISOString(),
  };
  s.statusUpdateComments.push(comment);
  update.commentCount = (update.commentCount ?? 0) + 1;
  await saveStore(s);
  return comment;
}

export async function updateProjectProperties(
  teamId: string,
  patch: Partial<ProjectProperties>
): Promise<ProjectProperties> {
  const s = await getStore();
  const current = s.projectPropertiesByTeam[teamId] ?? {
    status: 'planned',
    priority: 'high',
    teamIds: [],
    labelIds: [],
  };
  s.projectPropertiesByTeam[teamId] = { ...current, ...patch };
  await saveStore(s);
  return s.projectPropertiesByTeam[teamId];
}

export async function addMilestone(
  teamId: string,
  body: { name: string; targetDate?: string; description?: string }
): Promise<Milestone> {
  const s = await getStore();
  const milestone: Milestone = {
    id: generateId(),
    teamId,
    name: body.name,
    progress: 0,
    total: 0,
    targetDate: body.targetDate ?? '',
    description: body.description,
  };
  s.milestones.push(milestone);
  await saveStore(s);
  return milestone;
}

export async function updateMilestone(
  teamId: string,
  milestoneId: string,
  patch: Partial<Pick<Milestone, 'name' | 'targetDate' | 'description' | 'progress' | 'total'>>
): Promise<Milestone | null> {
  const s = await getStore();
  const m = s.milestones.find((x) => x.id === milestoneId && x.teamId === teamId);
  if (!m) return null;
  Object.assign(m, patch);
  await saveStore(s);
  return m;
}

export async function getTeamViews(teamId: string): Promise<View[]> {
  const s = await getStore();
  return s.views.filter((v) => v.teamId === teamId);
}

export async function getTeamLogs(teamId: string, first = 50) {
  const s = await getStore();
  const activity = s.activity
    .filter((a) => a.teamId === teamId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, first)
    .map((a) => ({
      id: a.id,
      action: a.icon,
      actor: { id: '1', name: a.message.split(' ')[0] ?? 'System' },
      timestamp: a.date,
      details: a.message,
    }));
  return { nodes: activity };
}
