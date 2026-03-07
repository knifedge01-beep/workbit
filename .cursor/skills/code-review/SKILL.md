# Code review

Use this skill when reviewing PRs, diffs, or existing code. Ensures consistency and catches common issues.

## Checklist

1. **Structure & naming**  
   Matches project layout (see root `CLAUDE.md` and `.cursor/skills/project-structure/SKILL.md`): correct directories, PascalCase for components, camelCase for utils/hooks, barrel exports where applicable.

2. **Design system**  
   UI uses `src/design-system` components and theme; no one-off styles for things the design system already provides. See `.cursor/skills/use-design-system/SKILL.md`.

3. **Errors & logging**  
   Async paths and API errors use Logbit/helpers: frontend `logError`, `handleAsync` from `src/utils/errorHandling.ts`; API `logApiError`/`logApiWarn` from `api/src/utils/log.ts`. See `.cursor/skills/use-logbit/SKILL.md`.

4. **API layer**  
   Controllers → models → db; no business logic in routes or in `db/`. REST for writes via `src/api/client.ts`; imports in API use `.js` extension.

5. **Types**  
   TypeScript strict; exported types for cross-module use; no `any` unless justified.

6. **Risky areas**  
   Changes in auth, billing, or migrations: confirm local `CLAUDE.md` in that directory was considered.

Report: list what's good, then issues by severity (blocking / should-fix / nit).
