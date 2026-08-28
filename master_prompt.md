You are rebuilding a full-stack personal developer portfolio project named `whoisockyo`.

The goal is to create a modern, premium, developer-focused portfolio website with an integrated private dashboard for managing all portfolio content.

Use English as the default and only language for:
- Code
- Variable names
- Function names
- File names
- Folder names
- Comments
- Documentation
- API responses
- Database fields

The codebase must be clean, maintainable, production-oriented, and easy to understand.

# 1. Project Identity

Project name:

`whoisockyo`

Concept:

A modern developer portfolio inspired by developer tools, terminal interfaces, Linear, Vercel, GitHub, and premium SaaS products.

The public website should feel personal, technical, polished, minimal, and modern.

The dashboard should feel like a professional SaaS admin panel.

A possible branding concept for the hero section:

`> whois ockyo_`

Do not make the interface look like a generic template.

Avoid excessive gradients, excessive glassmorphism, unnecessary animations, and visual clutter.

Prefer:
- Strong typography
- Good spacing
- Clean layouts
- Subtle motion
- Clear information hierarchy
- Developer-oriented details
- Responsive design
- Dark mode support

# 2. Technology Stack

Use a full-stack monorepo.

Frontend:
- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui where useful
- TanStack Query
- React Hook Form
- Zod

Backend:
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod validation

Tooling:
- pnpm
- ESLint
- Prettier

Do not use Next.js.

Frontend and backend must live in the same repository but remain clearly separated.

# 3. Repository Structure

Create a clean monorepo structure similar to:

whoisockyo/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── lib/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── constants/
│   │   │   └── types/
│   │   └── ...
│   │
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   ├── middlewares/
│       │   ├── modules/
│       │   ├── utils/
│       │   ├── types/
│       │   ├── app.ts
│       │   └── server.ts
│       └── ...
│
├── packages/
│   └── shared/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── conventions.md
│
├── .env.example
├── pnpm-workspace.yaml
└── README.md

You may improve this structure if there is a clear architectural reason, but keep frontend and backend boundaries obvious.

# 4. Backend Architecture

Use feature-based modules.

Example:

modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.repository.ts
│   ├── auth.routes.ts
│   ├── auth.schema.ts
│   └── auth.types.ts
│
├── projects/
│   ├── project.controller.ts
│   ├── project.service.ts
│   ├── project.repository.ts
│   ├── project.routes.ts
│   ├── project.schema.ts
│   └── project.types.ts

Apply the same pattern where appropriate for:
- Profile
- Projects
- Experience
- Skills
- Social links
- Settings
- Contact messages

Keep responsibilities separated.

Controllers:
- Receive HTTP requests
- Validate request input
- Call services
- Return responses

Services:
- Contain business logic

Repositories:
- Handle database operations

Schemas:
- Zod validation

Routes:
- Define endpoints

Do not put business logic directly inside route files.

# 5. Naming Conventions

Use descriptive names.

Good:

`fetchDashboardMetrics`

`isSidebarCollapsed`

`projectRepository`

`updateProfile`

`selectedProjectId`

Bad:

`data`

`obj`

`temp`

`value1`

`handle2`

`resData`

Avoid vague variable names unless the scope makes the meaning completely obvious.

Boolean values should use prefixes such as:

- is
- has
- can
- should

Examples:

`isAuthenticated`

`hasPermission`

`canEditProject`

`shouldShowSidebar`

Functions should use action-oriented names.

Examples:

`createProject`

`deleteExperience`

`fetchProfile`

`validateAccessToken`

# 6. Code Quality Rules

Do not create unnecessarily large files.

Prefer:
- Small focused components
- Small focused functions
- Reusable abstractions only when they provide real value
- Feature-based organization
- Clear boundaries

Avoid premature abstraction.

Do not create generic helpers just to reduce a few repeated lines.

Avoid deeply nested conditionals.

Prefer early returns where appropriate.

Avoid magic strings and magic numbers.

Use constants or enums when the domain has a clear fixed set of values.

Use TypeScript properly.

Do not use `any` unless there is a very strong reason.

Prefer explicit types for public APIs and important business models.

# 7. Comments and Notes

Comments must explain WHY, not WHAT.

Do not write obvious comments.

Bad:

// Set the project title
project.title = title;

Good:

// Keep the original slug stable to avoid breaking previously shared project URLs.
const projectSlug = existingProject.slug;

Add comments for:
- Business rules
- Non-obvious logic
- Security decisions
- Important workarounds
- Complex transformations
- Architectural decisions

Use JSDoc for important exported utilities or complex shared functions where helpful.

Do not over-comment the codebase.

# 8. Public Website

Build the following public pages or sections:

- Home
- About
- Experience
- Skills
- Projects
- Contact

A single-page portfolio structure is acceptable where appropriate, but project details may have dedicated routes.

Suggested routes:

/
 /projects
 /projects/:slug
 /contact

The homepage should include:

Hero section:
- Personal identity
- Developer title
- Short introduction
- Primary call to action
- Secondary call to action
- Developer-themed visual detail

Possible hero concept:

`> whois ockyo_`

Add a subtle terminal cursor animation if appropriate.

Do not make the entire website look like a terminal.

About section:
- Short introduction
- Developer philosophy
- Current focus

Experience:
- Timeline or clean list
- Company
- Role
- Start date
- End date
- Description
- Technologies

Skills:
- Group skills logically
- Languages
- Frontend
- Backend
- Database
- DevOps
- Tools

Projects:
- Featured projects
- Project card
- Project title
- Short description
- Tech stack
- GitHub URL
- Live URL
- Thumbnail
- Project status
- Featured flag

Contact:
- Contact form
- Social links
- Email information if configured

The contact form must submit through the backend API.

# 9. Dashboard

Create a private dashboard.

Routes:

/dashboard
/dashboard/profile
/dashboard/projects
/dashboard/experience
/dashboard/skills
/dashboard/social-links
/dashboard/messages
/dashboard/settings

Use protected routes.

Dashboard layout should include:
- Sidebar
- Header
- Breadcrumbs
- Responsive mobile navigation
- Dark mode
- Toast notifications
- Loading states
- Error states
- Empty states

Dashboard home should contain useful summary cards such as:
- Total projects
- Featured projects
- Total skills
- Experience entries
- Unread contact messages

Do not display fake analytics unless the application actually stores that data.

# 10. Dashboard CRUD

Profile management:
- Name
- Headline
- Bio
- Location
- Avatar
- Resume URL
- Email
- Availability status

Projects:
- Create
- Edit
- Delete
- Reorder if practical
- Mark as featured
- Publish/unpublish

Project fields should include:
- title
- slug
- shortDescription
- description
- thumbnailUrl
- repositoryUrl
- liveUrl
- technologies
- featured
- published
- displayOrder
- createdAt
- updatedAt

Experience:
- Company
- Position
- Start date
- End date
- Currently working flag
- Description
- Technologies
- Display order

Skills:
- Name
- Category
- Proficiency if used
- Icon
- Display order

Social links:
- Platform
- URL
- Icon
- Display order
- Visibility

Contact messages:
- Name
- Email
- Subject
- Message
- Read/unread status
- Created date

# 11. Authentication

The dashboard must require authentication.

This is a personal portfolio, so do not build unnecessary multi-user complexity unless the architecture requires it.

Implement a secure admin authentication flow.

Prefer:
- Short-lived access token
- Secure refresh flow

Or use secure HTTP-only cookies if that results in a cleaner architecture.

Security requirements:
- Passwords must be hashed using a modern password hashing algorithm.
- Never store plain-text passwords.
- Never expose credentials to the frontend.
- Use HTTP-only cookies where appropriate.
- Use secure cookies in production.
- Use SameSite appropriately.
- Protect authenticated API routes.
- Validate authentication on the backend.
- Do not rely only on frontend route protection.

# 12. API Design

Use REST endpoints.

Suggested structure:

/api/auth
/api/profile
/api/projects
/api/experience
/api/skills
/api/social-links
/api/contact-messages
/api/dashboard

Use consistent API responses.

Success example:

{
  "success": true,
  "data": {},
  "message": "Project retrieved successfully."
}

Error example:

{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "The requested project could not be found."
  }
}

Create a centralized response pattern if useful.

Create centralized error handling.

Use meaningful HTTP status codes.

Examples:

200
201
204
400
401
403
404
409
422
500

Do not return stack traces in production.

# 13. Validation

Validate all external input.

Use Zod.

Validate:
- Request bodies
- Route params
- Query params
- Environment variables

Do not trust frontend validation.

Frontend and backend validation may share schemas through `packages/shared` if doing so keeps the architecture clean.

# 14. Database

Use PostgreSQL and Prisma.

Design a clear Prisma schema for at least:

- AdminUser
- Profile
- Project
- Experience
- Skill
- SocialLink
- ContactMessage

Use proper relationships.

Use:
- createdAt
- updatedAt

where appropriate.

Use enums where the domain genuinely benefits from them.

Do not over-normalize a small portfolio database.

Create seed data so the project can be previewed immediately after installation.

# 15. Environment Configuration

Create `.env.example`.

Never commit secrets.

Validate environment variables at application startup.

Expected variables may include:

DATABASE_URL

PORT

NODE_ENV

FRONTEND_URL

JWT_ACCESS_SECRET

JWT_REFRESH_SECRET

JWT_ACCESS_EXPIRES_IN

JWT_REFRESH_EXPIRES_IN

Do not hardcode production URLs.

# 16. Security

Add sensible security middleware.

Use:
- Helmet
- CORS
- Rate limiting where appropriate
- Secure authentication handling

Apply stricter rate limiting to:
- Login
- Contact form

Sanitize or safely render user-generated content.

Prevent common injection risks.

Do not expose internal error information.

# 17. Frontend Data Architecture

Use TanStack Query for API server state.

Do not manually manage API cache using random `useEffect` calls.

Create a clean API client.

Example:

services/
├── api-client.ts
├── auth.service.ts
├── project.service.ts
└── profile.service.ts

Handle:
- Authentication
- API errors
- Token refresh where needed

Keep API logic outside presentation components.

# 18. Forms

Use:
- React Hook Form
- Zod

Display meaningful validation errors.

Disable submit buttons during submission.

Prevent duplicate submissions.

Provide success and failure feedback.

# 19. UI Architecture

Create reusable primitives where useful.

Examples:
- PageHeader
- DataTable
- EmptyState
- ConfirmDialog
- LoadingSkeleton
- FormField
- DashboardCard
- ErrorState

Do not create one giant global component folder with hundreds of unrelated components.

Keep feature-specific components inside their feature folders.

# 20. Styling Direction

The public portfolio should feel:
- Premium
- Technical
- Minimal
- Dark-first but support light mode
- Modern
- Personal

Visual references:
- Linear
- Vercel
- GitHub
- Raycast
- Modern developer portfolios

Use references only as inspiration.

Do not copy their UI directly.

Typography should be strong and readable.

Use monospaced typography only for technical accents, labels, commands, or code-related elements.

Use a normal high-quality sans-serif font for body content.

Avoid making all text monospaced.

# 21. Responsive Design

Support:
- Mobile
- Tablet
- Desktop
- Large desktop

Dashboard tables should remain usable on smaller screens.

Use cards or horizontal scrolling where appropriate.

Do not simply hide important information on mobile.

# 22. Accessibility

Use semantic HTML.

Ensure:
- Buttons are real buttons
- Links are real links
- Inputs have labels
- Keyboard navigation works
- Focus states are visible
- Contrast is acceptable
- Dialogs are accessible

Use ARIA only when semantic HTML is insufficient.

# 23. Loading and Error Handling

Every asynchronous page must account for:

- Loading
- Success
- Empty
- Error

Do not leave blank screens while fetching data.

Use skeletons where appropriate.

Provide useful retry options for recoverable failures.

# 24. Documentation

Create:

README.md

docs/architecture.md

docs/api.md

docs/conventions.md

README should explain:
- What the project is
- Tech stack
- Requirements
- Installation
- Environment setup
- Database setup
- Prisma migrations
- Seeding
- Development commands
- Production build
- Repository structure

architecture.md should explain:
- Frontend architecture
- Backend architecture
- Request flow
- Database architecture
- Authentication flow
- Important design decisions

conventions.md should explain:
- Naming rules
- Folder organization
- Component conventions
- API conventions
- Comments
- Error handling
- TypeScript guidelines

# 25. Developer Experience

Provide useful scripts such as:

pnpm dev

pnpm dev:web

pnpm dev:api

pnpm build

pnpm lint

pnpm typecheck

pnpm format

pnpm db:migrate

pnpm db:seed

pnpm db:studio

Make the root `pnpm dev` command start frontend and backend together.

# 26. Import Style

Use aliases where useful.

For example:

@/components
@/features
@/lib
@/services

Avoid extremely long relative imports such as:

../../../../components/Button

Keep aliases simple and obvious.

# 27. Error Codes

Create stable application error codes.

Examples:

UNAUTHORIZED

INVALID_CREDENTIALS

PROJECT_NOT_FOUND

PROFILE_NOT_FOUND

VALIDATION_ERROR

RATE_LIMIT_EXCEEDED

INTERNAL_SERVER_ERROR

Do not use raw exception messages as public API error codes.

# 28. Logging

Use a simple centralized logger.

Log:
- Server startup
- Important backend errors
- Unexpected exceptions

Avoid noisy logging.

Never log:
- Passwords
- Authentication tokens
- Database credentials
- Sensitive environment values

# 29. Development Priorities

Build the project in logical phases.

Phase 1:
- Monorepo setup
- Tooling
- TypeScript
- Tailwind
- Database
- Express API
- Core architecture

Phase 2:
- Prisma schema
- Seed data
- Public profile API
- Public portfolio UI

Phase 3:
- Authentication
- Protected dashboard
- Dashboard layout

Phase 4:
- Profile CRUD
- Project CRUD
- Experience CRUD
- Skills CRUD
- Social links CRUD

Phase 5:
- Contact form
- Contact message dashboard

Phase 6:
- Polish
- Responsive behavior
- Accessibility
- Loading states
- Error handling
- Documentation

Do not attempt to solve every future requirement with unnecessary abstractions during Phase 1.

# 30. Existing Code

If an existing codebase is present:

Inspect it first.

Reuse good existing code.

Refactor bad architecture instead of blindly deleting everything.

Preserve useful functionality unless it conflicts with the new design.

Before making major architectural changes, understand:
- Existing package structure
- Current dependencies
- Current routes
- Current styles
- Existing components
- Existing data models

Remove unused and obsolete code after the migration is complete.

# 31. Refactoring Requirements

When you encounter unclear code:

Improve naming.

Separate responsibilities.

Remove duplicated logic.

Extract business logic from UI components.

Extract database logic from controllers.

Remove dead code.

Remove unused imports.

Avoid introducing abstraction merely for stylistic reasons.

# 32. Important Engineering Principles

Optimize for:

1. Readability
2. Maintainability
3. Correctness
4. Security
5. Developer experience
6. Performance

Do not optimize prematurely.

Prefer straightforward code over clever code.

The code should be understandable by another developer without needing to reverse engineer the architecture.

# 33. Final Quality Standard

The final project should feel like a real production portfolio application, not a tutorial project.

It should have:

- Clear architecture
- Consistent naming
- Professional UI
- Good responsive behavior
- Strong TypeScript usage
- Secure authentication
- Clean API design
- Proper validation
- Proper error handling
- Useful documentation
- Easy local setup
- Easy future extension

When uncertain between a clever solution and a clear solution, choose the clear solution.

Start by inspecting the repository, then produce a concise implementation plan based on the existing codebase.

After the plan, begin implementation.

Do not stop after scaffolding.

Continue until the public portfolio, backend, database integration, authentication, and dashboard core are working together.