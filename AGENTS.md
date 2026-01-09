# AGENTS.md - Instructions for AI Coding Agents

This document provides guidelines for agents working in this monorepo.

## Monorepo structure

- `infra/tools` — infra-tools: preset config for rstest, rsbuild, rslib
- `eslint.config.mjs` — ESLint configuration
- `prettier.config.mjs` — Prettier configuration
- `stylelint.config.mjs` — Stylelint configuration
- `rstest.config.ts` — Test global configuration
- `tsconfig.*.json` — TypeScript configurations
- `packages/` — lib packages
- `apps/` — app packages
- `demo/` — demo packages (demo-app, demo-package, demo-shared)

## Build, Lint, and Test Commands

```bash
# App dev server (run inside app package directory)
pnpm rsbuild dev
# App build
pnpm rsbuild build
# App preview production build
pnpm rsbuild preview
# Library build
pnpm rslib build
# Type check a single file
pnpm tsc --noEmit path/to/file.ts
# Format a single file
pnpm prettier --write path/to/file.ts
# Lint a single file (with auto-fix)
pnpm eslint --fix --write path/to/file.ts
# Run a single test file
pnpm rstest path/to/file.test.ts
```

## Code Style Guidelines

### Formatting (Prettier)

- Print width: 120 characters
- Tab width: 2 spaces
- Trailing commas: all
- Semicolons: no
- Single quotes: yes
- Arrow functions: always wrap parentheses around parameters

### Imports

- Use workspace package names for internal dependencies (e.g., `import { fn } from 'demo-shared'`)
- Use relative imports only for files in the same package (`./components`, `../utils`)
- Group imports in this order:
  1. npm packages (alphabetically)
  2. workspace packages (alphabetically)
  3. relative imports (alphabetically)

### TypeScript

- Enable strict mode (`strict: true` in tsconfig)
- Avoid `any` type; use `unknown` or specific types instead
- Avoid `@ts-ignore` comments
- Use explicit return types for exported functions
- Use interface for object types, type for unions/primitives
- App packages extend `tsconfig.app.json`
- Library packages extend `tsconfig.module.json`

### Naming Conventions

- Variables/functions: camelCase (`const handleClick = () => {}`)
- Components: PascalCase (`export const Button = () => {}`)
- Constants: SCREAMING_SCREAM_CASE
- CSS Modules: camelCase with descriptive names (`styles.containerWrapper`)
- Files: kebab-case for non-components, PascalCase for components (`.tsx`)

### React Components

- Use functional components with TypeScript interfaces for props
- Destructure props with explicit types
- Don't use `React.FC`, direct define props type

### CSS and Styling

- Use Tailwind CSS for utility classes (preferred)
- Use CSS Modules (`.module.less` or `.module.css`) for component-scoped styles
- Use global Less files for global styles and mixins
- Avoid inline styles except for dynamic values
- Class names: use descriptive, semantic names

### Testing (rstest)

- Test files named `*.test.ts` or `*.test.tsx`, co-located with source files
- Use global test APIs (`describe`, `it`, `expect`) without imports
- Import testing apis from:
  - `@rstest/core` APIs (Rstest offers full Jest-compatible APIs)
  - `@testing-library/react` APIs
  - `@testing-library/user-event` APIs
- Group tests with `describe` blocks by function/component
- Use descriptive test names: `it('should return sum of two numbers', () => {...})`

### Git and Workflow

- Before committing, run: `prettier --write` then `eslint --fix` then `tsc -b .`
- Commit messages: short summary line, optionally with body
- Use conventional commit format for significant changes

## Infra Tools Module

@./infra/tools/AGENTS.md

See [`infra/tools/AGENTS.md`](./infra/tools/AGENTS.md) for detailed instructions on using the infra-tools package, including:

- Source code references configuration
- TypeScript project references setup
- Custom rstest/rslib/rsbuild configuration

## Important Notes

- Always lint and typecheck updated files
- Always follow `.gitignore` strictly
- All packages use `workspace:*` protocol for internal dependencies
- Packages with `source` field use rsbuild-source-plugin for dev/build (import from package name, not relative paths)
- Run `pnpm install` after adding new workspace dependencies
- Always type-check with `pnpm tsc -b .` before submitting changes
