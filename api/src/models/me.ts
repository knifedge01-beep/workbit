import { getStore } from './store.js';
import type { Team, Notification } from './types.js';

export async function getNavTeams(): Promise<Team[]> {
  const s = await getStore();
  return s.teams;
}

export async function getNotifications(userId: string, first = 50): Promise<Notification[]> {
  const s = await getStore();
  return s.notifications
    .filter((n) => n.actorId === userId || true) // in real app filter by recipient
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, first);
}
