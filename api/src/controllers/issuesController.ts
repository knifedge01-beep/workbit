import type { Request, Response } from 'express';
import * as issuesModel from '../models/issues.js';
import { getStore } from '../models/store.js';

export async function getTeamIssues(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const filter = (req.query.filter as 'all' | 'active' | 'backlog') ?? 'all';
    const issues = await issuesModel.getTeamIssues(teamId, filter);
    const store = await getStore();
    const list = issues.map((i) => {
      const assignee = i.assigneeId ? store.members.find((m) => m.id === i.assigneeId) : null;
      return {
        id: i.id,
        title: i.title,
        assignee: assignee ? { id: assignee.id, name: assignee.name } : (i.assigneeName ? { id: '', name: i.assigneeName } : null),
        date: i.date,
        status: i.status,
      };
    });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

export async function updateIssue(req: Request, res: Response) {
  try {
    const { issueId } = req.params;
    const body = req.body as { status?: string; assigneeId?: string; assigneeName?: string };
    const issue = await issuesModel.updateIssue(issueId, body);
    if (!issue) {
      res.status(404).json({ error: 'Issue not found' });
      return;
    }
    res.json(issue);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
