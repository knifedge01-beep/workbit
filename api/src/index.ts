import './loadEnv.js'
import express, { type Request } from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './graphql/schema.js'
import { optionalAuth, requireAuthWhenConfigured } from './middleware/auth.js'
import { workspaceRoutes } from './routes/workspace.js'
import { workspacesRoutes } from './routes/workspaces.js'
import { teamsRoutes } from './routes/teams.js'
import { issuesRoutes } from './routes/issues.js'
import { meRoutes } from './routes/me.js'
import { authRoutes } from './routes/auth.js'
import { seedIfEmpty } from './utils/seed.js'
import { isSupabaseConfigured } from './utils/supabaseServer.js'

const DEFAULT_PORT = 3001
const API_PREFIX = '/api/v1'

const app = express()
app.use(cors())
app.use(express.json())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: (req: Request) => ({ req }),
  })
)

app.use(API_PREFIX, optionalAuth)
app.use(API_PREFIX, requireAuthWhenConfigured)
app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/workspaces`, workspacesRoutes)
app.use(`${API_PREFIX}/workspace`, workspaceRoutes)
app.use(`${API_PREFIX}/teams`, teamsRoutes)
app.use(`${API_PREFIX}/issues`, issuesRoutes)
app.use(`${API_PREFIX}/me`, meRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

async function start() {
  const port = Number(process.env.PORT) || DEFAULT_PORT
  const usingSupabase = isSupabaseConfigured()
  console.log(
    `[Store] Using ${usingSupabase ? 'Supabase' : 'file (data.json)'}. SUPABASE_URL set: ${Boolean(process.env.SUPABASE_URL)}. SUPABASE_SERVICE_ROLE_KEY set: ${Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}.`
  )
  const seeded = await seedIfEmpty()
  if (seeded) console.log('Seeded default data')
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
