# AGENTS.md - Instructions for AI Coding Agents

This document provides guidelines for agents working in this monorepo.

## Monorepo structure

- `infra/tools` — infra-tools: preset config for rstest, rsbuild, rslib
- `.oxlintrc.json` — OXLint configuration
- `.oxfmtrc.json` — OXFmt configuration
- `stylelint.config.mjs` — Stylelint configuration
- `tsconfig.*.json` — TypeScript configurations
- `.agents/skills` — repo-specific AI skills and implementation guidelines
- `packages/` — lib packages
- `apps/` — app packages
- `examples/` — runnable example/template packages

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
pnpm oxfmt path/to/file.ts
# Lint a single file (with auto-fix)
pnpm oxlint path/to/file.ts --fix
# Run a single test file
pnpm rstest path/to/file.test.ts
```

Packages should use official Rsstack bins directly and provide a thin local config file that imports the infra preset, for example `rsbuild.config.ts` with `defineConfigWithPreset` from `infra-tools/rsbuild`.
Packages that need tests should add package-local Rstest config instead of relying on a root test project.

## Code Style Guidelines

### Formatting (OXFmt)

- Print width: 120 characters
- Tab width: 2 spaces
- Trailing commas: all
- Semicolons: no
- Single quotes: yes
- Arrow functions: always wrap parentheses around parameters

### Imports

- Use workspace package names for internal dependencies (e.g., `import { fn } from 'some-shared-package'`)
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
- For React packages, add and import `@testing-library/react` and `@testing-library/user-event` as package-local dev dependencies
- Group tests with `describe` blocks by function/component
- Use descriptive test names: `it('should return sum of two numbers', () => {...})`

### Git and Workflow

- Before committing, run: `pnpm format` then `pnpm lint` then `pnpm tsc -b .`
- Commit messages: short summary line, optionally with body
- Use conventional commit format for significant changes

## Repo Skills

- Use `$rsstack-toolchain-guideline` when changing Rsbuild, Rslib, Rstest, TypeScript, OXLint, OXFmt, Stylelint, or infra-tools presets.
- Use `$react-router-guideline` when adding or refactoring React Router routes.
- Use `$base-ui-guideline` when building accessible UI primitives with Base UI.
- Use `$create-package-guideline` when creating app, library, shared, or example packages.
- Use `$project-initialization-guideline` when initializing a forked copy of this template for a real project.

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
