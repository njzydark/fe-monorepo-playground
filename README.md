# fe-monorepo-playground

An AI-native frontend monorepo template built around Rsstack, pnpm catalogs, source build, live types, and agent-readable conventions.

## What's Inside

- Rsbuild, Rslib, Rstest, TypeScript, pnpm catalogs, OXLint, OXFmt, and Stylelint.
- Shared infra presets in `infra/tools` with thin package-local config files.
- Agent guidance in `AGENTS.md` and `.agents/skills/*`.
- Runnable examples in `examples/*` for concrete framework choices.

## Directory Model

- `infra/tools` provides shared Rsbuild, Rslib, and Rstest presets.
- `packages/*` contains reusable workspace packages.
- `apps/*` is reserved for real product applications.
- `examples/*` contains runnable templates and technology-specific examples.
- `.agents/skills/*` documents repeatable workflows for AI coding agents.

## Examples

See [examples/README.md](./examples/README.md) for the current example catalog.

- `examples/react-app` shows a React Todo CRUD UI with Base UI, Zustand actions, and a configurable Hono API URL.
- `examples/hono-server` shows a Hono API server with Drizzle, SQLite, OpenAPI, Scalar docs, and todo CRUD endpoints.
- `examples/shared-example` provides Todo types and filter metadata imported by `examples/react-app`.

## Quick Start

Use Node.js 22 or newer.

Enable corepack:

```bash
npm install -g corepack
corepack enable
```

This only needs to be done once per machine.

Install dependencies:

```bash
corepack install
pnpm i
```

Start the full-stack Todo example:

```bash
pnpm --filter example-hono-server dev
PROXY_TARGET=http://localhost:8787 pnpm --filter example-react-app dev
```

Open the app at `http://localhost:3000`.
Open the API docs at `http://localhost:8787/docs`.

Validate the workspace:

```bash
pnpm lint
pnpm format:check
pnpm tsc -b .
pnpm build:examples
```
