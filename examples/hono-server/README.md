# Hono Server Example

Hono + Drizzle + SQLite API starter with OpenAPI and Scalar docs.

## Run

```sh
pnpm --filter example-hono-server dev
```

- API: `http://localhost:8787`
- Docs: `http://localhost:8787/docs`
- OpenAPI: `http://localhost:8787/openapi.json`

## Database

The default SQLite file is `.data/starter.db` inside this example package. Override it with:

```sh
DATABASE_URL=/absolute/path/app.db pnpm --filter example-hono-server dev
```

## Smoke Test

```sh
curl -X POST http://localhost:8787/api/todos \
  -H 'content-type: application/json' \
  -d '{"title":"New todo"}'
```

Run with the React app:

```sh
PROXY_TARGET=http://localhost:8787 pnpm --filter example-react-app dev
```
