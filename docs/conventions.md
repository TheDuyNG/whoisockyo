# Engineering conventions

## Language and naming

All code, comments, documentation, API messages, file names, and database fields use English.

- Components and exported types use `PascalCase`.
- Functions, variables, and instances use `camelCase`.
- Boolean names start with `is`, `has`, `can`, or `should` when practical.
- Functions use action-oriented names such as `createProject` or `refreshMessages`.
- File names use lowercase kebab case, with a responsibility suffix such as `.service.ts`.
- Avoid vague names such as `data`, `obj`, and `temp` when a domain name is available.

## Folder organization

Frontend code that is specific to one domain belongs in `features/<domain>`. Reusable visual primitives belong in `components/ui`; they must not know API paths. Route components belong in `pages` and should focus on composition and query/mutation orchestration.

Backend domains live in `modules/<domain>`. Route, controller, service, and repository responsibilities remain separate. Cross-domain business operations may call another domain service but must not reach into another repository directly.

## TypeScript

- Strict mode and unchecked indexed access are enabled.
- Do not use `any`; narrow `unknown` at external boundaries.
- Export explicit types for service contracts and important domain models.
- Prefer shared Zod inference over duplicated request types.
- Persistence types do not cross the HTTP boundary as public contracts.

## API conventions

- Validate body, route parameters, and query parameters before controllers run.
- Use services for business rules and repositories for Prisma operations.
- Return consistent success/error envelopes except for `204` responses.
- Expose stable error codes, not exception messages.
- Never return stack traces, password hashes, refresh-token hashes, or secrets.
- Public reads must enforce publication and visibility rules in the backend.

## Components and forms

- Buttons use `<button>` and navigation uses `<a>` or React Router links.
- Inputs always have associated labels and visible validation messages.
- Disable forms while mutations are pending to prevent duplicate submissions.
- Account for loading, error, empty, and success states.
- Use TanStack Query for server state; do not create manual request caches in effects.
- Keep API calls in `services/`, outside presentation components.

## Comments

Comments explain business reasons, security decisions, or non-obvious constraints. Do not narrate straightforward code. Add JSDoc only when an exported utility has behavior that its type and name do not make clear.

## Error handling and logging

Expected domain failures use `AppError` with an HTTP status and stable code. Unexpected failures reach the centralized error middleware and structured logger. Logs must redact cookies, tokens, password fields, hashes, and credentials.

## Formatting and quality

Run these checks before merging changes:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Prefer clear, focused code over abstractions that only remove a few repeated lines.
