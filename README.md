# SpeakCamp

Real-time language practice rooms powered by LiveKit. Users create or join audio rooms to practice speaking in their target language with others at similar proficiency levels.

## Architecture

**Stack**: TanStack React Start + TypeScript + PostgreSQL (Prisma) + LiveKit

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Framework  | TanStack Start (file-based routing, SSR) |
| Routing    | TanStack Router (type-safe, file-based)  |
| State/Data | TanStack Query (server state, caching)   |
| Auth       | Better Auth (email/password + username)  |
| Real-time  | LiveKit (WebRTC audio rooms)             |
| Database   | PostgreSQL + Prisma ORM                  |
| Styling    | TailwindCSS v4 + shadcn-style components |
| Dev Tools  | Biome (lint/format), Vitest, Husky       |

### Route Structure

```
src/routes/
├── __root.tsx                 # Root layout (Theme, Toaster, DevTools)
├── index.tsx                  # Public landing: room list + create dialog
├── auth.tsx                   # Auth layout (sign in/up pages)
│   ├── index.tsx              # Sign in form
│   └── sign-up.tsx            # Sign up form
├── _authenticated.tsx         # Protected layout + session validation
│   ├── room.$id.tsx           # LiveKit room (audio + participant list)
│   └── account.tsx            # Account settings + logout
├── api/
│   ├── auth.$.ts              # Better Auth handler (all auth endpoints)
│   └── livekit.webhook.ts     # LiveKit webhook → auto-delete empty rooms
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 11+
- PostgreSQL 16+
- LiveKit Server (local or cloud)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Set up database
pnpm db:push        # or pnpm db:migrate

# Start development server
pnpm dev
```

### Environment Variables

| Variable             | Description                             | Required |
| -------------------- | --------------------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string            | Yes      |
| `BETTER_AUTH_URL`    | App URL (e.g., `http://localhost:3000`) | Yes      |
| `BETTER_AUTH_SECRET` | 32+ char secret for session signing     | Yes      |
| `LIVEKIT_API_KEY`    | LiveKit API key                         | Yes      |
| `LIVEKIT_API_SECRET` | LiveKit API secret                      | Yes      |
| `VITE_LIVEKIT_URL`   | LiveKit WebSocket URL (client)          | Yes      |

## Authentication

**Better Auth** with TanStack Start cookie integration.

### Flow

1. **API Routes**: `/api/auth/$` handles all auth (sign in, sign up, session, logout, etc.)
2. **Server Middleware**: `src/middlewares/auth.ts` validates session on protected server functions
3. **Route Guard**: `_authenticated.tsx` uses `beforeLoad` to redirect unauthenticated users to `/auth`
4. **Client Hooks**: `authClient.useSession()`, `useSignIn()`, `useSignUp()`, `useLogout()`

### User Model

- `id`, `email`, `username` (unique), `displayUsername` (required)
- `emailVerified`, `image`, `createdAt`, `updatedAt`
- Relations: `rooms` (created), `roomSessions` (joined)

## Data Flow

```
User Action (UI)
       ↓
Server Function (createServerFn + Zod validation)
       ↓
Middleware (authMiddleware → validates session)
       ↓
Prisma → PostgreSQL
       ↓
LiveKit API (room create/delete, token generation)
       ↓
TanStack Query (client cache, invalidation)
       ↓
React Components → LiveKitRoom (WebRTC connection)
```

### Key Patterns

- **Server Functions**: Type-safe RPC endpoints (`src/features/room/actions/room.functions.ts`)
- **Query Options**: Centralized in `src/features/room/queries/roomQueries.ts`
- **Loaders**: Pre-fetch data during route transitions (`loader` in route files)
- **Middleware**: Protects mutating operations (create/delete room, get token)

## Development

### Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm generate-routes  # Regenerate route tree (after adding routes)

# Database
pnpm db:push          # Push schema changes (dev)
pnpm db:migrate       # Create/apply migrations
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Biome lint
pnpm format           # Biome format
pnpm check            # Lint + format

# Testing
pnpm test             # Vitest run (no tests yet)

# Build
pnpm build            # Production build
pnpm preview          # Preview production build
```

### Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── lib/           # Better Auth config, client, server functions
│   │   ├── hooks/         # useSession, useSignIn, useSignUp, useLogout
│   │   └── components/    # SignInForm, SignUpForm
│   ├── room/
│   │   ├── actions/       # Server functions (CRUD + LiveKit tokens)
│   │   ├── queries/       # TanStack Query options
│   │   ├── components/    # RoomCard, CreateRoomDialog, RoomContent, etc.
│   │   └── schemas.ts     # Zod schemas
│   └── account/
│       └── components/    # EditAccountForm
├── routes/                # File-based routes (see Route Structure)
├── middlewares/
│   └── auth.ts            # Session validation middleware
├── shared/
│   ├── components/
│   │   ├── ui/            # shadcn-style primitives (Button, Input, etc.)
│   │   └── layout/        # Header, ThemeProvider, MenuSheet
│   ├── lib/
│   │   ├── prisma.server.ts  # Prisma client (singleton)
│   │   ├── livekit.ts        # LiveKit server SDK client
│   │   └── env.ts            # Validated env (t3-env)
│   └── types/             # Shared TypeScript types
└── start.ts               # TanStack Start instance + CSRF middleware
```

## Deployment

### Build

```bash
pnpm build
# Output: dist/ (self-contained Node server via Nitro)
```

### Run Production

```bash
node dist/server/index.mjs
```

### Required Services

1. **PostgreSQL** - Database
2. **LiveKit Server** - WebRTC infrastructure
   - Configure webhook: `POST /api/livekit/webhook` → handles `room_finished` to auto-delete empty rooms
3. **Node.js Host** - Render, Fly.io, VPS, etc. (any Node-compatible)

### Nitro Presets

For platform-specific deployment, see [Nitro Deploy](https://v3.nitro.build/deploy).

## Testing

Currently **no tests implemented**. Test infrastructure is configured:

```bash
pnpm test  # Runs vitest
```

**Dependencies installed**: Vitest, Testing Library (React + DOM), jsdom

**Suggested structure** when adding tests:

```
src/
  features/
    auth/__tests__/
    room/__tests__/
    account/__tests__/
  shared/lib/__tests__/
  routes/__tests__/
```

## Database Schema

Key models in `prisma/schema.prisma`:

- **User** - Auth + profile (username, displayUsername)
- **Room** - Language practice room (language, level, maxParticipants, creator)
- **RoomSession** - User join/leave tracking
- **Session/Account/Verification** - Better Auth tables

## LiveKit Integration

- **Room Creation**: Server function creates LiveKit room with `emptyTimeout: 30s`
- **Token Generation**: `getRoomToken` server function mints access tokens with `roomJoin` grant
- **Webhook**: `/api/livekit/webhook` receives `room_finished` → marks room `deletedAt`
- **Client**: `@livekit/components-react` `LiveKitRoom` component handles connection

## License

MIT
