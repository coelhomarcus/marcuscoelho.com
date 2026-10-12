<img alt="logo" src="https://marcuscoelho.com/assets/icons/favicon.ico">

## api

O backend do [marcuscoelho.com](https://marcuscoelho.com), rodando em [api.marcuscoelho.com](https://api.marcuscoelho.com).

Pequena e focada: recebe as mensagens do formulário de contato e mantém um cache dos meus dados do GitHub para o site exibir.

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

## Endpoints

### `POST /contact`

Recebe uma mensagem do formulário de contato.

```json
{
  "name": "Fulano",
  "email": "fulano@email.com",
  "message": "Olá! Vi seu portfólio e..."
}
```

- Validação com Zod: `name` ≥ 2 caracteres, `email` válido, `message` ≥ 10 caracteres. Se falhar, responde `400` com os erros por campo.
- A mensagem é salva no Postgres e em seguida enviada por e-mail via **Resend** (com `reply-to` apontando para quem escreveu). O envio do e-mail não bloqueia a resposta.
- Responde `201` com o contato criado.

### `GET /github/contributions`

Calendário de contribuições do GitHub (o "gráfico de quadradinhos").

```json
{ "totalContributions": 1234, "weeks": [...], "cachedAt": "..." }
```

### `GET /github/stats`

Estatísticas agregadas do perfil:

| Campo | O que é |
| --- | --- |
| `totalStars` | Soma das stars dos meus repositórios |
| `mergedPRs` / `closedIssues` | PRs mergeados e issues fechadas |
| `currentStreak` | Dias seguidos com contribuição |
| `lastCommitDate` / `lastCommitRepo` | Último push (nome omitido se o repo for privado) |
| `languages` | Linguagens mais usadas |
| `repositories` | Repositórios públicos com stars e datas — o site usa para enriquecer a lista de projetos |

### Erros

Erros seguem um formato único:

```json
{ "error": { "code": "INTERNAL_ERROR", "message": "Erro interno do servidor" } }
```

## Cache do GitHub

Consultar a API GraphQL do GitHub a cada visita seria lento e gastaria rate limit, então a API guarda os resultados no Postgres:

1. Ao subir, busca contribuições e stats e salva no banco.
2. Um cron (`node-cron`) atualiza tudo **a cada 6 horas**.
3. Os endpoints `/github/*` leem direto do cache. Se o cache estiver vazio, buscam no GitHub na hora.

O `GITHUB_TOKEN` fica só no servidor — nunca chega ao navegador.

## Banco de dados

Postgres com **Drizzle ORM**. Tabelas:

| Tabela | Conteúdo |
| --- | --- |
| `contacts` | Mensagens recebidas pelo formulário |
| `github_contributions` | Cache do calendário de contribuições |
| `github_stats` | Cache das estatísticas e repositórios |

Os schemas ficam em `src/modules/*/*.schema.ts` e as migrations em [`drizzle/`](drizzle). **As migrations rodam automaticamente quando o servidor sobe**, então um deploy com schema novo já atualiza o banco.

## Estrutura

```
api/
├── drizzle/              # migrations SQL geradas pelo drizzle-kit
└── src/
    ├── server.ts         # entrada: roda migrations, sobe o servidor e agenda o cron
    ├── app.ts            # Express: CORS, rotas e handler de erros
    ├── config/           # env (validado com Zod) e conexão com o banco
    ├── modules/
    │   ├── contact/      # routes → controller → service, + schema e validação
    │   └── github/
    └── shared/           # envio de e-mail e tratamento de erros
```

Cada módulo segue o mesmo padrão: `routes` define a rota, `controller` valida a entrada e monta a resposta, `service` tem a regra de negócio e o acesso ao banco.

## Variáveis de ambiente

Copie `.env.example` para `.env`. Todas são validadas com Zod na inicialização — se faltar alguma, a API não sobe.

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta do servidor (padrão `3000`) |
| `DATABASE_URL` | Connection string do Postgres |
| `GITHUB_TOKEN` | Token do GitHub para a API GraphQL |
| `RESEND_API_KEY` | Chave da API do Resend |
| `CONTACT_FROM_EMAIL` | Remetente dos e-mails de contato (domínio verificado no Resend) |
| `CONTACT_TO_EMAIL` | Para onde os e-mails de contato são enviados |

## Rodando localmente

Precisa de um Postgres acessível pela `DATABASE_URL`.

```bash
cp .env.example .env
npm install
npm run dev          # tsx em modo watch
```

Outros scripts:

```bash
npm run build        # compila para dist/
npm start            # roda o build
npm run db:generate  # gera uma migration a partir dos schemas
npm run db:migrate   # aplica as migrations manualmente
npm run db:studio    # abre o Drizzle Studio
```

> O CORS só libera `marcuscoelho.com` e `www.marcuscoelho.com`. Para testar com o frontend local, ajuste a origem em [`src/app.ts`](src/app.ts).

## Deploy

O [`Dockerfile`](Dockerfile) compila o TypeScript em um estágio de build e gera uma imagem enxuta só com as dependências de produção, o `dist/` e as migrations. Expõe a porta `3000`.

No Dokploy, o app usa **Build Path** `/api`, com as variáveis de ambiente configuradas no painel.
