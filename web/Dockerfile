# Build from the repo root so the posts/ folder is in the context:
#   docker build -f web/Dockerfile .
FROM node:20-alpine AS build

WORKDIR /app/web

COPY web/package.json web/package-lock.json* ./
RUN npm ci

COPY web/ ./
COPY posts/ ../posts/
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/web/dist /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5189

CMD ["nginx", "-g", "daemon off;"]
