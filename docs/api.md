# API reference

All routes use the `/api` prefix. JSON responses follow one of these shapes:

```json
{
  "success": true,
  "data": {},
  "message": "Resource retrieved successfully."
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "details": {}
  }
}
```

`204 No Content` delete responses intentionally have no JSON body.

## Public routes

| Method | Route             | Purpose                                                                                               |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `GET`  | `/health`         | Service health check                                                                                  |
| `GET`  | `/portfolio`      | Aggregated public profile, published projects, experience, skills, visible social links, and settings |
| `GET`  | `/profile`        | Public profile                                                                                        |
| `GET`  | `/projects`       | Published projects                                                                                    |
| `GET`  | `/projects/:slug` | Published project detail                                                                              |
| `GET`  | `/experience`     | Experience timeline                                                                                   |
| `GET`  | `/skills`         | Skills grouped by clients as needed                                                                   |
| `GET`  | `/social-links`   | Visible social links                                                                                  |
| `GET`  | `/settings`       | Public-safe site settings                                                                             |
| `POST` | `/contact`        | Submit a contact message                                                                              |

## Authentication routes

| Method | Route                   | Authentication          | Purpose                                       |
| ------ | ----------------------- | ----------------------- | --------------------------------------------- |
| `POST` | `/auth/login`           | Public, rate limited    | Validate credentials and set session cookies  |
| `POST` | `/auth/refresh`         | Refresh cookie          | Rotate both session tokens                    |
| `POST` | `/auth/logout`          | Optional refresh cookie | Revoke the refresh token and clear cookies    |
| `GET`  | `/auth/session`         | Access cookie           | Return the current administrator identity     |
| `POST` | `/auth/change-password` | Access cookie           | Verify and replace the administrator password |

Authentication payloads never include tokens. Tokens remain in HTTP-only cookies.

## Administrator routes

Every `/admin` route requires a valid access cookie.

| Method            | Route                        | Purpose                                                                |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `GET`, `PUT`      | `/admin/profile`             | Read or replace the portfolio profile                                  |
| `GET`, `POST`     | `/admin/projects`            | List all or create a project                                           |
| `PATCH`, `DELETE` | `/admin/projects/:id`        | Update or delete a project                                             |
| `GET`, `POST`     | `/admin/experience`          | List or create experience entries                                      |
| `PUT`, `DELETE`   | `/admin/experience/:id`      | Replace or delete an experience entry                                  |
| `GET`, `POST`     | `/admin/skills`              | List or create skills                                                  |
| `PUT`, `DELETE`   | `/admin/skills/:id`          | Replace or delete a skill                                              |
| `GET`, `POST`     | `/admin/social-links`        | List or create social links                                            |
| `PUT`, `DELETE`   | `/admin/social-links/:id`    | Replace or delete a social link                                        |
| `GET`             | `/admin/messages`            | Paginated messages using `page`, `pageSize`, and `status` query fields |
| `PATCH`           | `/admin/messages/:id/status` | Set `{ "isRead": boolean }`                                            |
| `DELETE`          | `/admin/messages/:id`        | Delete a message                                                       |
| `GET`, `PUT`      | `/admin/settings`            | Read or replace site settings                                          |
| `GET`             | `/dashboard`                 | Real database-backed dashboard metrics                                 |

## Status codes and stable errors

- `200` successful read or update
- `201` successful creation
- `204` successful deletion
- `401` invalid credentials, missing authentication, or expired session
- `403` disabled contact form
- `404` unknown route or missing resource
- `409` unique value conflict
- `422` Zod validation failure
- `429` rate limit exceeded
- `500` unexpected internal error

Stable error codes include `UNAUTHORIZED`, `TOKEN_EXPIRED`, `INVALID_CREDENTIALS`, `VALIDATION_ERROR`, `PROJECT_NOT_FOUND`, `PROJECT_SLUG_CONFLICT`, `CONTACT_MESSAGE_NOT_FOUND`, `CONTACT_FORM_DISABLED`, `RESOURCE_CONFLICT`, `RATE_LIMIT_EXCEEDED`, and `INTERNAL_SERVER_ERROR`.
