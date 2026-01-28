# Simple React Express App

A modern full-stack application with a React frontend and Express backend, both using TypeScript.

## Project Structure

```
simple-react-express-app/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── ui/       # shadcn/ui components (Button, Textarea)
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
│   ├── public/           # Static assets
│   ├── eslint.config.js  # ESLint configuration with import-order rules
│   ├── tsconfig.json     # TypeScript configuration (strict mode enabled)
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.ts    # Vite bundler configuration
│   └── package.json      # Frontend dependencies and scripts
│
├── server/               # Express backend application
│   ├── src/
│   │   └── index.ts     # Express server with /quote endpoint
│   ├── dist/            # Compiled JavaScript output
│   ├── tsconfig.json    # TypeScript configuration (strict mode enabled)
│   └── package.json     # Backend dependencies and scripts
│
└── README.md            # This file
```

## Client (Frontend)

### Technologies

- **Vite** - Fast build tool and dev server
- **React 19** - UI library
- **TypeScript 5.9** - Type-safe JavaScript
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **ESLint** - Code linting with modern rules
  - `simple-import-sort` plugin for import ordering
  - Strict TypeScript rules (no-explicit-any, etc.)
- **Prettier** - Code formatting

### TypeScript Configuration

The client uses strict TypeScript settings:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- All strict mode flags enabled

### Available Scripts

```bash
cd client

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### shadcn/ui Components

The following components are initialized and ready to use:
- **Button** - Various styles (default, secondary, outline, destructive, ghost, link)
- **Textarea** - Styled text input area

Import them from `@/components/ui/button` and `@/components/ui/textarea`.

## Server (Backend)

### Technologies

- **Express 5** - Web framework
- **TypeScript 5.9** - Type-safe JavaScript
- **ts-node-dev** - Development server with hot reload

### TypeScript Configuration

The server uses strict TypeScript settings:
- `strict: true`
- `noImplicitAny: true`
- All strict mode flags enabled
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`

### API Endpoints

#### GET /quote
Returns a stub quote object.

**Response:**
```json
{
  "text": "This is a stub quote endpoint",
  "author": "System",
  "timestamp": "2026-01-22T12:00:00.000Z"
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### Available Scripts

```bash
cd server

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type-check without emitting files
npm run lint
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Docker and Docker Compose (for Docker setup)

### Installation

1. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

### Development

#### Local Development

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start the client (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

#### Docker Development

**Build and run the server:**

```bash
# From root directory
docker build -f server/Dockerfile -t simple-react-express-app-server .
docker run -e PORT=3001 -e NODE_ENV=development -p 3001:3001 simple-react-express-app-server
```

**Build and run the client:**

```bash
# From client directory, pass environment variables at build time
docker build \
  --build-arg VITE_API_URL=http://localhost:3001 \
  --build-arg VITE_API_TOKEN=secret-quote-token-12345 \
  --build-arg VITE_PORT=5173 \
  -t simple-react-express-app-client .

docker run -p 5173:5173 simple-react-express-app-client
```

**Or use Docker Compose for both services:**

```bash
# Build and start both containers
docker compose up --build

# Run in background
docker compose up -d --build
```

**Services:**
- Client: http://localhost:5173
- Server: http://localhost:3001

**Environment Variables:**

Create `.env` files for each service:

**Server (.env):**
```
PORT=3001
NODE_ENV=development
```

**Client (.env):**
```
VITE_API_URL=http://localhost:3001
VITE_API_TOKEN=secret-quote-token-12345
VITE_PORT=5173
```

Pass environment variables to Docker:

```bash
# Using just docker (if ran from /server folder)
docker build -t simple-react-express-app-server .
docker run -e PORT=3001 -e NODE_ENV=development -p 3001:3001 simple-react-express-app-server

# Using env files
docker compose --env-file ./server/.env --env-file ./client/.env up

# Or set inline
docker run -e PORT=3001 -e NODE_ENV=development -p 3001:3001 simple-react-express-app-server
```

### Production Build

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```
   Output: `client/dist/`

2. **Build the server:**
   ```bash
   cd server
   npm run build
   ```
   Output: `server/dist/`

3. **Run the server:**
   ```bash
   cd server
   npm start
   ```

#### Docker Production Build

```bash
# Build production images
docker compose -f docker-compose.yml build

# Run in production
docker compose -f docker-compose.yml up -d
```

## Features

### Client
- ✅ Vite for fast development and optimized builds
- ✅ React with TypeScript
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui component library (Button, Textarea)
- ✅ ESLint with import-order rules
- ✅ Prettier for code formatting
- ✅ Strict TypeScript configuration
- ✅ Path aliases configured (`@/` imports)

### Server
- ✅ Express with TypeScript
- ✅ Stub GET /quote endpoint
- ✅ Health check endpoint
- ✅ Strict TypeScript configuration
- ✅ Hot reload in development

## Code Quality

### Linting
Both client and server use strict TypeScript configurations to prevent `any` types and enforce type safety.

### Import Ordering
The client uses `eslint-plugin-simple-import-sort` to automatically organize imports.

### Code Formatting
The client uses Prettier with a consistent configuration:
- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas (ES5)
- 100-character line width

## License

ISC