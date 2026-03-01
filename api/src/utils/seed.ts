import { getStore, saveStore, isSupabaseConfigured } from '../models/store.js'
import { writeStoreSupabase } from './supabaseStore.js'
import type { Store } from '../models/types.js'

/**
 * Dummy data for development and testing.
 * Used by seedIfEmpty() on first run and by seedDummy() on demand.
 */
export function getDummyStore(): Store {
  return {
    workspaces: [
      {
        id: 'ws-1',
        name: 'Acme Inc',
        slug: 'acme',
        region: 'us',
        memberIds: ['1', '2', '3'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Core product',
        teamId: 'team-product',
        status: 'Active',
      },
      {
        id: 'proj-2',
        name: 'Design system',
        teamId: 'team-design',
        status: 'Active',
      },
      {
        id: 'proj-3',
        name: 'Platform',
        teamId: 'team-platform',
        status: 'In progress',
      },
      {
        id: 'proj-4',
        name: 'Mobile app',
        teamId: 'team-mobile',
        status: 'Planned',
      },
    ],
    teams: [
      {
        id: 'team-product',
        name: 'Product',
        projectId: 'proj-1',
        memberIds: ['1', '2'],
      },
      {
        id: 'team-design',
        name: 'Design',
        projectId: 'proj-2',
        memberIds: ['2', '3'],
      },
      {
        id: 'team-platform',
        name: 'Platform',
        projectId: 'proj-3',
        memberIds: ['1', '3'],
      },
      {
        id: 'team-mobile',
        name: 'Mobile',
        projectId: 'proj-4',
        memberIds: ['2'],
      },
    ],
    members: [
      {
        id: '1',
        name: 'Manoj Bhat',
        username: 'imanojbhat',
        status: 'Workspace admin',
        joined: 'Feb 11',
        teamIds: ['team-product', 'team-platform'],
        provisioned: false,
        userAuthId: null,
      },
      {
        id: '2',
        name: 'Alex Chen',
        username: 'alexchen',
        status: 'Project editor',
        joined: 'Feb 14',
        teamIds: ['team-product', 'team-design', 'team-mobile'],
        provisioned: false,
        userAuthId: null,
      },
      {
        id: '3',
        name: 'Sam Wilson',
        username: 'samwilson',
        status: 'Project viewer',
        joined: 'Feb 18',
        teamIds: ['team-design', 'team-platform'],
        provisioned: false,
        userAuthId: null,
      },
    ],
    views: [
      {
        id: 'view-1',
        name: 'Active issues',
        type: 'List',
        ownerId: '1',
        teamId: undefined,
      },
      {
        id: 'view-2',
        name: 'My backlog',
        type: 'Board',
        ownerId: '1',
        teamId: undefined,
      },
      {
        id: 'view-3',
        name: 'Product roadmap',
        type: 'Roadmap',
        ownerId: '1',
        teamId: 'team-product',
      },
      {
        id: 'view-4',
        name: 'Design board',
        type: 'Board',
        ownerId: '2',
        teamId: 'team-design',
      },
      {
        id: 'view-5',
        name: 'Platform sprint',
        type: 'List',
        ownerId: '3',
        teamId: 'team-platform',
      },
    ],
    roles: [
      {
        id: 'role-workspace-admin',
        role: 'Workspace admin',
        memberCount: 1,
        description:
          'Full access to all projects and settings in the workspace.',
      },
      {
        id: 'role-project-editor',
        role: 'Project editor',
        memberCount: 2,
        description:
          'Write access to specific projects (can create and edit issues, milestones).',
      },
      {
        id: 'role-project-viewer',
        role: 'Project viewer',
        memberCount: 1,
        description: 'Read-only access to specific projects and their issues.',
      },
    ],
    invitations: [
      {
        id: 'inv-1',
        email: 'new@example.com',
        roleId: '2',
        createdAt: new Date().toISOString(),
      },
    ],
    statusUpdates: [
      {
        id: 'su-1',
        teamId: 'Test94',
        status: 'on-track',
        content:
          'Sprint is going well. We shipped the auth flow and started on the dashboard.',
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
      {
        id: 'c-1',
        updateId: 'su-1',
        authorName: 'Alex Chen',
        content: "Looks good, let's ship it.",
        timestamp: new Date().toISOString(),
      },
    ],
    projectPropertiesByTeam: {
      'team-product': {
        status: 'in-progress',
        priority: 'high',
        teamIds: ['team-product'],
        labelIds: [],
        startDate: '2025-02-01',
        endDate: '2025-03-15',
      },
      'team-design': {
        status: 'planned',
        priority: 'medium',
        teamIds: ['team-design'],
        labelIds: [],
      },
      'team-platform': {
        status: 'on-track',
        priority: 'high',
        teamIds: ['team-platform'],
        labelIds: [],
      },
    },
    milestones: [
      {
        id: 'm-1',
        teamId: 'team-product',
        name: 'Launch MVP',
        progress: 60,
        total: 100,
        targetDate: 'Mar 1',
        description: 'Core product ready for beta customers.',
      },
      {
        id: 'm-2',
        teamId: 'team-product',
        name: 'User onboarding',
        progress: 0,
        total: 0,
        targetDate: 'Feb 28',
      },
      {
        id: 'm-3',
        teamId: 'team-design',
        name: 'Design system v2',
        progress: 80,
        total: 100,
        targetDate: 'Feb 25',
      },
    ],
    activity: [
      {
        id: 'a-1',
        teamId: 'team-product',
        icon: 'milestone',
        message: 'Manoj Bhat added milestones Launch MVP and User onboarding',
        date: new Date().toISOString().slice(0, 10),
      },
      {
        id: 'a-2',
        teamId: 'team-product',
        icon: 'project',
        message: 'Manoj Bhat created the Core product project',
        date: '2025-02-11',
      },
      {
        id: 'a-3',
        teamId: 'team-design',
        icon: 'milestone',
        message: 'Alex Chen updated Design system v2 progress to 80%',
        date: new Date(Date.now() - 86400 * 1000).toISOString().slice(0, 10),
      },
    ],
    issues: [
      {
        id: 'PROD-1',
        title: 'Set up workspace and projects',
        assigneeId: '1',
        assigneeName: 'Manoj Bhat',
        date: 'Feb 11',
        status: 'done',
        teamId: 'team-product',
        projectId: 'proj-1',
      },
      {
        id: 'PROD-2',
        title: 'Invite your team',
        assigneeId: '2',
        assigneeName: 'Alex Chen',
        date: 'Feb 11',
        status: 'in progress',
        teamId: 'team-product',
        projectId: 'proj-1',
      },
      {
        id: 'PROD-3',
        title: 'Define access roles',
        date: 'Feb 10',
        status: 'todo',
        teamId: 'team-product',
        projectId: 'proj-1',
      },
      {
        id: 'DES-1',
        title: 'Button component variants',
        assigneeId: '2',
        assigneeName: 'Alex Chen',
        date: 'Feb 15',
        status: 'done',
        teamId: 'team-design',
        projectId: 'proj-2',
      },
      {
        id: 'DES-2',
        title: 'Typography scale',
        assigneeId: '3',
        assigneeName: 'Sam Wilson',
        date: 'Feb 16',
        status: 'in progress',
        teamId: 'team-design',
        projectId: 'proj-2',
      },
      {
        id: 'PLAT-1',
        title: 'API rate limiting',
        assigneeId: '1',
        assigneeName: 'Manoj Bhat',
        date: 'Feb 18',
        status: 'todo',
        teamId: 'team-platform',
        projectId: 'proj-3',
      },
      {
        id: 'PLAT-2',
        title: 'GraphQL schema docs',
        date: 'Feb 19',
        status: 'backlog',
        teamId: 'team-platform',
        projectId: 'proj-3',
      },
    ],
    notifications: [
      {
        id: 'n-1',
        type: 'mention',
        title: 'Alex Chen mentioned you',
        body: 'In status update: "Sprint is going well..."',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: '2',
        actorName: 'Alex Chen',
        targetUrl: '/team/Test94/projects/1',
      },
      {
        id: 'n-2',
        type: 'assignment',
        title: 'You were assigned to an issue',
        body: 'Connect your tools (TES-2)',
        read: true,
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        actorId: '1',
        actorName: 'Manoj Bhat',
        targetUrl: '/team/Test94/issues',
      },
    ],
  }
}

/** Seed only when store is empty (e.g. on first run). */
export async function seedIfEmpty(): Promise<boolean> {
  const store = await getStore()
  const isEmpty = store.projects.length === 0 && store.teams.length === 0
  if (isEmpty) {
    await saveStore(getDummyStore())
    return true
  }
  return false
}

/**
 * Force load dummy data (overwrites existing). Use for dev/reset: npm run seed
 * When Supabase is configured, this writes directly to separate tables in
 * dependency order so related rows exist before references (e.g. teams/projects
 * before issues). If Supabase is not configured, it falls back to the local
 * JSON file store.
 */
export async function seedDummy(): Promise<void> {
  const store = getDummyStore()
  if (isSupabaseConfigured()) {
    await writeStoreSupabase(store)
  } else {
    await saveStore(store)
  }
}
