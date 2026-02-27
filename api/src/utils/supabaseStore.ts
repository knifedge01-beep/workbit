import { supabaseAdmin, isSupabaseConfigured } from './supabaseServer.js'
import type { Store } from '../models/types.js'
import {
  rowToWorkspace,
  rowToProject,
  rowToTeam,
  rowToMember,
  rowToView,
  rowToRole,
  rowToInvitation,
  rowToStatusUpdate,
  rowToStatusUpdateComment,
  rowToProjectProperties,
  rowToMilestone,
  rowToActivity,
  rowToIssue,
  rowToNotification,
  storeToRows,
  type DbRow,
} from './supabaseMappers.js'

function getClient() {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }
  return supabaseAdmin
}

export async function readStoreSupabase(): Promise<Store> {
  const client = getClient()

  const [
    workspaces,
    projects,
    teams,
    members,
    views,
    roles,
    invitations,
    statusUpdates,
    statusUpdateComments,
    projectProperties,
    milestones,
    activity,
    issues,
    notifications,
  ] = await Promise.all([
    client.from('workspaces').select('*').order('id'),
    client.from('projects').select('*').order('id'),
    client.from('teams').select('*').order('id'),
    client.from('members').select('*').order('id'),
    client.from('views').select('*').order('id'),
    client.from('roles').select('*').order('id'),
    client.from('invitations').select('*').order('created_at', {
      ascending: false,
    }),
    client.from('status_updates').select('*').order('created_at', {
      ascending: false,
    }),
    client.from('status_update_comments').select('*').order('timestamp'),
    client.from('project_properties').select('*'),
    client.from('milestones').select('*').order('id'),
    client.from('activity').select('*').order('date', { ascending: false }),
    client.from('issues').select('*').order('id'),
    client.from('notifications').select('*').order('created_at', {
      ascending: false,
    }),
  ])

  const check = (r: { error: unknown }) => {
    if (r.error) throw r.error
  }
  check(workspaces)
  check(projects)
  check(teams)
  check(members)
  for (const row of members.data ?? []) {
    const r = row as DbRow
    console.log(
      `[Supabase members row] id=${r.id} name=${r.name} supabase_user_id=${r.supabase_user_id ?? 'null'}`
    )
  }
  check(views)
  check(roles)
  check(invitations)
  check(statusUpdates)
  check(statusUpdateComments)
  check(projectProperties)
  check(milestones)
  check(activity)
  check(issues)
  check(notifications)

  const projectPropertiesByTeam: Record<
    string,
    ReturnType<typeof rowToProjectProperties>
  > = {}
  for (const r of projectProperties.data ?? []) {
    const row = r as DbRow
    projectPropertiesByTeam[row.team_id as string] = rowToProjectProperties(row)
  }

  return {
    workspaces: (workspaces.data ?? []).map((r) => rowToWorkspace(r as DbRow)),
    projects: (projects.data ?? []).map((r) => rowToProject(r as DbRow)),
    teams: (teams.data ?? []).map((r) => rowToTeam(r as DbRow)),
    members: (members.data ?? []).map((r) => rowToMember(r as DbRow)),
    views: (views.data ?? []).map((r) => rowToView(r as DbRow)),
    roles: (roles.data ?? []).map((r) => rowToRole(r as DbRow)),
    invitations: (invitations.data ?? []).map((r) =>
      rowToInvitation(r as DbRow)
    ),
    statusUpdates: (statusUpdates.data ?? []).map((r) =>
      rowToStatusUpdate(r as DbRow)
    ),
    statusUpdateComments: (statusUpdateComments.data ?? []).map((r) =>
      rowToStatusUpdateComment(r as DbRow)
    ),
    projectPropertiesByTeam,
    milestones: (milestones.data ?? []).map((r) => rowToMilestone(r as DbRow)),
    activity: (activity.data ?? []).map((r) => rowToActivity(r as DbRow)),
    issues: (issues.data ?? []).map((r) => rowToIssue(r as DbRow)),
    notifications: (notifications.data ?? []).map((r) =>
      rowToNotification(r as DbRow)
    ),
  }
}

export async function writeStoreSupabase(store: Store): Promise<void> {
  const client = getClient()

  const rows = storeToRows(store)
  const ordered = [
    { table: 'workspaces', rows: rows.workspaces, idColumn: 'id' as const },
    { table: 'roles', rows: rows.roles, idColumn: 'id' as const },
    { table: 'members', rows: rows.members, idColumn: 'id' as const },
    { table: 'teams', rows: rows.teams, idColumn: 'id' as const },
    { table: 'projects', rows: rows.projects, idColumn: 'id' as const },
    { table: 'views', rows: rows.views, idColumn: 'id' as const },
    { table: 'invitations', rows: rows.invitations, idColumn: 'id' as const },
    {
      table: 'project_properties',
      rows: rows.project_properties,
      idColumn: 'team_id' as const,
    },
    {
      table: 'status_updates',
      rows: rows.status_updates,
      idColumn: 'id' as const,
    },
    {
      table: 'status_update_comments',
      rows: rows.status_update_comments,
      idColumn: 'id' as const,
    },
    { table: 'milestones', rows: rows.milestones, idColumn: 'id' as const },
    { table: 'activity', rows: rows.activity, idColumn: 'id' as const },
    { table: 'issues', rows: rows.issues, idColumn: 'id' as const },
    {
      table: 'notifications',
      rows: rows.notifications,
      idColumn: 'id' as const,
    },
  ]

  for (const { table, rows: data, idColumn } of ordered) {
    const existing = await client.from(table).select(idColumn)
    if (existing.error) throw existing.error
    const keys = (existing.data ?? []).map((r: DbRow) => r[idColumn] as string)
    if (keys.length > 0) {
      const { error } = await client.from(table).delete().in(idColumn, keys)
      if (error) throw error
    }
    if (data.length > 0) {
      const { error } = await client.from(table).insert(data as never[])
      if (error) throw error
    }
  }
}

export async function ensureStoreRow(): Promise<void> {
  if (!isSupabaseConfigured() || !supabaseAdmin) return
  await supabaseAdmin.from('projects').select('id').limit(1).maybeSingle()
}
