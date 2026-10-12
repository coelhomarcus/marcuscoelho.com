<img alt="logo" src="https://marcuscoelho.com/assets/icons/favicon.ico">

## web

O frontend do [marcuscoelho.com](https://marcuscoelho.com): um site estático, minimalista, feito para apresentar quem sou, o que construo e o que penso.

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

## Páginas

| Rota | Página |
| --- | --- |
| `/` | **Sobre** — quem sou, skills, experiência e gráfico de contribuições do GitHub |
| `/projects` | **Projetos** — trabalhos e ideias que saíram do papel |
| `/blog` | **Blog** — textos sobre programação, tecnologia e afins |
| `/blog/:slug` | Post individual |
| `/certificates` | **Certificados** — cursos e certificações |
| `/contact` | **Contato** — formulário que envia a mensagem para a [API](../api) |

## Estrutura

```
web/
├── public/assets/      # imagens: ícones, projetos, posts, empresas
├── scripts/
│   └── generate-posts.mjs   # gera src/data/blogPostsData.ts a partir dos .mdx
└── src/
    ├── pages/          # uma pasta por página (Blog/posts guarda os .mdx)
    ├── components/     # componentes reutilizáveis
    ├── data/           # conteúdo do site: projetos, skills, experiências, certificados
    ├── hooks/          # chamadas à API (contato, GitHub) e composição de dados
    ├── lib/            # utilitários, animações, componentes do MDX, cache de requests
    └── types/
```

Quase todo o conteúdo do site mora em `src/data/` — para mudar algo, geralmente é só editar um array.

## Conteúdo

### Projetos

Ficam em [`src/data/projects.ts`](src/data/projects.ts). Cada projeto tem nome, descrição, techs e, opcionalmente, link, repositório, favicon e imagens (em `public/assets/projects/<projeto>/`).

Se o projeto tiver `repo`, o site cruza com os dados do GitHub vindos da API e mostra automaticamente as **stars** e a **data de criação** do repositório.

### Posts

Os posts são arquivos `.mdx` em [`src/pages/Blog/posts/`](src/pages/Blog/posts), com frontmatter:

```mdx
---
title: Título do post
desc: Uma linha de descrição
date: 19.09.2026
tags: react, typescript
banner: "/assets/posts/19-09-2026/banner.webp"
---

Conteúdo em Markdown/MDX...
```

- O `slug` é o nome do arquivo (ou o campo `slug`, se existir).
- A data segue o formato `DD.MM.YYYY` e define a ordem no blog.
- Antes do `dev` e do `build`, o script [`scripts/generate-posts.mjs`](scripts/generate-posts.mjs) lê os frontmatters e gera a listagem — basta criar o arquivo e ele aparece.
- Cada post vira um chunk separado no build, carregado só quando é aberto.

## Integração com a API

O site consome a [API](../api) em três pontos:

| Endpoint | Usado em |
| --- | --- |
| `GET /github/contributions` | Gráfico de contribuições na página Sobre |
| `GET /github/stats` | Stats do GitHub e stars/datas dos projetos |
| `POST /contact` | Formulário de contato |

## Variáveis de ambiente

Copie `.env.example` para `.env`:

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API | `https://api.marcuscoelho.com` |
| `VITE_ENV` | `dev` ou `prod`. Em `dev`, o gráfico de contribuições usa dados mockados | `prod` |

> Variáveis `VITE_*` são embutidas no bundle no momento do build — não coloque segredos aqui.

## Rodando localmente

```bash
npm install
npm run dev       # gera os posts e sobe o Vite
```

Outros scripts:

```bash
npm run build     # gera os posts, checa os tipos e builda para dist/
npm run preview   # serve o build localmente
npm run lint
```

## Deploy

O [`Dockerfile`](Dockerfile) builda o site com Node e serve o `dist/` com **nginx** na porta `5189`. O [`nginx.conf`](nginx.conf) redireciona qualquer rota para o `index.html` (SPA) e aplica cache longo nos assets.

No Dokploy, o app usa **Build Path** `/web`.
