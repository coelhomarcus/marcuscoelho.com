<img alt="logo" src="public/assets/icons/favicon.ico">

## web

Frontend of my personal site: a statically built React SPA with an MDX blog, served by nginx.

## Stack

<p>
<img alt="React" src="https://img.shields.io/badge/-React-61DAFB?style=plastic&logo=react&logoColor=black" />
<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=plastic&logo=typescript&logoColor=white" />
<img alt="Tailwind CSS" src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=plastic&logo=tailwindcss&logoColor=white" />
<img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=plastic&logo=vite&logoColor=white" />
<img alt="React Router" src="https://img.shields.io/badge/-React%20Router-CA4245?style=plastic&logo=reactrouter&logoColor=white" />
<img alt="Motion" src="https://img.shields.io/badge/-Motion-EE0000?style=plastic&logo=framer&logoColor=white" />
<img alt="MDX" src="https://img.shields.io/badge/-MDX-1B1F24?style=plastic&logo=mdx&logoColor=white" />
<img alt="nginx" src="https://img.shields.io/badge/-nginx-009639?style=plastic&logo=nginx&logoColor=white" />
<p/>

- **UI:** React 19, Tailwind CSS 4 (`@tailwindcss/vite` + typography plugin), shadcn/ui (Radix), Motion
- **Routing:** React Router 7 (`BrowserRouter`)
- **Content:** MDX 3 via `@mdx-js/rollup` + `remark-frontmatter`
- **Build:** Vite, TypeScript 5.7 (`tsc -b` type check before bundling)
- **Serving:** nginx (Alpine) in Docker

## Routes

| Path | Component | Loading |
| --- | --- | --- |
| `/` | `pages/about/about-page` | eager |
| `/projects` | `pages/projects/projects-page` | eager |
| `/blog` | `pages/blog/blog-page` | eager |
| `/blog/:slug` | `pages/blog/post-page` | eager shell, post body lazy-loaded |
| `/certificates` | `pages/certificates/certificates-page` | `React.lazy` |
| `/contact` | `pages/contact/contact-page` | eager |
| `*` | `pages/not-found/not-found-page` | `React.lazy` |

Page changes are animated with `AnimatePresence` keyed on `location.pathname`.

## Project structure

```
web/
├── public/assets/           # static images: icons, projects/<name>/, posts/<date>/, works/
├── scripts/
│   └── generate-posts.mjs   # builds src/data/blog-posts.ts from MDX frontmatter
├── nginx.conf
└── src/
    ├── main.tsx             # BrowserRouter + ToastProvider
    ├── app.tsx              # layout and route table
    ├── pages/               # one folder per page (posts live in ../posts, see below)
    │   └── <name>/
    │       ├── <name>-page.tsx
    │       ├── components/  # components only this page uses
    │       └── hooks/       # hooks only this page uses
    ├── components/          # shared across pages
    │   ├── layout/          # app shell: header, footer, sidebar/, page-transition, scroll-to-top
    │   ├── ui/              # primitives (shadcn, rail-toc, tooltip)
    │   ├── icons/           # animated lucide icons + use-animated-icon
    │   └── toast/, page-title, social-link, project-modal
    ├── hooks/               # shared hooks (use-projects, use-github-stats)
    ├── data/                # site content: projects, experience, skills, certificates, navigation, config
    ├── lib/                 # utils, motion presets, request cache
    └── types/               # domain types (props types live next to their component)
```

Where things go: code used by **one page** lives in that page's folder; code used by **two or more pages** (or the app shell) lives in `src/components/` or `src/hooks/`. Content you edit by hand always lives in `src/data/`. Single-file components are plain files (`page-title.tsx`); a folder is only used when a component has several files (`sidebar/`, `work-experience/`).

### Naming conventions

Everything in code is in English; only user-facing text is in Portuguese.

| What | File / folder | Identifier |
| --- | --- | --- |
| Any file or folder | `kebab-case` (same as `api/`, `ui/` and `icons/`) | |
| Component | `project-card.tsx` | `ProjectCard` (default export) |
| Page | `pages/<name>/<name>-page.tsx` | `ProjectsPage` |
| Hook | `use-github-stats.ts` | `useGitHubStats` |
| Context | `toast-context.ts` | `ToastContext`, `useToast` |
| Content data | `data/experience.ts` | `experience` (plain noun, no `arr` prefix) |
| Types | `types/index.ts` | `PascalCase`; props types (`ProjectCardProps`) stay in the component file |

Keeping file names lowercase also avoids case-only renames, which macOS (case-insensitive) and Linux / Docker (case-sensitive) resolve differently.

Header, sidebar and footer links all come from [`src/data/navigation.ts`](src/data/navigation.ts).

The `@/` alias resolves to `src/`, and `@posts/` to the repo-level [`posts/`](../posts) folder.

## Content model

Almost all site content is static data in `src/data/`. Changing the site usually means editing a typed array:

| File | Content |
| --- | --- |
| `projects.ts` | `Project[]`: name, description, tech, optional `link`, `repo`, `favicon`, `images` |
| `experience.ts` | `Work[]`: companies, work mode, positions, periods, highlights, skills |
| `skills.ts` | Skill icons and links |
| `certificates.ts` | Certificates |
| `config.ts` | Runtime config derived from `VITE_*` env vars |
| `blog-posts.ts` | **Generated**, don't edit by hand |

Project assets are resolved relative to `public/assets/projects/`, so `favicon: "dbunny/favicon.svg"` maps to `public/assets/projects/dbunny/favicon.svg`.

### Blog pipeline

Posts are `.mdx` files in the repo-level [`posts/`](../posts) folder, outside the web app:

```mdx
---
title: Post title
desc: One-line description
date: 19.09.2026
tags: react, typescript
banner: "/assets/posts/19-09-2026/banner.webp"
---

Markdown / MDX content...
```

1. **Index generation:** `scripts/generate-posts.mjs` runs before `dev` and `build`. It parses each file's frontmatter, sorts by `date` (`DD.MM.YYYY`, newest first), splits `tags` on commas and writes `src/data/blog-posts.ts`. The blog listing only imports this file, never the MDX itself.
2. **Compilation:** `@mdx-js/rollup` (with `enforce: "pre"`) compiles MDX to React components. `remark-frontmatter` strips the YAML block from the output. Elements are mapped to styled components through `MDXProvider` and [`pages/blog/components/mdx-components.tsx`](src/pages/blog/components/mdx-components.tsx).
3. **Loading:** [`blog/load-post.ts`](src/pages/blog/load-post.ts) uses `import.meta.glob("@posts/*.mdx")` and `loadPost(slug)` resolves the module whose **file name** matches the slug. Because the folder sits outside `web/`, [`vite.config.ts`](vite.config.ts) also allows it in `server.fs.allow`, dedupes `react` / `@mdx-js/react` so compiled MDX resolves them from `web/node_modules`, and [`index.css`](src/index.css) adds it as a Tailwind `@source`.
4. **Chunking:** `manualChunks` in [`vite.config.ts`](vite.config.ts) puts every post in its own chunk at `assets/posts/<name>-[hash].js`, so a post is only downloaded when it's opened.

The slug is always the file name without `.mdx` (e.g. `19-09-2026.mdx` → `/blog/19-09-2026`).

### Bundle splitting

Besides per-post chunks, `node_modules` is split into `react-icons`, `syntax-highlighter` (`react-syntax-highlighter`) and a shared `vendor` chunk.

## API integration

Data from the [API](../api) is fetched by hooks (shared ones in `src/hooks/`, page-specific ones in `src/pages/<Page>/hooks/`):

| Hook | Endpoint | Used by |
| --- | --- | --- |
| `useGitHubCalendar` (`pages/about/hooks`) | `GET /github/contributions` | Contribution graph on `/` |
| `useGitHubStats` | `GET /github/stats` | `useProjects` |
| `useProjects` | via `useGitHubStats` | Merges `repositories` into `projects.ts` by normalized repo URL, adding `repoStars` and `repoCreatedAt` |
| `useContact` (`pages/contact/hooks`) | `POST /contact` | Contact form state, client-side validation (same rules as the API) and submit status |

GET requests go through `createRequestCache` ([`src/lib/request-cache.ts`](src/lib/request-cache.ts)), a module-level memoizer that:

- returns the resolved value if it was already fetched,
- shares the in-flight promise between concurrent callers (no duplicate requests when several components mount at once),
- clears the pending promise on failure so a later mount can retry.

The cache lives for the lifetime of the page, so navigating between routes doesn't refetch.

## Environment variables

Copy [`.env.example`](.env.example) to `.env`.

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | API base URL used by builds. Ignored in dev, where the site always calls `/api` | `https://api.marcuscoelho.com` |
| `API_PROXY_TARGET` | Where the dev server forwards `/api` | production API |

> `VITE_*` variables are inlined into the bundle at build time. Never put secrets here.

The production API only accepts the production origins (CORS), so in dev the site calls `/api` on its own origin and the Vite dev server forwards it server-side (see `server.proxy` in [`vite.config.ts`](vite.config.ts)). Against production only `/api/github/*` is forwarded, so local runs read real GitHub data but the contact form can't write to the production database or send emails. To work against a local [API](../api), contact form included, set `API_PROXY_TARGET=http://localhost:3000`; the proxy forwards all of `/api` there, so the local API needs no CORS setup.

## Development

```bash
npm install
npm run dev        # generate post index, start Vite dev server
```

| Script | Description |
| --- | --- |
| `npm run dev` | Generate post index + Vite dev server |
| `npm run build` | Generate post index, type check (`tsc -b`), bundle to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint (typescript-eslint, react-hooks, react-refresh) |

## Docker

The [`Dockerfile`](Dockerfile) builds from the **repo root**, so `posts/` is in the context (ignore rules live in [`Dockerfile.dockerignore`](Dockerfile.dockerignore)):

```bash
docker build -f web/Dockerfile .
```

It's a two-stage build:

1. **build** (`node:20-alpine`): `npm ci` + `npm run build`
2. **serve** (`nginx:alpine`): copies `dist/` to `/usr/share/nginx/html` along with [`nginx.conf`](nginx.conf)

nginx listens on port `5189` and falls back to `index.html` for any unknown path (`try_files $uri $uri/ /index.html`), so client-side routes work on refresh.

Caching is split by how each file is named:

| Files | `Cache-Control` | Why |
| --- | --- | --- |
| `index.html` | `no-cache` | Always revalidated, so a new deploy never serves HTML pointing to chunks that no longer exist |
| `*.js`, `*.css` | `public, max-age=31536000, immutable` | Emitted by Vite with a content hash in the file name |
| Images, icons, fonts | `public, max-age=3600, must-revalidate` | Files from `public/` keep their names, so replacing one is picked up within an hour (revalidated via `ETag`) |
