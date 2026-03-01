import { v4 as uuidv4 } from 'uuid'
import { isSupabaseConfigured } from '../utils/supabaseServer.js'

export { isSupabaseConfigured }

export function generateId(): string {
  return uuidv4()
}
