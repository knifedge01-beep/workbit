import type { Request, Response } from 'express';
import * as teamsModel from '../models/teams.js';
import { getUserId } from '../middleware/auth.js';

const DEFAULT_USER_ID = 'current-user';
const DEFAULT_AUTHOR_NAME = 'You';

export async function getTeam(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const team = await teamsModel.getTeamById(teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json({ id: team.id, name: team.name });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getTeamProject(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const data = await teamsModel.getTeamProject(teamId);
    if (!data) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    const nodes = data.project.statusUpdates.nodes.map((u) => ({
      id: u.id,
      status: u.status,
      content: u.content,
      author: {
        id: u.authorId,
        name: u.authorName,
        avatarSrc: u.authorAvatarSrc,
      },
      createdAt: u.createdAt,
      commentCount: u.commentCount,
    }));
    res.json({
      team: data.team,
      project: {
        id: data.project.id,
        statusUpdates: { nodes },
        properties: data.project.properties,
        milestones: data.project.milestones,
        activity: data.project.activity,
      },
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getStatusUpdateComments(req: Request, res: Response) {
  try {
    const { teamId, updateId } = req.params;
    const comments = await teamsModel.getStatusUpdateComments(updateId);
    res.json(comments.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      authorAvatarSrc: c.authorAvatarSrc,
      content: c.content,
      timestamp: c.timestamp,
    })));
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function postStatusUpdate(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const { content, status } = req.body as { content?: string; status?: string };
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'content is required' });
      return;
    }
    const validStatus = status === 'at-risk' || status === 'off-track' ? status : 'on-track';
    const userId = getUserId(req, DEFAULT_USER_ID);
    const author = { id: userId, name: DEFAULT_AUTHOR_NAME, avatarSrc: undefined as string | undefined };
    const update = await teamsModel.addStatusUpdate(teamId, content, validStatus, author);
    res.status(201).json(update);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function postStatusUpdateComment(req: Request, res: Response) {
  try {
    const { teamId, updateId } = req.params;
    const { content } = req.body as { content?: string };
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'content is required' });
      return;
    }
    const authorName = req.user?.email ?? DEFAULT_AUTHOR_NAME;
    const comment = await teamsModel.addStatusUpdateComment(
      teamId,
      updateId,
      content,
      authorName,
      undefined
    );
    res.status(201).json(comment);
  } catch (e) {
    const err = e as Error;
    if (err.message === 'Update not found') res.status(404).json({ error: err.message });
    else res.status(500).json({ error: err.message });
  }
}

export async function patchProject(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const body = req.body as Record<string, unknown>;
    const properties = await teamsModel.updateProjectProperties(teamId, body);
    res.json(properties);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function postMilestone(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const body = req.body as { name?: string; targetDate?: string; description?: string };
    if (!body.name || typeof body.name !== 'string') {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    const milestone = await teamsModel.addMilestone(teamId, {
      name: body.name,
      targetDate: body.targetDate,
      description: body.description,
    });
    res.status(201).json(milestone);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function patchMilestone(req: Request, res: Response) {
  try {
    const { teamId, milestoneId } = req.params;
    const body = req.body as Record<string, unknown>;
    const milestone = await teamsModel.updateMilestone(teamId, milestoneId, body);
    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found' });
      return;
    }
    res.json(milestone);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getTeamViews(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const views = await teamsModel.getTeamViews(teamId);
    const { getStore } = await import('../models/store.js');
    const store = await getStore();
    const list = views.map((v) => {
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
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function getTeamLogs(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const first = req.query.first ? Number(req.query.first) : 50;
    const data = await teamsModel.getTeamLogs(teamId, first);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
