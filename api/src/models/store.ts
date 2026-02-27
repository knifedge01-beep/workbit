import { v4 as uuidv4 } from 'uuid'
import { readStore, writeStore } from '../utils/fileStore.js'
import {
  readStoreSupabase,
  writeStoreSupabase,
  ensureStoreRow,
} from '../utils/supabaseStore.js'
import { isSupabaseConfigured } from '../utils/supabaseServer.js'
import { type Store, EMPTY_STORE } from './types.js'

let cache: Store | null = null

async function readBackend(): Promise<Store> {
  if (isSupabaseConfigured()) return readStoreSupabase()
  return readStore<Store>()
}

async function writeBackend(store: Store): Promise<void> {
  if (isSupabaseConfigured()) {
    await writeStoreSupabase(store)
    return
  }
  await writeStore(store)
}

function normalize(store: Partial<Store>): Store {
  return {
    workspaces: store.workspaces ?? EMPTY_STORE.workspaces,
    projects: store.projects ?? EMPTY_STORE.projects,
    teams: store.teams ?? EMPTY_STORE.teams,
    members: store.members ?? EMPTY_STORE.members,
    views: store.views ?? EMPTY_STORE.views,
    roles: store.roles ?? EMPTY_STORE.roles,
    invitations: store.invitations ?? EMPTY_STORE.invitations,
    statusUpdates: store.statusUpdates ?? EMPTY_STORE.statusUpdates,
    statusUpdateComments:
      store.statusUpdateComments ?? EMPTY_STORE.statusUpdateComments,
    projectPropertiesByTeam:
      store.projectPropertiesByTeam ?? EMPTY_STORE.projectPropertiesByTeam,
    milestones: store.milestones ?? EMPTY_STORE.milestones,
    activity: store.activity ?? EMPTY_STORE.activity,
    issues: store.issues ?? EMPTY_STORE.issues,
    notifications: store.notifications ?? EMPTY_STORE.notifications,
  }
}

async function load(): Promise<Store> {
  if (cache) return cache
  if (isSupabaseConfigured()) await ensureStoreRow()
  cache = normalize(await readBackend())
  return cache
}

export async function getStore(): Promise<Store> {
  return load()
}

export async function saveStore(store: Store): Promise<void> {
  cache = store
  await writeBackend(store)
}

export { isSupabaseConfigured }

export function generateId(): string {
  return uuidv4()
}
