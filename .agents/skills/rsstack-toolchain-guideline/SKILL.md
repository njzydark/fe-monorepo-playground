---
name: rsstack-toolchain-guideline
description: Maintain and upgrade this monorepo's Rsstack-based frontend toolchain. Use when changing Rsbuild, Rslib, Rstest, TypeScript, OXLint, OXFmt, Stylelint, pnpm catalogs, infra-tools presets, package scripts, or validation workflows.
---

# Rsstack Toolchain Guideline

## Workflow

Use `pnpm-workspace.yaml` catalogs as the single version source for shared runtime dependencies. Keep `infra/tools` as the only place that wraps Rsbuild, Rslib, and Rstest behavior for packages.

When upgrading toolchain packages:

1. Check current versions with `pnpm view <package> version` and peer constraints with `pnpm view <package> peerDependencies --json`.
2. Read the relevant official LLM docs below before changing config shape, plugin options, migration behavior, or public scripts.
3. Update catalog versions first, then update `infra/tools/package.json` plugin/runtime dependencies.
4. Run `pnpm install` to refresh the lockfile.
5. Validate in this order: `pnpm format:check`, `pnpm lint`, `pnpm tsc -b .`, package builds/tests affected by the change.

## Official LLM Docs

Use `llms.txt` as the lightweight index first. Use `llms-full.txt` only for broad migrations, unfamiliar APIs, or when the task needs a complete local understanding of the tool.

- Rsbuild: `https://rsbuild.rs/llms.txt`, `https://rsbuild.rs/llms-full.txt`
- Rslib: `https://rslib.rs/llms.txt`, `https://rslib.rs/llms-full.txt`
- Rstest: `https://rstest.rs/llms.txt`, `https://rstest.rs/llms-full.txt`
- OXC/OXLint/OXFmt: `https://oxc.rs/llms.txt`, `https://oxc.rs/llms-full.txt`

## Current Standards

- Use Rsbuild, Rslib, and Rstest from the pnpm catalog.
- Use TypeScript 7 from the pnpm catalog.
- Use OXLint for JavaScript/TypeScript linting and OXFmt for JavaScript/TypeScript/JSON/Markdown formatting.
- Keep Stylelint for CSS and Less. Do not reintroduce Prettier just for styles.
- Keep package scripts thin and run official Rsstack bins directly.
- Put shared behavior in thin package config files that import `defineConfigWithPreset` from `infra-tools`.
- Do not shadow `rsbuild`, `rslib`, or `rstest` with `infra-tools` bin wrappers.
- Keep package source references through the `source` field and import workspace packages by package name.

## Config Rules

- Add new shared Rsbuild/Rslib/Rstest options to `infra/tools/src/rs-shared` unless the behavior is package-specific.
- Use `infraToolsOptions` for preset options and native Rsbuild/Rslib/Rstest config for one-off overrides.
- Keep package-local config files small; they should usually just call `defineConfigWithPreset`.
- Use official Rstest adapters from `infra-tools/rstest` when tests should inherit a package's Rsbuild or Rslib config.
- Preserve TypeScript project references when adding or moving packages.

## Validation Notes

- If TypeScript 7 or Rsstack peer dependencies fail, prefer upgrading the dependent tool over pinning TypeScript back.
- If OXLint lacks an old ESLint stylistic rule, let OXFmt handle formatting and document any intentional rule gap.
- Do not run formatters before checking user changes in touched files.
