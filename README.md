<img alt="logo" src="https://marcuscoelho.com/assets/icons/favicon.ico">

##

Site pessoal, minimalista, direto ao ponto — e a API que dá vida a ele.

Tudo em um único repositório: o frontend em [`web/`](web) e o backend em [`api/`](api).

## Stack

<p>
<img alt="React" src="https://img.shields.io/badge/-React-61DAFB?style=plastic&logo=react&logoColor=black" />
<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=plastic&logo=typescript&logoColor=white" />
<img alt="Tailwind CSS" src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=plastic&logo=tailwindcss&logoColor=white" />
<img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=plastic&logo=vite&logoColor=white" />
<img alt="MDX" src="https://img.shields.io/badge/-MDX-1B1F24?style=plastic&logo=mdx&logoColor=white" />
<img alt="Node.js" src="https://img.shields.io/badge/-Node.js-5FA04E?style=plastic&logo=nodedotjs&logoColor=white" />
<img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=plastic&logo=express&logoColor=white" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=plastic&logo=postgresql&logoColor=white" />
<img alt="Drizzle" src="https://img.shields.io/badge/-Drizzle-C5F74F?style=plastic&logo=drizzle&logoColor=black" />
<img alt="Docker" src="https://img.shields.io/badge/-Docker-2496ED?style=plastic&logo=docker&logoColor=white" />
<p/>

## Estrutura

| Pasta | O que é | Onde roda |
| --- | --- | --- |
| [`web/`](web) | Frontend — o site em si (React + Vite + MDX) | [marcuscoelho.com](https://marcuscoelho.com) |
| [`api/`](api) | Backend — formulário de contato e dados do GitHub (Express + Postgres) | [api.marcuscoelho.com](https://api.marcuscoelho.com) |

Cada pasta é um projeto independente, com seu próprio `package.json`, `Dockerfile` e README explicando os detalhes.

## Como as partes conversam

```
 navegador ──► web (nginx, arquivos estáticos)
     │
     └──────► api ──► PostgreSQL   (contatos + cache do GitHub)
                 ├──► GitHub GraphQL (contribuições, stats, repositórios)
                 └──► Resend         (e-mail do formulário de contato)
```

- O site é estático: posts, projetos e certificados ficam no próprio código.
- A API só existe para o que precisa de servidor: guardar mensagens de contato, enviar e-mail e manter um cache dos dados do GitHub (o token nunca vai para o navegador).

## Rodando localmente

```bash
# frontend
cd web
npm install
npm run dev

# api (em outro terminal)
cd api
cp .env.example .env   # preencha as variáveis
npm install
npm run dev
```

Detalhes em [`web/README.md`](web/README.md) e [`api/README.md`](api/README.md).

## Deploy

Os dois apps são deployados com [Dokploy](https://dokploy.com) a partir deste repositório, cada um com seu próprio **Build Path** e **Watch Paths**:

| App | Build Path | Watch Paths |
| --- | --- | --- |
| web | `/web` | `web/**` |
| api | `/api` | `api/**` |

Assim, um push que só mexe no frontend não redeploya a API, e vice-versa.
