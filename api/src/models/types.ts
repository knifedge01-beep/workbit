// Workspace entities
export interface Project {
  id: string;
  name: string;
  teamId: string;
  status: string;
}

export interface Team {
  id: string;
  name: string;
  projectId?: string;
  memberIds: string[];
}

export interface Member {
  id: string;
  name: string;
  username: string;
  avatarSrc?: string;
  status: string;
  joined: string;
  teamIds: string[];
}

export interface View {
  id: string;
  name: string;
  type: string;
  ownerId: string;
  teamId?: string;
}

export interface Role {
  id: string;
  role: string;
  memberCount: number;
  description: string;
}

export interface Invitation {
  id: string;
  email: string;
  roleId?: string;
  createdAt: string;
}

// Project status (team project)
export type ProjectStatus = 'on-track' | 'at-risk' | 'off-track';

export interface StatusUpdate {
  id: string;
  teamId: string;
  status: ProjectStatus;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatarSrc?: string;
  createdAt: string;
  commentCount: number;
}

export interface StatusUpdateComment {
  id: string;
  updateId: string;
  authorName: string;
  authorAvatarSrc?: string;
  content: string;
  timestamp: string;
}

export interface ProjectProperties {
  status: string;
  priority: string;
  leadId?: string;
  startDate?: string;
  endDate?: string;
  teamIds: string[];
  labelIds: string[];
}

export interface Milestone {
  id: string;
  teamId: string;
  name: string;
  progress: number;
  total: number;
  targetDate: string;
  description?: string;
}

export type ActivityIcon = 'milestone' | 'project';

export interface ActivityItem {
  id: string;
  teamId: string;
  icon: ActivityIcon;
  message: string;
  date: string;
}

// Issues
export interface Issue {
  id: string;
  title: string;
  assigneeId?: string;
  assigneeName?: string;
  date: string;
  status: string;
  teamId: string;
  projectId?: string;
}

// Notifications
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actorId: string;
  actorName: string;
  targetUrl?: string;
}

// Store shape (file or Supabase tables)
export interface Store {
  projects: Project[];
  teams: Team[];
  members: Member[];
  views: View[];
  roles: Role[];
  invitations: Invitation[];
  statusUpdates: StatusUpdate[];
  statusUpdateComments: StatusUpdateComment[];
  projectPropertiesByTeam: Record<string, ProjectProperties>;
  milestones: Milestone[];
  activity: ActivityItem[];
  issues: Issue[];
  notifications: Notification[];
}

export const EMPTY_STORE: Store = {
  projects: [],
  teams: [],
  members: [],
  views: [],
  roles: [],
  invitations: [],
  statusUpdates: [],
  statusUpdateComments: [],
  projectPropertiesByTeam: {},
  milestones: [],
  activity: [],
  issues: [],
  notifications: [],
};
