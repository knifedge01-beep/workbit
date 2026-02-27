import { getStore, saveStore, generateId } from './store.js'
import type { Workspace } from './types.js'

export async function getWorkspacesByMemberId(
  memberId: string
): Promise<Workspace[]> {
  const store = await getStore()
  return store.workspaces.filter((w) => w.memberIds.includes(memberId))
}

export async function createWorkspace(input: {
  name: string
  slug: string
  region?: string
  memberId: string
}): Promise<Workspace> {
  const store = await getStore()

  const existing = store.workspaces.find(
    (w) => w.slug.toLowerCase() === input.slug.toLowerCase()
  )
  if (existing) {
    const error = new Error('Workspace URL is already reserved')
    // Attach a flag so controllers can choose a specific HTTP status.
    ;(error as Error & { code?: string }).code = 'WORKSPACE_SLUG_TAKEN'
    throw error
  }

  const workspace: Workspace = {
    id: generateId(),
    name: input.name,
    slug: input.slug,
    region: input.region ?? 'us',
    memberIds: [input.memberId],
  }

  store.workspaces.push(workspace)
  await saveStore(store)

  return workspace
}
