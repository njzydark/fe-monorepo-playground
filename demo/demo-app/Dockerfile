FROM node:22-alpine AS builder
ARG APP_PATH
ARG APP_NAME

WORKDIR /app

COPY . .

RUN corepack enable pnpm && \
    pnpm install --frozen-lockfile --filter $APP_NAME... && \
    pnpm --filter $APP_NAME run build

FROM nginx:alpine
ARG APP_PATH

COPY --from=builder /app/$APP_PATH/dist /usr/share/nginx/html
COPY $APP_PATH/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
