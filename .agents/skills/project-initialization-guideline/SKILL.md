---
name: project-initialization-guideline
description: Initialize a forked copy of this AI-native frontend monorepo template for a real product or new project. Use when renaming the template, choosing which examples to keep, creating initial apps/packages, converting examples into product code, configuring root scripts, or preparing the first clean project baseline.
---

# Project Initialization Guideline

Use this skill when a user forks this template and asks to turn it into a specific project. The goal is to keep the root template small, make project choices explicit, and avoid copying demo-only assumptions into production code by accident.

## Default Flow

1. Clarify the target project shape:
   - product name and package naming convention
   - app type: frontend-only, fullstack, library-first, or examples-only
   - runtime target: browser, Node.js server, edge/serverless, Docker, or static hosting
   - whether examples should be kept, copied, or deleted
2. Inspect current workspace state:
   - `package.json`
   - `pnpm-workspace.yaml`
   - `tsconfig.json`
   - `README.md`
   - `examples/README.md`
   - existing `apps/*`, `packages/*`, `examples/*`
3. Decide which template assets are reusable:
   - keep `infra/tools`, root lint/format/typecheck config, and `.agents/skills`
   - keep examples only when they are useful as runnable references
   - copy example code into `apps/*` or `packages/*` only when it becomes product code
4. Apply changes in this order:
   - package metadata and workspace catalog changes
   - app/package directories and TypeScript project references
   - source code and imports
   - docs and root scripts
   - install and validation

## Directory Decisions

- Use `apps/*` for real product applications.
- Use `packages/*` for reusable product libraries.
- Use `examples/*` for copyable demos, starters, and technology references.
- Do not put project-specific theme tokens, demo schemas, or product UI into `packages/*` unless they are deliberately reusable product libraries.
- Do not keep stale examples in `examples/*` after they are merged into another example or promoted into an app.

## Example Promotion

When turning an example into product code:

1. Copy or move it into `apps/*` rather than continuing development inside `examples/*`.
2. Rename the package from `example-*` to the product package name.
3. Update internal dependencies to use `workspace:*`.
4. Add or update `tsconfig.json` project references.
5. Remove demo-only docs, seeded content, and generated data.
6. Keep the original example only if it remains useful as a minimal reference.

## Fullstack Starter Guidance

For a fullstack project based on the current examples:

Check `examples/README.md` first; the list below describes this template's current baseline and should be updated if examples change.

- Use `examples/react-app` as the frontend reference:
  - React Router for app shell and pages
  - Base UI for accessible primitives
  - Zustand actions for remote Todo state
  - configurable API base URL during development
- Use `examples/hono-server` as the API reference:
  - Hono for routes
  - Drizzle + SQLite for local persistence
  - OpenAPI + Scalar for API playground
- Use `examples/shared-example` only for intentionally shared contracts and metadata.
- If adding AI features, prefer a new fullstack app or example instead of expanding the basic Todo starter indefinitely.

## Root Metadata Checklist

Update these files after forking:

- `package.json`
  - `name`
  - `repository`
  - `author`
  - `bugs`
  - `homepage`
  - root scripts such as `dev`, `dev:api`, `dev:web`, or `dev:fullstack`
- `README.md`
  - project name and purpose
  - quick start for the chosen app
  - environment variables
  - validation commands
- `pnpm-workspace.yaml`
  - catalogs for shared dependency versions
  - workspace globs only when directory model changes
- `tsconfig.json`
  - references for all apps/packages/examples that should participate in `pnpm tsc -b .`

## Cleanup Checklist

- Remove generated directories from examples or apps:
  - `dist`
  - `types`
  - `.data`
  - `*.tsbuildinfo`
- Do not commit `node_modules`. Only delete local `node_modules` when cleaning an accidental artifact, preparing an archive, or explicitly resetting dependencies.
- Confirm `.gitignore` covers local runtime data.
- Remove stale README rows and stale TypeScript references when deleting examples.
- Check `git status --short` for `AD`, deleted, or stale generated files before finishing.

## Validation

Run the narrowest useful validation first, then the full workspace checks:

```bash
pnpm install
pnpm format:check
pnpm lint
pnpm tsc -b .
pnpm build:examples
```

For runnable apps, also start the relevant dev servers and smoke-test the primary workflow in a browser.

## Avoid

- Do not move all concrete examples into `packages/*`; examples should remain examples.
- Do not keep two examples that demonstrate the same thing unless their difference is explicit.
- Do not add framework dependencies to the root package unless they are root tooling.
- Do not rename workspace packages without updating imports, project references, docs, and lockfile.
- Do not silently raise runtime requirements such as Node.js version without updating `package.json` and README.
