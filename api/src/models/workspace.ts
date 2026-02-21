import { getStore, saveStore, generateId } from './store.js';
import type { Project, Team, Member, View, Role, Invitation, Store } from './types.js';

export async function getProjects(): Promise<Project[]> {
  const s = await getStore();
  return s.projects;
}

export async function getTeams(): Promise<Team[]> {
  const s = await getStore();
  return s.teams;
}

export async function getMembers(): Promise<Member[]> {
  const s = await getStore();
  return s.members;
}

export async function getViews(): Promise<View[]> {
  const s = await getStore();
  return s.views.filter((v) => !v.teamId);
}

export async function getRoles(): Promise<Role[]> {
  const s = await getStore();
  return s.roles;
}

export async function inviteMember(email: string, roleId?: string): Promise<Invitation> {
  const s = await getStore();
  const inv: Invitation = {
    id: generateId(),
    email,
    roleId,
    createdAt: new Date().toISOString(),
  };
  s.invitations.push(inv);
  await saveStore(s);
  return inv;
}
