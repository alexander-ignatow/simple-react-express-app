# Ports and env vars are duplicated on purpose — change them everywhere

The root `.env` (from `.env.example`) is the source of truth for `SERVER_PORT`,
`CLIENT_PORT`, and `API_TOKEN`. But the *defaults* are hardcoded across the repo so each
run path works standalone. Changing a port or adding an env var means touching every
place below — there is no single definition to edit, and nothing fails loudly when one is
missed.

**Server port (3001):** `.env.example`, `start.sh`, `docker-compose.yml` (env, ports,
healthcheck URL, client build ARG), `docker-compose.dev.yml` (client `VITE_API_URL`),
`server/Dockerfile` (both `EXPOSE` lines), `server/src/index.ts`,
`client/.env.example`, `client/src/hooks/useQuote.ts` fallback, `README.md`,
`DOCKER_LEARNING_GUIDE.md`.

**Client port:** host port is `CLIENT_PORT` (5173), but the container port differs by
target — dev maps to Vite's `5173`, production maps to Nginx's `8080`. Touch points:
`.env.example`, `start.sh`, both compose files (the dev overlay uses `ports: !override`),
`client/Dockerfile` (`EXPOSE 5173` dev, `EXPOSE 8080` production), `client/nginx.conf`
(`listen 8080`), `README.md`, `DOCKER_LEARNING_GUIDE.md`.

After any such change, grep to confirm nothing was missed:

```bash
grep -rn '3001\|5173\|8080' --include='*.ts' --include='*.sh' --include='*.yml' \
  --include='*.conf' --include='Dockerfile' --include='*.md' . | grep -v node_modules
```

**Two things that are not negotiable:**

- `VITE_API_URL` always points at `http://localhost:$SERVER_PORT`, never a container
  hostname like `http://server:3001`. The **browser** makes that request, not the client
  container.
- In the production client image, `VITE_API_URL` and `VITE_API_TOKEN` are build ARGs baked
  into the static bundle. Changing them requires a rebuild, not a restart.
