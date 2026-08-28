# Architecture

## System overview

`whoisockyo` is a pnpm monorepo containing three packages:

- `@whoisockyo/web` renders the public portfolio and private dashboard.
- `@whoisockyo/api` owns HTTP behavior, authentication, business rules, and persistence.
- `@whoisockyo/shared` publishes transport types and Zod schemas used at both boundaries.

The web and API remain independently deployable. Vite proxies `/api` to Express during development; production infrastructure should route the same prefix to the API or set `VITE_API_URL` during the web build.

## Frontend architecture

The React application is organized by responsibility:

- `pages/` owns route-level composition.
- `layouts/` owns public and dashboard shells.
- `features/` contains domain-specific forms.
- `components/ui/` contains focused visual primitives.
- `components/dashboard/` and `components/public/` contain surface-specific components.
- `services/` is the only layer that knows API paths.
- `providers/` owns session and theme context.
- `lib/` contains the API client, query keys, and small infrastructure utilities.

TanStack Query owns all remote state. Mutations invalidate the affected administrator, public portfolio, and dashboard metric keys. React Hook Form owns transient form state, while Zod performs validation before data enters a mutation.

Every remote route renders explicit loading, error, empty, and success states where each state applies.

## Backend architecture

Express uses feature modules. Each content feature separates:

1. Route registration and middleware
2. Controller HTTP translation
3. Service business rules
4. Repository Prisma access

Controllers do not contain database queries. Route files do not contain business logic. Cross-cutting middleware handles authentication, input validation, rate limits, missing routes, and errors.

The normal request flow is:

```text
HTTP request
  -> security and parsing middleware
  -> route input validation
  -> controller
  -> service
  -> repository
  -> Prisma / PostgreSQL
  -> consistent API envelope
```

## Database architecture

The schema intentionally stays compact for a single-owner portfolio. Content tables are independent because the public site always represents one portfolio. `Profile` and `SiteSettings` use a stable `primary` key to enforce a single active record without relying on an arbitrary first row.

PostgreSQL arrays store project and experience technologies. This avoids unnecessary join tables for a small, ordered display attribute. Skills remain normalized because they have their own management lifecycle and category metadata.

Indexes support the primary read patterns: published and featured projects, ordered skills and social links, and unread messages.

## Authentication flow

Authentication is intentionally single-administrator but does not rely on frontend protection:

1. The login endpoint validates credentials against a bcrypt hash.
2. Express issues a short-lived access JWT and a longer-lived refresh JWT in HTTP-only cookies.
3. Only a SHA-256 digest of the current refresh token is stored in PostgreSQL.
4. Protected middleware verifies the access cookie for every administrator request.
5. The browser API client attempts one refresh after an authenticated request receives `401`.
6. Refresh tokens rotate on every refresh, invalidating the previous token.
7. Logout clears the stored digest and both cookies.
8. Changing the password hashes the new password and rotates the refresh token.

Cookies use `SameSite=Lax`, are HTTP-only, and become `Secure` in production. CORS accepts only the configured frontend origin. Login and contact submission have stricter rate limits than the general API.

## Important decisions

- Shared schemas prevent frontend/backend validation drift without sharing persistence models.
- Public project reads always include `published = true`; draft visibility is enforced by the API.
- User-generated messages are rendered as plain React text, never injected as HTML.
- API errors expose stable codes and safe messages. Production responses never include stack traces.
- Site metrics are database counts rather than invented analytics.
