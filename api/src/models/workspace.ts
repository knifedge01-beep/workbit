import { getStore, saveStore, generateId } from './store.js'
import type { Project, Team, Member, View, Role, Invitation } from './types.js'

export async function getProjects(): Promise<Project[]> {
  const s = await getStore()
  return s.projects
}

export async function getTeams(): Promise<Team[]> {
  const s = await getStore()
  return s.teams
}

export async function getMembers(): Promise<Member[]> {
  const s = await getStore()
  return s.members
}

export async function getViews(): Promise<View[]> {
  const s = await getStore()
  return s.views.filter((v) => !v.teamId)
}

export async function getRoles(): Promise<Role[]> {
  const s = await getStore()
  return s.roles
}

export async function inviteMember(
  email: string,
  roleId?: string
): Promise<Invitation> {
  const s = await getStore()
  const inv: Invitation = {
    id: generateId(),
    email,
    roleId,
    createdAt: new Date().toISOString(),
  }
  s.invitations.push(inv)
  await saveStore(s)
  return inv
}

export interface CreateMemberInput {
  name: string
  username: string
  status: string
  /**
   * Optional email used for provisioning into Supabase auth.
   * This is not yet part of the Member model, but can be
   * captured via invitations or a future extension.
   */
  email?: string
  /**
   * Teams this member should belong to on creation.
   */
  teamIds?: string[]
  /**
   * Optional Supabase auth user id to link on creation.
   * If provided, the member will be marked provisioned.
   */
  uid?: string | null
  userAuthId?: string | null
  provisioned?: boolean
}

export async function createMember(input: CreateMemberInput): Promise<Member> {
  const s = await getStore()

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

  s.members.push(member)

  if (member.teamIds.length > 0) {
    const teamsById = new Map(s.teams.map((t) => [t.id, t]))
    for (const teamId of member.teamIds) {
      const team = teamsById.get(teamId)
      if (team && !team.memberIds.includes(member.id)) {
        team.memberIds.push(member.id)
      }
    }
  }

  await saveStore(s)
  return member
}

export async function provisionMember(
  memberId: string,
  userAuthId: string
): Promise<Member> {
  const s = await getStore()
  const member = s.members.find((m) => m.id === memberId)
  if (!member) {
    throw new Error('Member not found')
  }

  if (member.provisioned && member.userAuthId === userAuthId) {
    return member
  }

  member.provisioned = true
  member.uid = userAuthId
  member.userAuthId = userAuthId

  await saveStore(s)
  return member
}

export async function createProject(input: {
  name: string
  teamId: string
  status?: string
}): Promise<Project> {
  const s = await getStore()
  const team = s.teams.find((t) => t.id === input.teamId)
  if (!team) {
    throw new Error('Team not found')
  }

  const project: Project = {
    id: generateId(),
    name: input.name,
    teamId: input.teamId,
    status: input.status ?? 'Active',
  }

  s.projects.push(project)
  team.projectId = project.id
  await saveStore(s)

  return project
}
