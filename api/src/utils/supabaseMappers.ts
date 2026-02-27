/**
 * Map between Supabase rows (snake_case) and domain entities (camelCase).
 * Used by supabaseStore for read/write.
 */
import type {
  Store,
  Workspace,
  Project,
  Team,
  Member,
  View,
  Role,
  Invitation,
  StatusUpdate,
  StatusUpdateComment,
  ProjectProperties,
  Milestone,
  ActivityItem,
  Issue,
  Notification,
  ProjectStatus,
  ActivityIcon,
} from '../models/types.js'

export type DbRow = Record<string, unknown>

export function rowToWorkspace(r: DbRow): Workspace {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    region: (r.region as string) ?? 'us',
    memberIds: (r.member_ids as string[]) ?? [],
  }
}

export function rowToProject(r: DbRow): Project {
  return {
    id: r.id as string,
    name: r.name as string,
    teamId: r.team_id as string,
    status: r.status as string,
  }
}

export function rowToTeam(r: DbRow): Team {
  return {
    id: r.id as string,
    name: r.name as string,
    projectId: r.project_id as string | undefined,
    memberIds: (r.member_ids as string[]) ?? [],
  }
}

export function rowToMember(r: DbRow): Member {
  const authId = (r.supabase_user_id as string | null | undefined) ?? null
  return {
    id: r.id as string,
    name: r.name as string,
    username: r.username as string,
    avatarSrc: r.avatar_src as string | undefined,
    status: r.status as string,
    joined: r.joined as string,
    teamIds: (r.team_ids as string[]) ?? [],
    provisioned: (r.provisioned as boolean) ?? false,
    uid: authId,
    userAuthId: authId,
  }
}

export function rowToView(r: DbRow): View {
  return {
    id: r.id as string,
    name: r.name as string,
    type: r.type as string,
    ownerId: r.owner_id as string,
    teamId: r.team_id as string | undefined,
  }
}

export function rowToRole(r: DbRow): Role {
  return {
    id: r.id as string,
    role: r.role as string,
    memberCount: (r.member_count as number) ?? 0,
    description: (r.description as string) ?? '',
  }
}

export function rowToInvitation(r: DbRow): Invitation {
  return {
    id: r.id as string,
    email: r.email as string,
    roleId: r.role_id as string | undefined,
    createdAt: r.created_at as string,
  }
}

export function rowToStatusUpdate(r: DbRow): StatusUpdate {
  return {
    id: r.id as string,
    teamId: r.team_id as string,
    status: r.status as ProjectStatus,
    content: r.content as string,
    authorId: r.author_id as string,
    authorName: r.author_name as string,
    authorAvatarSrc: r.author_avatar_src as string | undefined,
    createdAt: r.created_at as string,
    commentCount: (r.comment_count as number) ?? 0,
  }
}

export function rowToStatusUpdateComment(r: DbRow): StatusUpdateComment {
  return {
    id: r.id as string,
    updateId: r.update_id as string,
    authorName: r.author_name as string,
    authorAvatarSrc: r.author_avatar_src as string | undefined,
    content: r.content as string,
    timestamp: r.timestamp as string,
  }
}

export function rowToProjectProperties(r: DbRow): ProjectProperties {
  return {
    status: r.status as string,
    priority: r.priority as string,
    leadId: r.lead_id as string | undefined,
    startDate: r.start_date as string | undefined,
    endDate: r.end_date as string | undefined,
    teamIds: (r.team_ids as string[]) ?? [],
    labelIds: (r.label_ids as string[]) ?? [],
  }
}

export function rowToMilestone(r: DbRow): Milestone {
  return {
    id: r.id as string,
    teamId: r.team_id as string,
    name: r.name as string,
    progress: (r.progress as number) ?? 0,
    total: (r.total as number) ?? 0,
    targetDate: (r.target_date as string) ?? '',
    description: r.description as string | undefined,
  }
}

export function rowToActivity(r: DbRow): ActivityItem {
  return {
    id: r.id as string,
    teamId: r.team_id as string,
    icon: r.icon as ActivityIcon,
    message: r.message as string,
    date: r.date as string,
  }
}

export function rowToIssue(r: DbRow): Issue {
  return {
    id: r.id as string,
    title: r.title as string,
    assigneeId: r.assignee_id as string | undefined,
    assigneeName: r.assignee_name as string | undefined,
    date: r.date as string,
    status: r.status as string,
    teamId: r.team_id as string,
    projectId: r.project_id as string | undefined,
  }
}

export function rowToNotification(r: DbRow): Notification {
  return {
    id: r.id as string,
    type: r.type as string,
    title: r.title as string,
    body: r.body as string,
    read: (r.read as boolean) ?? false,
    createdAt: r.created_at as string,
    actorId: r.actor_id as string,
    actorName: r.actor_name as string,
    targetUrl: r.target_url as string | undefined,
  }
}

export function storeToRows(store: Store) {
  return {
    workspaces: store.workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      slug: w.slug,
      region: w.region,
      member_ids: w.memberIds ?? [],
    })),
    projects: store.projects.map((p) => ({
      id: p.id,
      name: p.name,
      team_id: p.teamId,
      status: p.status,
    })),
    teams: store.teams.map((t) => ({
      id: t.id,
      name: t.name,
      project_id: t.projectId ?? null,
      member_ids: t.memberIds ?? [],
    })),
    members: store.members.map((m) => ({
      id: m.id,
      name: m.name,
      username: m.username,
      avatar_src: m.avatarSrc ?? null,
      status: m.status,
      joined: m.joined,
      team_ids: m.teamIds ?? [],
      provisioned: m.provisioned ?? false,
      supabase_user_id: m.uid ?? m.userAuthId ?? null,
    })),
    views: store.views.map((v) => ({
      id: v.id,
      name: v.name,
      type: v.type,
      owner_id: v.ownerId,
      team_id: v.teamId ?? null,
    })),
    roles: store.roles.map((r) => ({
      id: r.id,
      role: r.role,
      member_count: r.memberCount,
      description: r.description,
    })),
    invitations: store.invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role_id: i.roleId ?? null,
      created_at: i.createdAt,
    })),
    status_updates: store.statusUpdates.map((u) => ({
      id: u.id,
      team_id: u.teamId,
      status: u.status,
      content: u.content,
      author_id: u.authorId,
      author_name: u.authorName,
      author_avatar_src: u.authorAvatarSrc ?? null,
      created_at: u.createdAt,
      comment_count: u.commentCount ?? 0,
    })),
    status_update_comments: store.statusUpdateComments.map((c) => ({
      id: c.id,
      update_id: c.updateId,
      author_name: c.authorName,
      author_avatar_src: c.authorAvatarSrc ?? null,
      content: c.content,
      timestamp: c.timestamp,
    })),
    project_properties: Object.entries(store.projectPropertiesByTeam ?? {}).map(
      ([team_id, p]) => ({
        team_id,
        status: p.status,
        priority: p.priority,
        lead_id: p.leadId ?? null,
        start_date: p.startDate ?? null,
        end_date: p.endDate ?? null,
        team_ids: p.teamIds ?? [],
        label_ids: p.labelIds ?? [],
      })
    ),
    milestones: store.milestones.map((m) => ({
      id: m.id,
      team_id: m.teamId,
      name: m.name,
      progress: m.progress ?? 0,
      total: m.total ?? 0,
      target_date: m.targetDate ?? '',
      description: m.description ?? null,
    })),
    activity: store.activity.map((a) => ({
      id: a.id,
      team_id: a.teamId,
      icon: a.icon,
      message: a.message,
      date: a.date,
    })),
    issues: store.issues.map((i) => ({
      id: i.id,
      title: i.title,
      assignee_id: i.assigneeId ?? null,
      assignee_name: i.assigneeName ?? null,
      date: i.date,
      status: i.status,
      team_id: i.teamId,
      project_id: i.projectId ?? null,
    })),
    notifications: store.notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      created_at: n.createdAt,
      actor_id: n.actorId,
      actor_name: n.actorName,
      target_url: n.targetUrl ?? null,
    })),
  }
}
