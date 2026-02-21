import type { Request, Response } from 'express';
import * as workspaceModel from '../models/workspace.js';
import { getStore } from '../models/store.js';

function sendError(res: Response, err: unknown, status = 500) {
  res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const store = await getStore();
    const list = store.projects.map((p) => {
      const team = store.teams.find((t) => t.id === p.teamId);
      return {
        id: p.id,
        name: p.name,
        team: team ? { id: team.id, name: team.name } : { id: p.teamId, name: p.teamId },
        status: p.status,
      };
    });
    res.json(list);
  } catch (e) {
    sendError(res, e);
  }
}

export async function getTeams(_req: Request, res: Response) {
  try {
    const store = await getStore();
    const list = store.teams.map((t) => {
      const project = t.projectId ? store.projects.find((p) => p.id === t.projectId) : undefined;
      return {
        id: t.id,
        name: t.name,
        memberCount: t.memberIds.length,
        project: project ? { id: project.id, name: project.name } : null,
      };
    });
    res.json(list);
  } catch (e) {
    sendError(res, e);
  }
}

export async function getMembers(_req: Request, res: Response) {
  try {
    const store = await getStore();
    const list = store.members.map((m) => {
      const teamNames = m.teamIds
        .map((tid) => store.teams.find((t) => t.id === tid)?.name)
        .filter(Boolean) as string[];
      return {
        id: m.id,
        name: m.name,
        username: m.username,
        avatarSrc: m.avatarSrc,
        status: m.status,
        joined: m.joined,
        teams: teamNames.length ? teamNames.join(', ') : '—',
      };
    });
    res.json(list);
  } catch (e) {
    sendError(res, e);
  }
}

export async function inviteMember(req: Request, res: Response) {
  try {
    const { email, roleId } = req.body as { email?: string; roleId?: string };
    if (!email || typeof email !== 'string') {
      sendError(res, 'email is required', 400);
      return;
    }
    const invitation = await workspaceModel.inviteMember(email, roleId);
    res.status(201).json(invitation);
  } catch (e) {
    sendError(res, e);
  }
}

export async function getViews(_req: Request, res: Response) {
  try {
    const store = await getStore();
    const workspaceViews = store.views.filter((v) => !v.teamId);
    const list = workspaceViews.map((v) => {
      const owner = store.members.find((m) => m.id === v.ownerId);
      return {
        id: v.id,
        name: v.name,
        type: v.type,
        owner: owner ? { id: owner.id, name: owner.name } : { id: v.ownerId, name: v.ownerId },
      };
    });
    res.json(list);
  } catch (e) {
    sendError(res, e);
  }
}

export async function getRoles(_req: Request, res: Response) {
  try {
    const store = await getStore();
    res.json(store.roles.map((r) => ({ ...r, memberCount: r.memberCount })));
  } catch (e) {
    sendError(res, e);
  }
}
