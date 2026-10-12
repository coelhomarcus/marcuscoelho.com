# marcuscoelho.com

Monorepo do meu site pessoal e da API que o alimenta.

| Pasta | O que é | Domínio |
| --- | --- | --- |
| [`web/`](web) | Frontend (React + Vite + Tailwind + MDX) | marcuscoelho.com |
| [`api/`](api) | API (Express + Drizzle + Postgres) | api.marcuscoelho.com |

Cada pasta é um projeto independente, com seu próprio `package.json` e `Dockerfile`.

## Rodando localmente

```bash
# frontend
cd web && npm install && npm run dev

# api (copie .env.example para .env e preencha)
cd api && npm install && npm run dev
```

## Deploy

Os dois apps são deployados via Dokploy a partir deste repositório, cada um com seu próprio Build Path (`/web` e `/api`).
