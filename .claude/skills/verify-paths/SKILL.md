---
name: verify-paths
description: Verify a change still works on all three run paths — plain npm, individual Docker containers, and Docker Compose. Use before committing anything that touches ports, env vars, Dockerfiles, nginx.conf, docker-compose*.yml, start.sh, or the auth contract. Not needed for changes confined to client/src or server/src logic, which the test suites cover.
---

# Verify the three run paths

Keeping all three paths working is the point of this repo. A change that only passes
`npm test` can still have broken two of them.

## 1. Checks (always)

```bash
npm test          # from root, fans out to both packages
npm run lint      # client eslint, server tsc --noEmit
npm run build
```

There is no root lockfile or root `node_modules`. If install is needed, do it per package
(`cd server && npm ci`, `cd client && npm ci`) — never `npm install` at the root.

## 2. Plain npm

```bash
cp .env.example .env   # if missing; API_TOKEN is required or start.sh exits
./start.sh             # dev
```

Confirm: client on `CLIENT_PORT`, server on `SERVER_PORT`, the Generate button is enabled
(a disabled "API Token Required" button means `VITE_API_TOKEN` did not reach the client),
and clicking it returns a quote. Ctrl+C stops both. Then `./start.sh prod` for the
build + preview path.

## 3. Docker Compose

Docker commands need approval — ask before running them, and say which one and why.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build   # dev overlay
docker compose up --build -d && docker compose ps && docker compose down    # production base
```

Confirm both services reach `healthy`. The client is gated on the server's `/health`
check, so a client stuck in `Created` usually means the server healthcheck is failing,
not the client.

Dev overlay maps host → container `5173` (Vite); the production base maps host → `8080`
(Nginx). If you changed one, check the other.

## 4. Individual containers

The commands are in `README.md` under the single-container section — run them from there
rather than reinventing the flags, and update the README if the flags changed.

Remember the production client bakes `VITE_API_URL` / `VITE_API_TOKEN` in as build ARGs.
Changing them requires `--build`, not a restart. If a token change appears to have no
effect, this is why.

## 5. Docs

If you touched a Dockerfile, `nginx.conf`, or either compose file, `DOCKER_LEARNING_GUIDE.md`
is part of the deliverable — its line-number tables go stale silently. Update it in the same
change, or run the `docs-sync` agent to find what drifted.
