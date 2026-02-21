import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';
import * as workspaceModel from '../models/workspace.js';
import * as teamsModel from '../models/teams.js';
import * as issuesModel from '../models/issues.js';
import * as meModel from '../models/me.js';
import { getStore } from '../models/store.js';

const DEFAULT_USER_ID = 'current-user';

function getUserId(context: { req?: { headers?: Record<string, string> } }): string {
  return context.req?.headers?.['x-user-id'] ?? DEFAULT_USER_ID;
}

// --- Shared types (id/name) ---
const idNameType = new GraphQLObjectType({
  name: 'IdName',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
  },
});

const idNameOptionalType = new GraphQLObjectType({
  name: 'IdNameOptional',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

// --- Project (workspace + team) ---
const projectType = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    team: { type: idNameType },
    status: { type: GraphQLNonNull(GraphQLString) },
  },
});

// --- Team (workspace list + single team) ---
const teamInListType = new GraphQLObjectType({
  name: 'TeamInList',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    memberCount: { type: GraphQLNonNull(GraphQLInt) },
    project: { type: idNameOptionalType },
  },
});

// --- Member ---
const memberTeamRefType = new GraphQLObjectType({
  name: 'MemberTeamRef',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    username: { type: GraphQLNonNull(GraphQLString) },
    avatarSrc: { type: GraphQLString },
    status: { type: GraphQLNonNull(GraphQLString) },
    joined: { type: GraphQLNonNull(GraphQLString) },
    teams: {
      type: GraphQLList(memberTeamRefType),
      resolve: (parent: { teams?: { id: string; name: string }[] }, _args: unknown, _context: unknown) => {
        return parent.teams ?? [];
      },
    },
  },
});

// --- View ---
const viewType = new GraphQLObjectType({
  name: 'View',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    owner: { type: idNameType },
  },
});

// --- Role ---
const roleType = new GraphQLObjectType({
  name: 'Role',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    role: { type: GraphQLNonNull(GraphQLString) },
    memberCount: { type: GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString },
  },
});

// --- Workspace ---
const workspaceType = new GraphQLObjectType({
  name: 'Workspace',
  fields: {
    projects: {
      type: GraphQLNonNull(GraphQLList(projectType)),
      resolve: async () => {
        const projects = await workspaceModel.getProjects();
        const store = await getStore();
        return projects.map((p) => {
          const team = store.teams.find((t) => t.id === p.teamId);
          return {
            id: p.id,
            name: p.name,
            team: team ? { id: team.id, name: team.name } : { id: p.teamId, name: p.teamId },
            status: p.status,
          };
        });
      },
    },
    teams: {
      type: GraphQLNonNull(GraphQLList(teamInListType)),
      resolve: async () => {
        const teams = await workspaceModel.getTeams();
        const store = await getStore();
        return teams.map((t) => {
          const project = t.projectId ? store.projects.find((p) => p.id === t.projectId) : undefined;
          return {
            id: t.id,
            name: t.name,
            memberCount: t.memberIds.length,
            project: project ? { id: project.id, name: project.name } : null,
          };
        });
      },
    },
    members: {
      type: GraphQLNonNull(GraphQLList(memberType)),
      resolve: async () => {
        const members = await workspaceModel.getMembers();
        const store = await getStore();
        return members.map((m) => {
          const teams = m.teamIds
            .map((tid) => store.teams.find((t) => t.id === tid))
            .filter(Boolean)
            .map((t) => ({ id: t!.id, name: t!.name }));
          return {
            id: m.id,
            name: m.name,
            username: m.username,
            avatarSrc: m.avatarSrc ?? null,
            status: m.status,
            joined: m.joined,
            teamIds: m.teamIds,
            teams,
          };
        });
      },
    },
    views: {
      type: GraphQLNonNull(GraphQLList(viewType)),
      resolve: async () => {
        const views = await workspaceModel.getViews();
        const store = await getStore();
        return views.map((v) => {
          const owner = store.members.find((m) => m.id === v.ownerId);
          return {
            id: v.id,
            name: v.name,
            type: v.type,
            owner: owner ? { id: owner.id, name: owner.name } : { id: v.ownerId, name: v.ownerId },
          };
        });
      },
    },
    roles: {
      type: GraphQLNonNull(GraphQLList(roleType)),
      resolve: async () => {
        const roles = await workspaceModel.getRoles();
        return roles.map((r) => ({ ...r, memberCount: r.memberCount }));
      },
    },
  },
});

// --- Issue (for team + me) ---
const issueType = new GraphQLObjectType({
  name: 'Issue',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    assignee: { type: idNameOptionalType },
    date: { type: GraphQLString },
    status: { type: GraphQLNonNull(GraphQLString) },
    team: { type: idNameOptionalType },
    project: { type: idNameOptionalType },
  },
});

// --- Status update & comments (team project) ---
const statusUpdateAuthorType = new GraphQLObjectType({
  name: 'StatusUpdateAuthor',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    avatarSrc: { type: GraphQLString },
  },
});

const statusUpdateType = new GraphQLObjectType({
  name: 'StatusUpdate',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    status: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    author: { type: statusUpdateAuthorType },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
    commentCount: { type: GraphQLInt },
  },
});

const statusUpdateCommentType = new GraphQLObjectType({
  name: 'StatusUpdateComment',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    authorName: { type: GraphQLString },
    authorAvatarSrc: { type: GraphQLString },
    content: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  },
});

const projectPropertiesType = new GraphQLObjectType({
  name: 'ProjectProperties',
  fields: {
    status: { type: GraphQLString },
    priority: { type: GraphQLString },
    leadId: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    teamIds: { type: GraphQLList(GraphQLString) },
    labelIds: { type: GraphQLList(GraphQLString) },
  },
});

const milestoneType = new GraphQLObjectType({
  name: 'Milestone',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    progress: { type: GraphQLInt },
    total: { type: GraphQLInt },
    targetDate: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const activityItemType = new GraphQLObjectType({
  name: 'ActivityItem',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    icon: { type: GraphQLString },
    message: { type: GraphQLString },
    date: { type: GraphQLString },
  },
});

const statusUpdatesConnectionType = new GraphQLObjectType({
  name: 'StatusUpdatesConnection',
  fields: {
    nodes: {
      type: GraphQLNonNull(GraphQLList(statusUpdateType)),
    },
  },
});

const teamProjectType = new GraphQLObjectType({
  name: 'TeamProject',
  fields: {
    id: { type: GraphQLID },
    statusUpdates: {
      type: statusUpdatesConnectionType,
      resolve: (parent: { nodes?: unknown[] }) => parent ?? { nodes: [] },
    },
    properties: { type: projectPropertiesType },
    milestones: { type: GraphQLList(milestoneType) },
    activity: { type: GraphQLList(activityItemType) },
  },
});

// --- Team (single by id) ---
const issueFilterEnum = new GraphQLEnumType({
  name: 'IssueFilter',
  values: {
    all: { value: 'all' },
    active: { value: 'active' },
    backlog: { value: 'backlog' },
  },
});

const teamType = new GraphQLObjectType({
  name: 'Team',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    project: {
      type: teamProjectType,
      resolve: async (parent: { id: string }) => {
        const data = await teamsModel.getTeamProject(parent.id);
        if (!data) return null;
        const nodes = data.project.statusUpdates.nodes.map((u) => ({
          id: u.id,
          status: u.status,
          content: u.content,
          author: { id: u.authorId, name: u.authorName, avatarSrc: u.authorAvatarSrc ?? null },
          createdAt: u.createdAt,
          commentCount: u.commentCount ?? 0,
        }));
        return {
          id: data.project.id,
          nodes,
          properties: data.project.properties,
          milestones: data.project.milestones,
          activity: data.project.activity,
        };
      },
    },
    issues: {
      type: GraphQLNonNull(GraphQLList(issueType)),
      args: {
        filter: { type: issueFilterEnum },
      },
      resolve: async (parent: { id: string }, args: { filter?: 'all' | 'active' | 'backlog' }) => {
        const issues = await issuesModel.getTeamIssues(parent.id, args.filter ?? 'all');
        const store = await getStore();
        return issues.map((i) => {
          const assignee = i.assigneeId ? store.members.find((m) => m.id === i.assigneeId) : null;
          const team = store.teams.find((t) => t.id === i.teamId);
          const project = i.projectId ? store.projects.find((p) => p.id === i.projectId) : null;
          return {
            id: i.id,
            title: i.title,
            assignee: assignee ? { id: assignee.id, name: assignee.name } : (i.assigneeName ? { id: '', name: i.assigneeName } : null),
            date: i.date,
            status: i.status,
            team: team ? { id: team.id, name: team.name } : null,
            project: project ? { id: project.id, name: project.name } : null,
          };
        });
      },
    },
    views: {
      type: GraphQLNonNull(GraphQLList(viewType)),
      resolve: async (parent: { id: string }) => {
        const views = await teamsModel.getTeamViews(parent.id);
        const store = await getStore();
        return views.map((v) => {
          const owner = store.members.find((m) => m.id === v.ownerId);
          return {
            id: v.id,
            name: v.name,
            type: v.type,
            owner: owner ? { id: owner.id, name: owner.name } : { id: v.ownerId, name: v.ownerId },
          };
        });
      },
    },
    logs: {
      type: new GraphQLObjectType({
        name: 'TeamLogsConnection',
        fields: {
          nodes: { type: GraphQLNonNull(GraphQLList(new GraphQLObjectType({
            name: 'LogEntry',
            fields: {
              id: { type: GraphQLID },
              action: { type: GraphQLString },
              actor: { type: idNameOptionalType },
              timestamp: { type: GraphQLString },
              details: { type: GraphQLString },
            },
          }))) },
        },
      }),
      args: { first: { type: GraphQLInt } },
      resolve: async (parent: { id: string }, args: { first?: number }) => {
        const data = await teamsModel.getTeamLogs(parent.id, args.first ?? 50);
        return data;
      },
    },
  },
});

// --- StatusUpdate (standalone for comments) ---
const statusUpdateQueryType = new GraphQLObjectType({
  name: 'StatusUpdateQuery',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    comments: {
      type: GraphQLNonNull(GraphQLList(statusUpdateCommentType)),
      resolve: async (parent: { id: string }) => {
        const comments = await teamsModel.getStatusUpdateComments(parent.id);
        return comments.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          authorAvatarSrc: c.authorAvatarSrc ?? null,
          content: c.content,
          timestamp: c.timestamp,
        }));
      },
    },
  },
});

// --- Notification (inbox) ---
const notificationActorType = new GraphQLObjectType({
  name: 'NotificationActor',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const notificationType = new GraphQLObjectType({
  name: 'Notification',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    type: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    read: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    actor: { type: notificationActorType },
    targetUrl: { type: GraphQLString },
  },
});

const notificationsConnectionType = new GraphQLObjectType({
  name: 'NotificationsConnection',
  fields: {
    nodes: { type: GraphQLNonNull(GraphQLList(notificationType)) },
  },
});

// --- Me ---
const meType = new GraphQLObjectType({
  name: 'Me',
  fields: {
    teams: {
      type: GraphQLNonNull(GraphQLList(idNameType)),
      resolve: async () => {
        const teams = await meModel.getNavTeams();
        return teams.map((t) => ({ id: t.id, name: t.name }));
      },
    },
    notifications: {
      type: notificationsConnectionType,
      args: { first: { type: GraphQLInt } },
      resolve: async (_parent: unknown, args: { first?: number }, context: { req?: { headers?: Record<string, string> } }) => {
        const userId = getUserId(context);
        const list = await meModel.getNotifications(userId, args.first ?? 50);
        return {
          nodes: list.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            read: n.read,
            createdAt: n.createdAt,
            actor: { id: n.actorId, name: n.actorName },
            targetUrl: n.targetUrl ?? null,
          })),
        };
      },
    },
    assignedIssues: {
      type: GraphQLNonNull(GraphQLList(issueType)),
      resolve: async (_parent: unknown, _args: unknown, context: { req?: { headers?: Record<string, string> } }) => {
        const userId = getUserId(context);
        const issues = await issuesModel.getMyIssues(userId);
        const store = await getStore();
        return issues.map((i) => ({
          id: i.id,
          title: i.title,
          assignee: i.assigneeName ? { id: i.assigneeId ?? '', name: i.assigneeName } : null,
          date: i.date,
          status: i.status,
          team: (() => {
            const t = store.teams.find((x) => x.id === i.teamId);
            return t ? { id: t.id, name: t.name } : null;
          })(),
          project: (() => {
            const p = i.projectId && store.projects.find((x) => x.id === i.projectId);
            return p ? { id: p.id, name: p.name } : null;
          })(),
        }));
      },
    },
  },
});

// --- Query ---
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    workspace: {
      type: GraphQLNonNull(workspaceType),
      resolve: () => ({}),
    },
    team: {
      type: teamType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_parent: unknown, args: Record<string, unknown>) => {
        const id = args.id as string;
        const team = await teamsModel.getTeamById(id);
        return team ? { id: team.id, name: team.name } : null;
      },
    },
    me: {
      type: GraphQLNonNull(meType),
      resolve: () => ({}),
    },
    statusUpdate: {
      type: statusUpdateQueryType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_parent: unknown, args: Record<string, unknown>) => {
        const id = args.id as string;
        const store = await getStore();
        const update = store.statusUpdates.find((u) => u.id === id);
        return update ? { id: update.id } : null;
      },
    },
  },
});

export const schema = new GraphQLSchema({ query: queryType });
