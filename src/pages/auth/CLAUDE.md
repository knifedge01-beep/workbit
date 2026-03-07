# Auth (frontend) — gotchas

This folder owns **client-side** auth: Supabase browser client and token for API calls.

## Rules

- **Env:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. Never use service role or server secrets here.
- **Single client:** `supabaseClient.ts` creates one Supabase client and exposes `getSupabase()` and `getAccessToken()`. Use `getAccessToken()` when calling the API (Bearer token).
- **Guards:** Check `isAuthConfigured` before assuming auth is available. Handle `getSupabase()` / `getAccessToken()` returning `null`.
- **Logbit:** Init and auth-related logs go through Logbit; see `utils/errorHandling.ts` and `.cursor/skills/use-logbit/SKILL.md`.

Don’t add server-side auth logic or service-role usage here. API auth lives in `api/src/middleware/auth.ts`.
