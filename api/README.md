<img alt="logo" src="../web/public/assets/icons/favicon.ico">

## api

Backend of my personal site.

It has two jobs: persist and forward contact form submissions, and keep a Postgres-backed cache of GitHub profile data so the frontend never talks to GitHub (or sees the token) directly.

## Stack

<p>
<img alt="Node.js" src="https://img.shields.io/badge/-Node.js-5FA04E?style=plastic&logo=nodedotjs&logoColor=white" />
<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=plastic&logo=typescript&logoColor=white" />
<img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=plastic&logo=express&logoColor=white" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=plastic&logo=postgresql&logoColor=white" />
<img alt="Drizzle" src="https://img.shields.io/badge/-Drizzle-C5F74F?style=plastic&logo=drizzle&logoColor=black" />
<img alt="Zod" src="https://img.shields.io/badge/-Zod-3E67B1?style=plastic&logo=zod&logoColor=white" />
<img alt="Resend" src="https://img.shields.io/badge/-Resend-000000?style=plastic&logo=resend&logoColor=white" />
<img alt="Docker" src="https://img.shields.io/badge/-Docker-2496ED?style=plastic&logo=docker&logoColor=white" />
<p/>

- **Runtime:** Node.js 22, Express 5, CommonJS output compiled with `tsc`
- **Database:** PostgreSQL via `pg` connection pool + Drizzle ORM / drizzle-kit
- **Validation:** Zod 4 (env, request bodies and GitHub responses)
- **Email:** Resend
- **Scheduling:** `node-cron`

## Architecture

```
src/
├── server.ts         # bootstrap: run migrations → listen → schedule cron → initial GitHub fetch
├── app.ts            # Express app: CORS, JSON body parser, routers, error handler
├── config/
│   ├── env.ts        # process.env parsed with Zod (fails fast on missing vars)
│   └── database.ts   # pg Pool + Drizzle instance with all schemas
├── modules/
│   ├── contact/      # *.routes → *.controller → *.service, *.schema (Drizzle), *.validation (Zod)
│   └── github/
└── shared/
    ├── errors.ts     # AppError, asyncHandler, global errorHandler
    └── email.ts      # Resend client + HTML-escaped contact email
```

Each module follows the same layering:

| Layer | Responsibility |
| --- | --- |
| `*.routes.ts` | Declares routes, wraps handlers in `asyncHandler` so rejected promises reach the error handler |
| `*.controller.ts` | Parses/validates input, shapes the HTTP response |
| `*.service.ts` | Business logic and database access |
| `*.schema.ts` | Drizzle table definitions (source of truth for migrations) |
| `*.validation.ts` | Zod schemas and inferred types |

### Startup sequence

1. `env.ts` validates environment variables. Any failure throws and the process exits.
2. Pending Drizzle migrations from `./drizzle` are applied.
3. The HTTP server starts on `PORT`.
4. A cron job (`0 */6 * * *`) refreshes the GitHub contributions, stats and pull requests caches.
5. All three caches are refreshed once immediately. Failures are logged and don't crash the server.

## API reference

CORS only allows the origins in `CORS_ORIGINS` (by default, the production site origins).

### `POST /contact`

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hi! I saw your portfolio and..."
}
```

| Field | Rule |
| --- | --- |
| `name` | string, min 2 chars |
| `email` | valid email |
| `message` | string, min 10 chars |

Responses:

- `201 Created`: the row inserted into `contacts`.
  ```json
  { "id": 1, "name": "...", "email": "...", "message": "...", "createdAt": "..." }
  ```
- `400 Bad Request`: `VALIDATION_ERROR` in the [standard error shape](#errors), with Zod field errors (`flatten().fieldErrors`) in `details`.
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "Invalid request body", "details": { "email": ["Invalid email"] } } }
  ```

After the insert, an email is sent via Resend with `replyTo` set to the sender. The send is fire-and-forget: it doesn't block the response and a failure is only logged (`[Contact] Failed to send email`, with the contact id). Resend returns failures as `{ error }` instead of throwing, so `sendContactEmail` turns them into a thrown error. User input is HTML-escaped before going into the email body.

### `GET /github/contributions`

Contribution calendar for the last year, as returned by GitHub's `contributionCalendar`.

```json
{
  "totalContributions": 1234,
  "weeks": [
    { "contributionDays": [{ "date": "2026-10-13", "contributionCount": 4, "contributionLevel": "SECOND_QUARTILE" }] }
  ],
  "cachedAt": "2026-10-13T12:00:00.000Z"
}
```

### `GET /github/stats`

Aggregated profile stats, computed from the owner's 100 most recently pushed repositories.

| Field | Type | Description |
| --- | --- | --- |
| `totalStars` | `number` | Sum of `stargazerCount` across owned repos |
| `mergedPRs` | `number` | Total merged pull requests |
| `closedIssues` | `number` | Total closed issues |
| `currentStreak` | `number` | Consecutive days with contributions (today is skipped if it has none yet) |
| `lastCommitDate` | `string` | `pushedAt` of the most recently pushed repo |
| `lastCommitRepo` | `string` | Name of that repo, or `""` if it's private |
| `languages` | `{ name, percentage, color }[]` | Top 8 languages by byte size across repos |
| `repositories` | `{ name, nameWithOwner, url, stargazerCount, createdAt }[]` | Public repos only. The frontend uses them to show stars/creation date on projects |
| `cachedAt` | `string` | When the cache row was last refreshed |

### `GET /github/pull-requests`

Pull requests authored by the user in public repositories (own or someone else's), grouped by state. Each group has the total count and the 20 most recent, newest first. `closed` only counts PRs closed without being merged.

```json
{
  "merged": {
    "totalCount": 78,
    "items": [{ "title": "fix: ...", "url": "https://github.com/owner/repo/pull/1", "repository": "owner/repo", "createdAt": "2026-10-13T12:00:00Z" }]
  },
  "open": { "totalCount": 0, "items": [] },
  "closed": { "totalCount": 1, "items": [] },
  "cachedAt": "2026-10-13T12:00:00.000Z"
}
```

### Errors

Every error goes through the global `errorHandler` and shares one shape (`details` only appears on validation errors):

```json
{ "error": { "code": "GITHUB_TIMEOUT", "message": "GitHub took too long to respond" } }
```

| Status | Code | When |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | Request body failed Zod validation |
| `502` | `GITHUB_UNAVAILABLE` | GitHub returned a non-2xx status or the request failed |
| `502` | `GITHUB_INVALID_RESPONSE` | GraphQL `errors` present, or the payload failed Zod validation |
| `504` | `GITHUB_TIMEOUT` | GitHub didn't answer within 10s (`AbortController`) |
| `500` | `INTERNAL_ERROR` | Any unhandled error |

Every error is logged with method, path, status and code: `4xx` as a warning with the message, `5xx` as an error with the stack.

Messages, logs and comments are in English. The only Portuguese is the contact email sent to the site owner (subject and labels), since that's user-facing content.

## GitHub cache

Hitting the GitHub GraphQL API on every page view would be slow and burn rate limit, so data is cached in Postgres:

- `refreshGitHubContributions()`, `refreshGitHubStats()` and `refreshGitHubPullRequests()` each run one GraphQL query, validate the response with Zod, compute derived fields, and **upsert a single row** (update the latest row if one exists, otherwise insert).
- `GET /github/*` reads the latest row. If the table is empty (e.g. first boot before the initial fetch finished), the controller fetches from GitHub synchronously and returns that.
- The cache is refreshed on boot and every 6 hours.

## Database

| Table | Columns | Notes |
| --- | --- | --- |
| `contacts` | `id`, `name`, `email`, `message`, `created_at` | One row per submission |
| `github_contributions` | `id`, `total_contributions`, `weeks` (jsonb), `cached_at` | Single cached row |
| `github_stats` | `id`, `total_stars`, `merged_prs`, `closed_issues`, `current_streak`, `last_commit_date`, `last_commit_repo`, `languages` (jsonb), `repositories` (jsonb), `cached_at` | Single cached row |
| `github_pull_requests` | `id`, `merged`, `open`, `closed` (jsonb, `{ totalCount, items }`), `cached_at` | Single cached row |

Schemas live in `src/modules/*/*.schema.ts`, and drizzle-kit picks them up through [`drizzle.config.ts`](drizzle.config.ts). Migrations are SQL files in [`drizzle/`](drizzle) and run automatically on startup.

To change the schema:

```bash
# 1. edit src/modules/<module>/<module>.schema.ts
npm run db:generate   # 2. generate a new SQL migration in drizzle/
npm run dev           # 3. it's applied on next start (or: npm run db:migrate)
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env`. All variables are validated at startup.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | HTTP port (default `3000`) |
| `DATABASE_URL` | yes | Postgres connection string |
| `GITHUB_TOKEN` | yes | GitHub token used for the GraphQL API |
| `RESEND_API_KEY` | yes | Resend API key |
| `CONTACT_FROM_EMAIL` | yes | Sender address (must be on a domain verified in Resend) |
| `CONTACT_TO_EMAIL` | yes | Where contact emails are delivered |
| `CORS_ORIGINS` | no | Comma-separated allowed origins. Empty or unset falls back to the production origins |

## Development

Requires Node.js 22+ and a reachable Postgres instance.

```bash
cp .env.example .env
npm install
npm run dev          # tsx watch src/server.ts
```

| Script | Description |
| --- | --- |
| `npm run dev` | Run with `tsx` in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply migrations manually |
| `npm run db:studio` | Open Drizzle Studio |

> To call the API from the local frontend, set `CORS_ORIGINS=http://localhost:5173` here and `VITE_API_URL=http://localhost:3000` in `web/.env`.

## Docker

The [`Dockerfile`](Dockerfile) is a two-stage build on `node:22-alpine`:

1. **builder**: `npm ci` + `tsc`
2. **runner**: production dependencies only (`npm ci --omit=dev`), `dist/` and `drizzle/`, `NODE_ENV=production`

The container exposes port `3000` and runs `node dist/server.js`.
