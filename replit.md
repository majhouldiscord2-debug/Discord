# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/                  # Deployable applications
│   ├── api-server/             # Express API server (port via $PORT, preview path /api)
│   ├── discord-clone/          # React + Vite frontend (preview path /)
│   └── mockup-sandbox/         # Component preview server for design (preview path /__mockup)
├── discord-ui-standalone/      # Standalone Discord UI (no API dependency, uses mock data)
├── lib/                        # Shared libraries
│   ├── api-spec/               # OpenAPI spec + Orval codegen config
│   ├── api-client-react/       # Generated React Query hooks
│   ├── api-zod/                # Generated Zod schemas from OpenAPI
│   └── db/                     # Drizzle ORM schema + DB connection
├── scripts/                    # Utility scripts
├── attached_assets/            # Uploaded image files (kept for reference)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Key Notes

- **White screen fix**: `artifacts/discord-clone/src/lib/api.ts` uses `fetchWithRetry` with exponential backoff for `getAuthStatus()`. This prevents a blank screen when the API server hasn't fully started yet on cold boot.
- **Error boundary**: `artifacts/discord-clone/src/main.tsx` wraps the app in an `ErrorBoundary` that shows a fallback UI instead of a white screen on React errors.
- **No @assets alias**: The `@assets` alias pointing to `attached_assets/` has been removed from `vite.config.ts`. No source file imports from that folder.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`)
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in `references`

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Packages

### `artifacts/discord-clone` (`@workspace/discord-clone`)

React + Vite frontend styled as a Discord dashboard ("Nexus Obsidian"). Talks to `api-server` at `/api`.

- Entry: `src/main.tsx` with `ErrorBoundary` wrapper
- Auth: `src/hooks/useDiscord.tsx` — handles token login, loads guilds/channels/relationships
- API: `src/lib/api.ts` — all fetch helpers, `fetchWithRetry` for startup resilience
- Pages: `Login`, `Home`, `Tools`, `Logs`, `Quests`
- No direct `attached_assets` imports; Discord CDN URLs used for avatars/icons

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- Routes: mounted at `/api`
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `discord-ui-standalone` (standalone)

Standalone Discord UI using mock data. No API dependency. Useful for pure UI development without the backend.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Tables: `discordAuth`, `toolSettings`.

Production migrations handled by Replit when publishing. Dev: `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec + Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` / `lib/api-client-react`

Auto-generated from OpenAPI spec. Re-run codegen after spec changes.

### `scripts` (`@workspace/scripts`)

Utility scripts. Run via `pnpm --filter @workspace/scripts run <script>`.
