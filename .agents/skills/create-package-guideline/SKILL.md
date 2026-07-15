---
name: create-package-guideline
description: Create new app, library, shared, or example packages in this frontend monorepo. Use when adding package.json files, thin Rsstack config files, TypeScript project references, source-build packages, package scripts, workspace dependencies, or package entrypoints.
---

# Create package guideline

Guidelines for creating new packages in the monorepo

## Workflow

1. Complete all `package.json` modifications (dependencies, exports, scripts, source field)
2. Complete all `tsconfig` modifications (extends, references, paths)
3. Run `pnpm i` to install and link dependencies
4. Add source files (`src/`) and implement the package

## Package Type and Directory Structure

- Determine the target directory based on the package type:
  - **Application**: Default to `apps/` directory
  - **Library/Shared Package**: Default to `packages/` directory
  - **Runnable examples/templates**: Default to `examples/` directory
- Examples can be frontend apps, API servers, shared packages, or paired starters. Keep framework-specific dependencies package-local, with shared versions in the pnpm catalog when useful.

## TypeScript Configuration

- Extend the appropriate `tsconfig` based on the package type:
  - Apps should extend `tsconfig.app.json`
  - Libraries should extend `tsconfig.module.json`

## Package.json Script Configuration

Add the appropriate scripts based on package type:

**For Applications (`apps/`):**

- `dev`: Development server (e.g., `pnpm rsbuild dev`)
- `build`: Production build (e.g., `pnpm rsbuild build`)
- `preview`: Preview production build (e.g., `pnpm rsbuild preview`)
- `test`: Run tests (e.g., `pnpm rstest run`)

Add the matching direct Rsstack dev dependency when using an official bin:

- Apps using `rsbuild`: add `@rsbuild/core`
- Libraries using `rslib`: add `@rslib/core`
- Packages using `rstest`: add `@rstest/core`

## Thin Config Files

Packages should run official Rsstack bins directly and include a small local config file:

```ts
import { defineConfigWithPreset } from 'infra-tools/rsbuild'

export default defineConfigWithPreset()
```

Use `infra-tools/rslib` for `rslib.config.ts` and `infra-tools/rstest` for `rstest.config.ts`.

For tests that should inherit build config, use the official adapters re-exported by `infra-tools/rstest`:

```ts
import { defineConfigWithPreset, withRsbuildConfig } from 'infra-tools/rstest'

export default defineConfigWithPreset({
  extends: withRsbuildConfig(),
})
```

**For Libraries (`packages/`):**

- `build`: Build the library (e.g., `pnpm rslib build`)
- `test`: Run tests (e.g., `pnpm rstest run`)

**For Runnable Examples (`examples/`):**

- Frontend examples usually use `dev`, `build`, and `preview` with Rsbuild.
- Server examples can use package-local runtime scripts such as `dev`, `start`, and `build`.
- Shared example packages should expose build output and types like normal library packages.
- Add examples that participate in workspace type checking to the root `tsconfig.json` references.

## Library-Specific Configuration

### Updating tsconfig References

When creating a new library that depends on other packages:

1. **For dependent apps**: Update the app's `tsconfig` to add project reference
2. **For lib dependencies**: Update the new lib's `tsconfig.json` to include references to dependency packages
3. Use `pnpm tsc -b` to rebuild affected projects after adding references

### Source Field Configuration

Ensure the library's `package.json` includes proper source development fields:

```json
{
  "source": "src/index.ts",
  "types": "types/index.d.ts",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    }
  }
}
```

## Validation

- Run `pnpm install` after adding package dependencies.
- Run `pnpm tsc -b .` after adding or changing project references.
- Run `pnpm format:check`, `pnpm lint`, `pnpm tsc -b .`, and relevant package builds before submitting package scaffolding changes.
