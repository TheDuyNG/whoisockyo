# whoisockyo

`whoisockyo` is a full-stack developer portfolio with a private content dashboard. The public site presents a profile, experience, skills, projects, social links, and a backend-powered contact form. The dashboard manages the same stored content through authenticated workflows.

## Technology

- React, Vite, TypeScript, React Router, Tailwind CSS
- TanStack Query, React Hook Form, Zod
- Node.js, Express, PostgreSQL, Prisma
- pnpm workspaces, ESLint, Prettier

## Requirements

- Node.js 20.19 or newer
- pnpm 10 or newer (`corepack enable` is recommended)
- PostgreSQL 15 or newer, or Docker with Docker Compose

## Repository structure

```text
apps/
  api/                 Express application and feature modules
  web/                 React public site and dashboard
packages/
  shared/              Shared Zod schemas and transport types
prisma/
  migrations/          Versioned PostgreSQL migration
  schema.prisma        Database schema
  seed.ts              Idempotent preview data and admin seed
docs/
  architecture.md
  api.md
  conventions.md
```

## Local installation

1. Enable pnpm and install dependencies.

   ```bash
   corepack enable
   pnpm install
   ```

2. Copy `.env.example` to `.env`. Replace both JWT secrets and the administrator password before running the seed.

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL. The included Compose service is convenient for local development.

   ```bash
   docker compose up -d postgres
   ```

4. Generate the Prisma client, apply the migration, and seed preview content.

   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:seed
   ```

5. Start the frontend and API together.

   ```bash
   pnpm dev
   ```

The portfolio is available at `http://localhost:5173`, the dashboard sign-in is at `http://localhost:5173/login`, and the API listens on `http://localhost:4000` by default.

## Environment variables

| Variable                 | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string used by Prisma          |
| `PORT`                   | Express listen port                                  |
| `NODE_ENV`               | `development`, `test`, or `production`               |
| `FRONTEND_URL`           | Exact CORS origin allowed by the API                 |
| `JWT_ACCESS_SECRET`      | Access-token signing secret, at least 32 characters  |
| `JWT_REFRESH_SECRET`     | Refresh-token signing secret, at least 32 characters |
| `JWT_ACCESS_EXPIRES_IN`  | Short access-token duration, such as `15m`           |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token duration, such as `7d`                 |
| `ADMIN_EMAIL`            | Administrator created or updated by the seed         |
| `ADMIN_PASSWORD`         | Administrator seed password, at least 12 characters  |
| `VITE_API_URL`           | Optional browser API prefix; defaults to `/api`      |

Environment variables are validated when the API starts. Secrets are never included in browser code or API responses.

## Commands

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Run the web and API development servers together |
| `pnpm dev:web`      | Run only Vite                                    |
| `pnpm dev:api`      | Run only Express with file watching              |
| `pnpm build`        | Build shared contracts, API, and web application |
| `pnpm lint`         | Run ESLint across the workspace                  |
| `pnpm typecheck`    | Type-check every workspace package               |
| `pnpm format`       | Format repository files with Prettier            |
| `pnpm format:check` | Verify formatting without writing                |
| `pnpm db:generate`  | Generate the Prisma client                       |
| `pnpm db:migrate`   | create/apply a development migration             |
| `pnpm db:deploy`    | Apply committed migrations in deployment         |
| `pnpm db:seed`      | Create preview content and the administrator     |
| `pnpm db:studio`    | Open Prisma Studio                               |

## Production build

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm build
pnpm db:deploy
pnpm --filter @whoisockyo/api start
```

Deploy `apps/web/dist` through a static host configured to fall back to `index.html` for client routes. Deploy the API separately with the production environment variables and HTTPS. Production cookies are marked `Secure`; the frontend and API should therefore be exposed through HTTPS and a compatible same-site domain arrangement.

## Additional documentation

- [Architecture](docs/architecture.md)
- [API reference](docs/api.md)
- [Engineering conventions](docs/conventions.md)
