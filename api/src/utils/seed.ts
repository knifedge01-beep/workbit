import { getStore, saveStore } from '../models/store.js';
import type { Store } from '../models/types.js';

/**
 * Dummy data for development and testing.
 * Used by seedIfEmpty() on first run and by seedDummy() on demand.
 */
export function getDummyStore(): Store {
  return {
    projects: [
      { id: '1', name: 'TES', teamId: 'Test94', status: 'Active' },
      { id: '2', name: 'Design system', teamId: 'Design', status: 'Active' },
      { id: '3', name: 'Platform', teamId: 'Engineering', status: 'In progress' },
      { id: '4', name: 'Mobile app', teamId: 'Mobile', status: 'Planned' },
    ],
    teams: [
      { id: 'Test94', name: 'Test94', projectId: '1', memberIds: ['1', '2'] },
      { id: 'Design', name: 'Design', projectId: '2', memberIds: ['2', '3'] },
      { id: 'Engineering', name: 'Engineering', projectId: '3', memberIds: ['1', '3'] },
      { id: 'Mobile', name: 'Mobile', projectId: '4', memberIds: ['2'] },
    ],
    members: [
      { id: '1', name: 'Manoj Bhat', username: 'imanojbhat', status: 'Admin', joined: 'Feb 11', teamIds: ['Test94', 'Engineering'] },
      { id: '2', name: 'Alex Chen', username: 'alexchen', status: 'Member', joined: 'Feb 14', teamIds: ['Test94', 'Design', 'Mobile'] },
      { id: '3', name: 'Sam Wilson', username: 'samwilson', status: 'Member', joined: 'Feb 18', teamIds: ['Design', 'Engineering'] },
    ],
    views: [
      { id: '1', name: 'Active issues', type: 'List', ownerId: '1', teamId: undefined },
      { id: '2', name: 'My backlog', type: 'Board', ownerId: '1', teamId: undefined },
      { id: '3', name: 'Team roadmap', type: 'Roadmap', ownerId: '1', teamId: 'Test94' },
      { id: '4', name: 'Design board', type: 'Board', ownerId: '2', teamId: 'Design' },
      { id: '5', name: 'Sprint view', type: 'List', ownerId: '3', teamId: 'Engineering' },
    ],
    roles: [
      { id: '1', role: 'Admin', memberCount: 1, description: 'Full workspace access' },
      { id: '2', role: 'Member', memberCount: 2, description: 'Standard member permissions' },
      { id: '3', role: 'Guest', memberCount: 0, description: 'Limited access for external collaborators' },
    ],
    invitations: [
      { id: 'inv-1', email: 'new@example.com', roleId: '2', createdAt: new Date().toISOString() },
    ],
    statusUpdates: [
      {
        id: 'su-1',
        teamId: 'Test94',
        status: 'on-track',
        content: 'Sprint is going well. We shipped the auth flow and started on the dashboard.',
        authorId: '1',
        authorName: 'Manoj Bhat',
        createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
        commentCount: 1,
      },
      {
        id: 'su-2',
        teamId: 'Design',
        status: 'on-track',
        content: 'Design system v2 components are ready for review.',
        authorId: '2',
        authorName: 'Alex Chen',
        createdAt: new Date(Date.now() - 86400 * 2 * 1000).toISOString(),
        commentCount: 0,
      },
    ],
    statusUpdateComments: [
      { id: 'c-1', updateId: 'su-1', authorName: 'Alex Chen', content: 'Looks good, let\'s ship it.', timestamp: new Date().toISOString() },
    ],
    projectPropertiesByTeam: {
      Test94: { status: 'in-progress', priority: 'high', teamIds: ['Test94'], labelIds: [], startDate: '2025-02-01', endDate: '2025-03-15' },
      Design: { status: 'planned', priority: 'medium', teamIds: ['Design'], labelIds: [] },
      Engineering: { status: 'on-track', priority: 'high', teamIds: ['Engineering'], labelIds: [] },
    },
    milestones: [
      { id: 'm-1', teamId: 'Test94', name: 'Launch MVP', progress: 60, total: 100, targetDate: 'Mar 1', description: 'Core features ready for beta' },
      { id: 'm-2', teamId: 'Test94', name: 'User onboarding', progress: 0, total: 0, targetDate: 'Feb 28' },
      { id: 'm-3', teamId: 'Design', name: 'Design system v2', progress: 80, total: 100, targetDate: 'Feb 25' },
    ],
    activity: [
      { id: 'a-1', teamId: 'Test94', icon: 'milestone', message: 'Manoj Bhat added milestones Launch MVP and User onboarding', date: new Date().toISOString().slice(0, 10) },
      { id: 'a-2', teamId: 'Test94', icon: 'project', message: 'Manoj Bhat created the project', date: '2025-02-11' },
      { id: 'a-3', teamId: 'Design', icon: 'milestone', message: 'Alex Chen updated Design system v2 progress to 80%', date: new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10) },
    ],
    issues: [
      { id: 'TES-1', title: 'Get familiar with Linear', assigneeId: '1', assigneeName: 'Manoj Bhat', date: 'Feb 11', status: 'done', teamId: 'Test94', projectId: '1' },
      { id: 'TES-2', title: 'Connect your tools', assigneeId: '2', assigneeName: 'Alex Chen', date: 'Feb 11', status: 'in progress', teamId: 'Test94', projectId: '1' },
      { id: 'TES-3', title: 'Invite your team', date: 'Feb 10', status: 'todo', teamId: 'Test94', projectId: '1' },
      { id: 'TES-4', title: 'Create a project', date: 'Feb 9', status: 'backlog', teamId: 'Test94', projectId: '1' },
      { id: 'DES-1', title: 'Button component variants', assigneeId: '2', assigneeName: 'Alex Chen', date: 'Feb 15', status: 'done', teamId: 'Design', projectId: '2' },
      { id: 'DES-2', title: 'Typography scale', assigneeId: '3', assigneeName: 'Sam Wilson', date: 'Feb 16', status: 'in progress', teamId: 'Design', projectId: '2' },
      { id: 'ENG-1', title: 'API rate limiting', assigneeId: '1', assigneeName: 'Manoj Bhat', date: 'Feb 18', status: 'todo', teamId: 'Engineering', projectId: '3' },
      { id: 'ENG-2', title: 'GraphQL schema docs', date: 'Feb 19', status: 'backlog', teamId: 'Engineering', projectId: '3' },
    ],
    notifications: [
      { id: 'n-1', type: 'mention', title: 'Alex Chen mentioned you', body: 'In status update: "Sprint is going well..."', read: false, createdAt: new Date().toISOString(), actorId: '2', actorName: 'Alex Chen', targetUrl: '/team/Test94/projects/1' },
      { id: 'n-2', type: 'assignment', title: 'You were assigned to an issue', body: 'Connect your tools (TES-2)', read: true, createdAt: new Date(Date.now() - 3600 * 1000).toISOString(), actorId: '1', actorName: 'Manoj Bhat', targetUrl: '/team/Test94/issues' },
    ],
  };
}

/** Seed only when store is empty (e.g. on first run). */
export async function seedIfEmpty(): Promise<boolean> {
  const store = await getStore();
  const isEmpty = store.projects.length === 0 && store.teams.length === 0;
  if (isEmpty) {
    await saveStore(getDummyStore());
    return true;
  }
  return false;
}

/**
 * Force load dummy data (overwrites existing). Use for dev/reset: npm run seed
 * With Supabase, saveStore writes to separate tables in dependency order so
 * related rows exist before references (e.g. teams/projects before issues).
 */
export async function seedDummy(): Promise<void> {
  await saveStore(getDummyStore());
}
