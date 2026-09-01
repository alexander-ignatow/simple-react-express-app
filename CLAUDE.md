# simple-react-express-app

Teaching project: React client + Express API that serves a random quote.

## Layout
- `client/` — Vite + React 19 + TypeScript, Tailwind v4, shadcn/ui. Alias `@/` → `client/src`.
- `server/` — Express 5 + TypeScript. `GET /quote` (Bearer auth), `GET /health`.
- npm workspaces at the root.

## Running it
- Both services: `./start.sh dev` (client 5173, server 3001)
- Server only: `cd server && npm run dev`
- Client only: `cd client && npm run dev`
- Docker: `docker compose up` (prod) / `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` (dev)

## Checks
- `npm test` from the root runs both suites
- `npm run build` from the root builds both
- Server lint is `tsc --noEmit`; client lint is eslint

## Conventions
See CONTRIBUTING.md. Named imports only, explicit return types, functional components.

## Gotchas
- `VITE_API_TOKEN` is intentionally visible in the client bundle. This repo teaches Docker
  env handling, not secret management. Do not "fix" it without being asked.
- Only `button` and `textarea` exist under `client/src/components/ui/`. Any other
  shadcn component must be added before it can be imported.
- `client/src/App.css` is unused Vite boilerplate.
