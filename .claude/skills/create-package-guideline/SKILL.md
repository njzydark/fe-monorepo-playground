---
name: create-package-guideline
description: Guidelines for creating new packages in the monorepo
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
  - **Demo Package**: Default to `demo/` directory

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
- `test`: Run tests (e.g., `pnpm rstest`)

**For Libraries (`packages/`):**

- `build`: Build the library (e.g., `pnpm rslib build`)
- `test`: Run tests (e.g., `pnpm rstest`)

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
  "types": "dist/index.d.ts",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    }
  }
}
```
