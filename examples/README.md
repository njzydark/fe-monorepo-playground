# Examples

Concrete technology choices live in `examples/*` so the root template stays small.

| Example          | Purpose                                                                    | Run                                     |
| ---------------- | -------------------------------------------------------------------------- | --------------------------------------- |
| `react-app`      | Todo CRUD UI with Base UI, Zustand actions, and configurable Hono API URL. | `pnpm --filter example-react-app dev`   |
| `hono-server`    | Hono API server with Drizzle, SQLite, OpenAPI, Scalar docs, and todo CRUD. | `pnpm --filter example-hono-server dev` |
| `shared-example` | Shared todo types and filter metadata imported by `react-app`.             | `pnpm --filter example-shared build`    |

Run the full-stack Todo example:

```sh
pnpm --filter example-hono-server dev
PROXY_TARGET=http://localhost:8787 pnpm --filter example-react-app dev
```

- App: `http://localhost:3000`
- API docs: `http://localhost:8787/docs`

The React app defaults to the Rsbuild proxy. Use the `API` button in the Todo panel to switch to a direct API base URL such as `http://localhost:8787`.

## Notes

- Keep demo-specific dependencies and configuration inside the example that owns them.
- Put real shared product code in `packages/*`.
- Add a root `tsconfig.json` reference when an example participates in `pnpm tsc -b .`.
