# Docker learning guide

This project is designed for students to run the same React and Express application in three ways: directly with npm, with individual Docker containers, and with Docker Compose. This guide explains the Dockerfiles and Compose files line by line.

## The big picture

Both Dockerfiles use multi-stage builds: they provide a convenient development target and a smaller production target.

```text
Server: dependencies ──> development
                  └──> build ──> production

Client: dependencies ──> development
                  └──> build ──> production (Nginx)
```

`EXPOSE` documents a container port. It does not publish that port to your computer; Docker Compose or `docker run -p` does that.

## Server Dockerfile

File: [server/Dockerfile](server/Dockerfile)

| Lines | Instruction | Why it is here |
| --- | --- | --- |
| 1 | `FROM node:24-alpine3.21 AS dependencies` | Starts a small Node 24 Alpine image and names this stage `dependencies`. Node is needed to install packages and compile TypeScript. |
| 3 | `WORKDIR /app` | Makes `/app` the working directory for later commands. |
| 5 | `COPY package.json package-lock.json ./` | Copies dependency manifests before source code. Docker can reuse the dependency layer until one of these files changes. |
| 6 | `RUN npm ci --ignore-scripts && chown -R node:node /app` | `npm ci` installs exactly the lockfile versions. `--ignore-scripts` avoids package install hooks, reducing supply-chain risk. `chown` lets the built-in non-root `node` user use the files. |
| 8 | `FROM dependencies AS development` | Creates the development target from the installed dependency stage. |
| 10 | `COPY --chown=node:node . .` | Copies the server source and gives ownership to the non-root user. |
| 12 | `USER node` | Runs development commands without root privileges. |
| 14 | `EXPOSE 3001` | Documents the API port. |
| 16 | `CMD ["npm", "run", "dev"]` | Starts `tsx watch`, which reloads the server when source files change. |
| 18 | `FROM dependencies AS build` | Starts a separate build stage that includes development packages such as TypeScript. |
| 20 | `COPY --chown=node:node . .` | Copies source code for compilation. |
| 22 | `USER node` | Compiles without root privileges. |
| 24 | `RUN npm run build` | Compiles TypeScript from `src/` into JavaScript in `dist/`. |
| 26 | `FROM node:24-alpine3.21 AS production` | Starts a fresh runtime image. It does not inherit TypeScript source or development tooling. |
| 28 | `WORKDIR /app` | Sets the runtime application folder. |
| 30 | `ENV NODE_ENV=production` | Enables production behavior in Node and Express. |
| 32 | `RUN addgroup ... && adduser ...` | Creates a dedicated runtime user with a fixed UID/GID, useful in restricted container platforms. |
| 34 | `COPY package.json package-lock.json ./` | Copies the manifests needed for a production-only install. |
| 35 | `RUN npm ci --omit=dev --ignore-scripts ...` | Installs only runtime dependencies, cleans npm's cache, and gives the runtime user access to `/app`. |
| 37 | `COPY --from=build --chown=nodejs:nodejs /app/dist ./dist` | Copies only compiled JavaScript from the build stage. Source TypeScript is omitted from the final image. |
| 39 | `USER nodejs` | Runs Express without root privileges. |
| 41 | `EXPOSE 3001` | Documents the production API port. |
| 43 | `CMD ["node", "dist/index.js"]` | Starts compiled JavaScript directly: no TypeScript compiler and no hot reload tooling. |

The production server image is therefore smaller and has fewer runtime dependencies than the development image.

## Client Dockerfile

File: [client/Dockerfile](client/Dockerfile)

| Lines | Instruction | Why it is here |
| --- | --- | --- |
| 1 | `FROM node:24-alpine AS dependencies` | Starts a small Node image for installing React and Vite dependencies. |
| 3 | `WORKDIR /app` | Sets the application directory. |
| 5 | `COPY package.json package-lock.json ./` | Lets Docker cache the dependency-install layer. |
| 6 | `RUN npm ci && chown -R node:node /app` | Installs exact locked dependencies and gives the non-root user access. Install scripts are allowed because Vite tooling such as esbuild may need them to obtain the correct native binary. |
| 8 | `FROM dependencies AS development` | Creates the Vite development image. |
| 10 | `COPY --chown=node:node . .` | Copies client source under non-root ownership. |
| 12 | `USER node` | Runs Vite without root privileges. |
| 14 | `EXPOSE 5173` | Documents Vite's development-server port. |
| 16 | `CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]` | Runs Vite. `0.0.0.0` allows Docker port forwarding to reach it; the explicit port is predictable. |
| 18 | `FROM dependencies AS build` | Starts a build stage containing Vite and TypeScript. |
| 20–21 | `ARG VITE_API_URL` and `ARG VITE_API_TOKEN` | Declares values passed during `docker build --build-arg ...`. The client requires `VITE_API_TOKEN`; it has no token fallback in its source code. |
| 23–24 | `ENV VITE_API_URL=...` and `ENV VITE_API_TOKEN=...` | Makes build arguments visible to Vite while it creates the browser bundle. `VITE_*` values are visible to browser users, so this token is deliberately only a demo value. |
| 26 | `COPY . .` | Copies client source code. |
| 27 | `RUN npm run build` | Produces optimized static files in `dist/`. |
| 29 | `FROM nginx:1.29-alpine AS production` | Uses a fresh, small Nginx image. A static React app does not need Node, npm, Vite, or `node_modules` at runtime. |
| 31 | `COPY nginx.conf /etc/nginx/conf.d/default.conf` | Installs this project's Nginx configuration. |
| 32 | `COPY --from=build /app/dist /usr/share/nginx/html` | Copies only built HTML, JavaScript, CSS, and assets. |
| 34 | `EXPOSE 8080` | Documents Nginx's internal production port. |

There is no client production `CMD`: the official Nginx image already starts Nginx in the foreground.

The related [client/nginx.conf](client/nginx.conf) serves the React app, returns `index.html` for client-side routes, provides `/health`, and sets basic security and cache headers.

## Compose files

- [docker-compose.yml](docker-compose.yml) is the complete production configuration.
- [docker-compose.dev.yml](docker-compose.dev.yml) overrides only the parts that change for development.

Run development mode by combining the files:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Run production mode with the base file:

```bash
docker compose up --build -d
```

### Production configuration

| Lines | Configuration | Why it is here |
| --- | --- | --- |
| 1 | `name: student-docker-demo` | Gives Docker-created resources predictable names. |
| 3 | `services:` | Begins the list of managed containers. |
| 4 | `server:` | Defines the Express API. Other containers can reach it through Docker's internal hostname `server`. |
| 5–7 | `build` / `context: ./server` / `target: production` | Builds the server from its production Dockerfile stage. |
| 8–12 | `environment` | Sets the internal API port, production mode, shared demo token, and allowed browser origin. `${VALUE:-default}` reads `.env` or shell values and otherwise uses the shown fallback. |
| 13–14 | `"${SERVER_PORT:-3001}:3001"` | Publishes the host API port to the server container's fixed internal port `3001`. |
| 15–21 | `healthcheck` | Uses Node's built-in `fetch` inside the server container to call `/health`; Docker retries this health test before treating the API as ready. |
| 22 | `restart: unless-stopped` | Restarts the production API after a crash or Docker restart unless explicitly stopped. |
| 24 | `client:` | Defines the React frontend container. |
| 25–27 | `build` / `context: ./client` / `target: production` | Builds the static client and serves it through the production Nginx stage. |
| 28–30 | `args` | Supplies Vite build values. The browser-facing API URL must use `localhost`, not `server`, because browser JavaScript runs outside Docker. |
| 31–32 | `"${CLIENT_PORT:-5173}:8080"` | Publishes the host client port to Nginx's internal port `8080`. |
| 33–35 | `depends_on: condition: service_healthy` | Delays client startup until the API is healthy. |
| 36–41 | client `healthcheck` | Calls the Nginx `/health` endpoint from inside the client container. |
| 42 | `restart: unless-stopped` | Restarts the production frontend when appropriate. |

### Development override

When both Compose files are supplied, Compose merges settings for services with the same name.

| Lines | Configuration | Why it is here |
| --- | --- | --- |
| 1–2 | `services: server:` | Selects the server service defined in the production file. |
| 3–4 | `build: target: development` | Switches the server to the development Dockerfile stage. |
| 5–6 | `NODE_ENV: development` | Overrides only production mode. Base values such as `PORT` and `API_TOKEN` remain after the merge. |
| 7 | `command: npm run dev` | Explicitly runs the hot-reload server command. It matches the development Dockerfile default and makes Compose's intent easy to see. |
| 8–10 | `./server:/app` and `server_node_modules:/app/node_modules` | Bind-mounts source so edits reload immediately. The named `node_modules` volume prevents the bind mount from hiding the Linux dependencies installed in the image. |
| 11 | `restart: "no"` | Development failures should stay visible instead of restarting endlessly. |
| 13 | `client:` | Selects the base client service. |
| 14–15 | `build: target: development` | Switches the client from Nginx to the Vite development-server stage. |
| 16–18 | `environment` | Gives the running Vite development server the browser API URL and demo token. |
| 19–20 | `ports: !override` | Replaces the production mapping (`host → 8080`) with Vite's development mapping (`host → 5173`). `!override` prevents Docker from trying to publish the same host port twice. |
| 21–23 | `./client:/app` and `client_node_modules:/app/node_modules` | Enables Vite hot reload while preserving Linux container dependencies. |
| 24–25 | client health check | Checks Vite's internal development port `5173`, not Nginx's production port. |
| 26 | `restart: "no"` | Keeps development errors visible. |
| 28–30 | named volumes | Declares Docker-managed dependency volumes. They persist after `docker compose down` unless `-v` is used. |

## Shared environment values

Compose automatically reads a root `.env` file. The client token is required, so create it from [.env.example](.env.example):

```bash
cp .env.example .env
```

```env
SERVER_PORT=3001
CLIENT_PORT=5173
API_TOKEN=demo-token
```

The same values are used consistently:

```text
Browser → http://localhost:5173
Browser → API at http://localhost:3001
Browser → Authorization: Bearer demo-token
Server  → accepts Bearer demo-token
```

Docker services can use internal hostnames such as `server`, but browser code must use `localhost` because it runs outside Docker.

For direct two-terminal development, Vite reads `client/.env.local`. Create it from [client/.env.example](client/.env.example):

```bash
cp client/.env.example client/.env.local
```

The server keeps a `demo-token` fallback for local development, but the browser client does not. A missing `VITE_API_TOKEN` is shown visibly in the UI and disables quote generation.
