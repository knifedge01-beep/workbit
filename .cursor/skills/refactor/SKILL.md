# Refactor playbook

Use when refactoring a feature or module. Keeps behavior intact and structure aligned with the repo.

## Steps

1. **Scope**  
   Identify the module or flow. Read root `CLAUDE.md` and any local `CLAUDE.md` in that area (e.g. `src/pages/auth/`, `api/src/db/`).

2. **Dependencies**  
   List callers and callees. Ensure you don't break: barrel exports, route definitions, API contract (see `.cursor/docs/API_AND_SERVICES_SPEC.md`).

3. **Layers**  
   - Frontend: pages → components/hooks → api/client, utils, design-system.  
   - API: routes → controllers → models → db.  
   Move logic toward the correct layer; don't put domain logic in routes or db.

4. **Naming & files**  
   Follow `.cursor/skills/project-structure/SKILL.md`: file names, barrel updates, relative imports. Design system and Logbit usage as per their skills.

5. **Verify**  
   After refactor: build (`npm run build`), lint (`npm run lint`), format (`npm run format`). This project has no test suite yet; do a quick manual smoke check of the affected flow.

6. **Document**  
   If you changed contracts or non-obvious behavior, update `docs/` or a local CLAUDE.md.
