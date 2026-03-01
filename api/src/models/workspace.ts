import { generateId } from './store.js'
import type { Project, Team, Member, View, Role, Invitation } from './types.js'
import * as dbProjects from '../db/projects.js'
import * as dbTeams from '../db/teams.js'
import * as dbMembers from '../db/members.js'
import * as dbViews from '../db/views.js'
import * as dbRoles from '../db/roles.js'
import * as dbInvitations from '../db/invitations.js'
import { insertTeam } from '../db/teams.js'

export async function getProjects(): Promise<Project[]> {
  return dbProjects.getProjects()
}

export async function getTeams(): Promise<Team[]> {
  return dbTeams.getTeams()
}

export async function getMembers(): Promise<Member[]> {
  return dbMembers.getMembers()
}

export async function getViews(): Promise<View[]> {
  return dbViews.getViewsWithoutTeamId()
}

export async function getRoles(): Promise<Role[]> {
  return dbRoles.getRoles()
}

export async function inviteMember(
  email: string,
  roleId?: string
): Promise<Invitation> {
  const inv: Invitation = {
    id: generateId(),
    email,
    roleId,
    createdAt: new Date().toISOString(),
  }
  await dbInvitations.insertInvitation(inv)
  return inv
}

export interface CreateMemberInput {
  name: string
  username: string
  status: string
  email?: string
  teamIds?: string[]
  uid?: string | null
  userAuthId?: string | null
  provisioned?: boolean
}

export async function createMember(input: CreateMemberInput): Promise<Member> {
  const authId = input.uid ?? input.userAuthId ?? null
  const isProvisioned = input.provisioned ?? Boolean(authId)

  const member: Member = {
    id: generateId(),
    name: input.name,
    username: input.username,
    avatarSrc: undefined,
    status: input.status,
    joined: new Date().toISOString(),
    teamIds: input.teamIds ?? [],
    uid: authId,
    provisioned: isProvisioned,
    userAuthId: authId,
  }

  await dbMembers.insertMember(member)

  if (member.teamIds.length > 0) {
    const teams = await dbTeams.getTeams()
    const teamsById = new Map(teams.map((t) => [t.id, t]))
    for (const teamId of member.teamIds) {
      const team = teamsById.get(teamId)
      if (team && !team.memberIds.includes(member.id)) {
        await dbTeams.updateTeam(teamId, {
          memberIds: [...team.memberIds, member.id],
        })
      }
    }
  }

  return member
}

export async function provisionMember(
  memberId: string,
  userAuthId: string
): Promise<Member> {
  const member = await dbMembers.getMemberById(memberId)
  if (!member) {
    throw new Error('Member not found')
  }

  if (member.provisioned && member.userAuthId === userAuthId) {
    return member
  }

  await dbMembers.updateMember(memberId, {
    provisioned: true,
    uid: userAuthId,
    userAuthId,
  })
  return { ...member, provisioned: true, uid: userAuthId, userAuthId }
}

export async function createTeam(input: {
  workspaceId: string
  name: string
}): Promise<Team> {
  const team: Team = {
    id: generateId(),
    name: input.name,
    workspaceId: input.workspaceId,
    projectId: null,
    memberIds: [],
  }
  await insertTeam(team)
  return team
}

export async function createProject(input: {
  name: string
  teamId: string
  status?: string
}): Promise<Project> {
  const team = await dbTeams.getTeamById(input.teamId)
  if (!team) {
    throw new Error('Team not found')
  }

  const project: Project = {
    id: generateId(),
    name: input.name,
    teamId: input.teamId,
    status: input.status ?? 'Active',
  }

  await dbProjects.insertProject(project)
  await dbTeams.updateTeam(input.teamId, { projectId: project.id })

  return project
}
