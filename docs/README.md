# Docs

Documentation for the Workbit project.

## Data & API

- **GraphQL (reads):** The frontend uses **Relay** for all GraphQL fetch. Run `npm run relay` after adding or changing queries. See `schema.graphql` and `src/relay/`.
- **REST (writes):** Mutations (create/update/delete) use REST as per [API_AND_SERVICES_SPEC.md](./API_AND_SERVICES_SPEC.md).
- **Env:** Set `VITE_GRAPHQL_URL` (see `.env.example`) when a GraphQL server is available.

## Design System

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** – Reference for `src/design-system` components (imports, props, usage).

### Using in Cursor

To give the AI consistent design-system guidance:

1. **Reference in chat:** Use `@docs/DESIGN_SYSTEM.md` when asking for UI or component work.
2. **Cursor rules:** Add a rule that says to prefer components and APIs from `docs/DESIGN_SYSTEM.md` when building or editing UI.
3. **.cursorrules / AGENTS.md:** Mention that design system usage is documented in `docs/DESIGN_SYSTEM.md`.

This keeps imports, prop names, and patterns aligned with the design system.
