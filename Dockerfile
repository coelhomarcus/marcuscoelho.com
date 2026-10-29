FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY api/package.json api/package.json
COPY web/package.json web/package.json
RUN npm ci

FROM dependencies AS builder

COPY api api
COPY web web
COPY posts posts
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./
COPY api/package.json api/package.json
COPY web/package.json web/package.json
RUN npm ci --omit=dev --workspace @marcuscoelho/api \
    && npm cache clean --force

COPY --from=builder /app/api/dist api/dist
COPY --from=builder /app/api/drizzle api/drizzle
COPY --from=builder /app/web/dist web/dist

ENV NODE_ENV=production

WORKDIR /app/api

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]
