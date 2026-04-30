# Verdant AI API

Base URL: `http://localhost:8080/api`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Authenticated endpoints require:

```http
Authorization: Bearer <jwt>
```

## Resumes

- `GET /resumes`
- `GET /resumes/search?keyword=spring`
- `GET /resumes/{id}`
- `POST /resumes`
- `PUT /resumes/{id}`
- `DELETE /resumes/{id}`
- `POST /resumes/score`

## AI

- `POST /ai/suggestions`
- `POST /ai/grammar`

If `OPENAI_API_KEY` is not configured, the backend returns deterministic fallback suggestions for demo continuity.

## Templates

- `GET /templates`

## Admin

- `GET /admin/users`

Requires `ROLE_ADMIN`.
