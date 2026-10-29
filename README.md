<img alt="logo" src="web/public/assets/icons/favicon.ico">

## marcuscoelho.com

Meu site pessoal é uma aplicação única organizada como um monorepo npm:

- `web/`: SPA React, Vite e MDX;
- `api/`: servidor Express, PostgreSQL e integrações externas;
- `posts/`: conteúdo MDX do blog.

Em produção, um único processo Express atende a API em `/api/*` e entrega o
build do frontend. O navegador nunca acessa um domínio separado para a API.

## Desenvolvimento

Requer Node.js 22+, npm e PostgreSQL. O banco local pode ser iniciado com
Docker:

```bash
docker compose up -d postgres
cp api/.env.example api/.env
npm install
npm run dev
```

O comando `dev` inicia Express em `http://localhost:3000` e Vite em
`http://localhost:5173`; Vite encaminha `/api` para o Express.

| Comando | Função |
| --- | --- |
| `npm run dev` | API e frontend com hot reload |
| `npm run build` | Compila frontend e backend |
| `npm start` | Inicia o serviço unificado após o build |
| `npm run lint` | Executa o lint do frontend |
| `npm run db:generate` | Gera migrations Drizzle |
| `npm run db:migrate` | Aplica migrations manualmente |

## Docker

O [`Dockerfile`](Dockerfile) da raiz compila os dois workspaces e produz uma
única imagem Node.js. Para testar o artefato completo com PostgreSQL:

```bash
docker compose up --build
```

A aplicação fica disponível na porta `3000` e expõe o healthcheck em
`/api/health`.

## Deploy no Dokploy

Use o `Dockerfile` da raiz em um único serviço, exponha a porta `3000` e copie
para ele apenas as variáveis de `api/.env.example`. O frontend não possui
variáveis de ambiente: todas as requisições usam `/api` na mesma origem.

Depois de validar o healthcheck, as migrations, o formulário e as páginas de
hobbies, aponte `marcuscoelho.com` e `www.marcuscoelho.com` para esse serviço.
O frontend, a API e o subdomínio legado da API podem então ser desativados.

## Contato

- Site: [marcuscoelho.com](https://marcuscoelho.com)
- LinkedIn: [in/coelhomarcus](https://www.linkedin.com/in/coelhomarcus/)
- GitHub: [@coelhomarcus](https://github.com/coelhomarcus)
