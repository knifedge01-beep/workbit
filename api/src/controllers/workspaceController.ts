import type { Request, Response } from 'express'
import * as workspaceModel from '../models/workspace.js'
import { getStore } from '../models/store.js'
import {
  findSupabaseUserByEmail,
  createSupabaseUserForMember,
} from '../utils/supabaseUsers.js'

function sendError(res: Response, err: unknown, status = 500) {
  res
    .status(status)
    .json({ error: err instanceof Error ? err.message : String(err) })
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const store = await getStore()
    const list = store.projects.map((p) => {
      const team = store.teams.find((t) => t.id === p.teamId)
      return {
        id: p.id,
        name: p.name,
        team: team
          ? { id: team.id, name: team.name }
          : { id: p.teamId, name: p.teamId },
        status: p.status,
      }
    })
    res.json(list)
  } catch (e) {
    sendError(res, e)
  }
}

export async function getTeams(_req: Request, res: Response) {
  try {
    const store = await getStore()
    const list = store.teams.map((t) => {
      const project = t.projectId
        ? store.projects.find((p) => p.id === t.projectId)
        : undefined
      return {
        id: t.id,
        name: t.name,
        memberCount: t.memberIds.length,
        project: project ? { id: project.id, name: project.name } : null,
      }
    })
    res.json(list)
  } catch (e) {
    sendError(res, e)
  }
}

export async function getMembers(_req: Request, res: Response) {
  try {
    const store = await getStore()
    const list = store.members.map((m) => {
      const uid = m.uid ?? m.userAuthId ?? null
      console.log(
        `[Members] member id=${m.id} name=${m.name} uid=${uid ?? 'null'} userAuthId=${m.userAuthId ?? 'null'}`
      )
      const teamNames = m.teamIds
        .map((tid) => store.teams.find((t) => t.id === tid)?.name)
        .filter(Boolean) as string[]
      return {
        id: m.id,
        name: m.name,
        username: m.username,
        avatarSrc: m.avatarSrc,
        status: m.status,
        joined: m.joined,
        provisioned: m.provisioned,
        uid,
        teams: teamNames.length ? teamNames.join(', ') : '—',
      }
    })
    res.json(list)
  } catch (e) {
    sendError(res, e)
  }
}

export async function inviteMember(req: Request, res: Response) {
  try {
    const { email, roleId } = req.body as { email?: string; roleId?: string }
    if (!email || typeof email !== 'string') {
      sendError(res, 'email is required', 400)
      return
    }
    const invitation = await workspaceModel.inviteMember(email, roleId)
    res.status(201).json(invitation)
  } catch (e) {
    sendError(res, e)
  }
}

export async function createMember(req: Request, res: Response) {
  try {
    const { name, username, status, teamIds, email } = req.body as {
      name?: string
      username?: string
      status?: string
      teamIds?: string[]
      email?: string
    }

    if (!name || typeof name !== 'string') {
      sendError(res, 'name is required', 400)
      return
    }

    if (!username || typeof username !== 'string') {
      sendError(res, 'username is required', 400)
      return
    }

    if (!email || typeof email !== 'string') {
      sendError(res, 'email is required', 400)
      return
    }

    const memberStatus =
      typeof status === 'string' && status ? status : 'Member'

    let authUserId: string | null = null
    try {
      const existing = await findSupabaseUserByEmail(email)
      const user = existing ?? (await createSupabaseUserForMember(email))
      authUserId = user?.id ?? null
    } catch {
      authUserId = null
    }

    const member = await workspaceModel.createMember({
      name,
      username,
      status: memberStatus,
      email,
      teamIds: Array.isArray(teamIds) ? teamIds : [],
      uid: authUserId,
      userAuthId: authUserId,
      provisioned: Boolean(authUserId),
    })

    res.status(201).json(member)
  } catch (e) {
    sendError(res, e)
  }
}

export async function provisionMember(req: Request, res: Response) {
  try {
    const { memberId } = req.params as { memberId: string }
    const { email } = req.body as { email?: string }

    if (!memberId) {
      sendError(res, 'memberId is required', 400)
      return
    }

    if (!email || typeof email !== 'string') {
      sendError(res, 'email is required', 400)
      return
    }

    const existing = await findSupabaseUserByEmail(email)
    const user = existing ?? (await createSupabaseUserForMember(email))

    if (!user || !user.id) {
      sendError(res, 'Failed to resolve Supabase user', 500)
      return
    }

    const member = await workspaceModel.provisionMember(memberId, user.id)

    res.status(200).json(member)
  } catch (e) {
    sendError(res, e)
  }
}

export async function getViews(_req: Request, res: Response) {
  try {
    const store = await getStore()
    const workspaceViews = store.views.filter((v) => !v.teamId)
    const list = workspaceViews.map((v) => {
      const owner = store.members.find((m) => m.id === v.ownerId)
      return {
        id: v.id,
        name: v.name,
        type: v.type,
        owner: owner
          ? { id: owner.id, name: owner.name }
          : { id: v.ownerId, name: v.ownerId },
      }
    })
    res.json(list)
  } catch (e) {
    sendError(res, e)
  }
}

export async function getRoles(_req: Request, res: Response) {
  try {
    const store = await getStore()
    res.json(store.roles.map((r) => ({ ...r, memberCount: r.memberCount })))
  } catch (e) {
    sendError(res, e)
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const { name, teamId, status } = req.body as {
      name?: string
      teamId?: string
      status?: string
    }

    if (!name || typeof name !== 'string') {
      sendError(res, 'name is required', 400)
      return
    }

    if (!teamId || typeof teamId !== 'string') {
      sendError(res, 'teamId is required', 400)
      return
    }

    const store = await getStore()
    const team = store.teams.find((t) => t.id === teamId)
    if (!team) {
      sendError(res, 'Team not found', 404)
      return
    }

    const project = await workspaceModel.createProject({ name, teamId, status })

    res.status(201).json({
      id: project.id,
      name: project.name,
      team: { id: team.id, name: team.name },
      status: project.status,
    })
  } catch (e) {
    sendError(res, e)
  }
}
