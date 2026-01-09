# AGENTS.md - Instructions for AI Coding Agents (infra-tools)

This document provides guidelines for agents working with the infra-tools package.

## Overview

This package provides a simple wrapper around the rspack ecosystem tools (rsbuild, rslib, rstest) with pre-defined configurations to unify the monorepo setup.

## Usage

By default, simply run the commands directly in your monorepo package:

```bash
pnpm rsbuild dev
pnpm rsbuild build
pnpm rsbuild preview
pnpm rslib build
pnpm rstest
```

## Custom Configuration

To customize the configuration, import the appropriate function from `infra-tools` and merge with your settings:

```ts
import { defineConfigWithPreset } from 'infra-tools/rstest'

export default defineConfigWithPreset()
```

## Source Code References (Dev Mode)

This project uses `rsbuild-source-plugin` for source code references during development. Packages with the `source` field in their `package.json` do not need to be bundled - they can be used directly in the host app project for dev/build.

Even in source code reference mode, continue importing from the package name, do not use relative paths that import from the src directory directly

### TypeScript Project References

For packages using source code references, configure TypeScript project references using the project's preset tsconfig files:

- App packages should extend `tsconfig.app.json`
- Library packages should extend `tsconfig.module.json`

Additionally, make sure to add the paths of dependent packages to the current module's references. This is especially important when adding new packages. Otherwise, packages using source code references will have type errors and the editor won't jumo correctly
