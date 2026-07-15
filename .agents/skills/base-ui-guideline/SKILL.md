---
name: base-ui-guideline
description: Build accessible React UI primitives in this monorepo with Base UI. Use when implementing dialogs, popovers, menus, selects, tabs, tooltips, form controls, composed primitives, keyboard interactions, or shared design-system components.
---

# Base UI Guideline

## Default Pattern

Use `@base-ui/react` only in the package or example that renders Base UI primitives. Do not add Base UI to the root `package.json`. If multiple workspace packages need Base UI, put the version in `pnpm-workspace.yaml` catalog and keep the dependency declared package-local.

Base UI provides behavior and accessibility; style components with the existing package convention. In this template, examples default to CSS Modules/Less unless a package already has another styling setup.

## Official LLM Docs

Before implementing or changing a Base UI primitive, read `https://base-ui.com/llms.txt` to find the relevant component docs. Use `https://base-ui.com/llms-full.txt` only for broad design-system work or when many Base UI primitives interact.

## Component Rules

- Use Base UI parts directly for interaction-heavy primitives instead of hand-rolling focus, escape-key, aria, and portal behavior.
- Wrap primitives only when the wrapper removes repeated composition or encodes a real design-system standard.
- Keep props typed with interfaces for object props and avoid `React.FC`.
- Expose controlled and uncontrolled modes only when the product use case needs both.
- Keep class merging explicit and predictable; use existing local helpers before adding a new dependency.
- Test keyboard and pointer behavior for shared primitives.

## Package Guidance

- Add `@base-ui/react` to packages or examples that render Base UI primitives.
- Put React packages in `peerDependencies` and `devDependencies` for libraries.
- Export reusable primitives from package entrypoints; avoid cross-package imports from `src`.

## Styling Guidance

- Prefer the styling convention already used by the package. For current examples, use CSS Modules/Less for component-scoped styles.
- Do not use inline styles except for dynamic values.
- Keep focus-visible states and disabled states visually clear.
