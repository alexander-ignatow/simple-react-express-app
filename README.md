# React + Express Docker demo

This small quote generator is a teaching project for running the same React and Express application locally, in individual Docker containers, and with Docker Compose. The client calls the server's authenticated `GET /quote` endpoint; `GET /health` is available for health checks.

## Prerequisites

- Node.js 24+ and npm for local runs
- Docker Desktop for Docker runs

All launch methods use the same three settings:

| Setting | Default | Purpose |
| --- | --- | --- |
| `SERVER_PORT` | `3001` | Host port for the Express API |
| `CLIENT_PORT` | `5173` | Host port for the React app |
| `API_TOKEN` | `demo-token` | Demo token used by the client and API |

Defaults work out of the box. To customize them once for the local launcher and Compose, create a root `.env` file:

```bash
cp .env.example .env
```

The token is deliberately a browser-visible demo value, not a secret-management pattern for a real application.

## 1. Run directly with npm

Install dependencies once, then start both services with one command:

```bash
chmod +x start.sh
./start.sh
```

Open [http://localhost:5173](http://localhost:5173). The API is at [http://localhost:3001/health](http://localhost:3001/health). The script starts both development servers, reloads changes, and stops both when you press `Ctrl+C`.

To make a local production-style build and serve it, use:

```bash
./start.sh prod
```

This is useful for a quick build check. For a production container setup, use the Compose production command below.

If you prefer two terminals, the equivalent development commands are:

```bash
cd server && npm run dev
cd client && npm run dev
```

## 2. Run with Docker

Build and run each image separately from the repository root. The `API_TOKEN` value must match in both commands.

### Development containers

```bash
docker build --target development -t quote-server:dev ./server
docker run --rm -p 3001:3001 -e PORT=3001 -e NODE_ENV=development -e API_TOKEN=demo-token quote-server:dev
```

In a second terminal:

```bash
docker build --target development -t quote-client:dev ./client
docker run --rm -p 5173:5173 \
  -e VITE_API_URL=http://localhost:3001 \
  -e VITE_API_TOKEN=demo-token \
  quote-client:dev
```

These are development servers inside containers. For live source editing, Docker Compose is more convenient because it mounts the source code automatically.

### Production containers

```bash
docker build -t quote-server:prod ./server
docker run --rm -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e CLIENT_URL=http://localhost:5173 \
  -e API_TOKEN=demo-token \
  quote-server:prod
```

In a second terminal, build the client with the browser-facing API URL and the same token:

```bash
docker build -t quote-client:prod ./client \
  --build-arg VITE_API_URL=http://localhost:3001 \
  --build-arg VITE_API_TOKEN=demo-token
docker run --rm -p 5173:8080 quote-client:prod
```

The production client is a static build served by Nginx on container port `8080`.

## 3. Run with Docker Compose

Compose is the simplest Docker workflow: it starts the two services, networking, ports, and health checks together.

### Development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Source folders are mounted into the containers, so both services reload as you edit. Stop with `Ctrl+C`.

### Production

```bash
docker compose up --build -d
```

Open [http://localhost:5173](http://localhost:5173), inspect status with `docker compose ps`, and stop with:

```bash
docker compose down
```

The base [docker-compose.yml](docker-compose.yml) is the production configuration; [docker-compose.dev.yml](docker-compose.dev.yml) changes the same services to development targets and adds bind mounts.

## Environment alignment

There is one source of truth for shared values: the root `.env` file created from [.env.example](.env.example).

- `./start.sh` reads it and exports the server and Vite variables.
- Docker Compose reads it for port mappings, the server token, and the client build/runtime values.
- Individual `docker run` commands show the same values explicitly because Docker does not automatically read Compose's `.env` file.

The client always receives `VITE_API_URL=http://localhost:$SERVER_PORT`, because the browser—not the client container—makes the API request. The server expects `Authorization: Bearer $API_TOKEN`.

## Useful checks

```bash
npm run lint --prefix client
npm run build --prefix client
npm run lint --prefix server
npm run build --prefix server
```
