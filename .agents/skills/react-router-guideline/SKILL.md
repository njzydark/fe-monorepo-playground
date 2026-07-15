---
name: react-router-guideline
description: Build, refactor, or review routing in this React monorepo with React Router. Use when adding routes, nested layouts, route params, loaders/actions, redirects, navigation links, route-level error UI, or app shell routing patterns.
---

# React Router Guideline

## Default Pattern

Use React Router only in the package or example that owns routing, and import from `react-router`. Do not add React Router to the root `package.json`; if multiple packages need it, keep the version in `pnpm-workspace.yaml` catalog and declare the dependency package-local. Prefer route definitions that are easy for agents to inspect and extend.

For simple apps, use `BrowserRouter`, `Routes`, and `Route` close to the app shell. For apps that need data APIs, route errors, or nested layouts at scale, switch to object routes with `createBrowserRouter` and `RouterProvider`.

## Official Docs

Use the official React Router docs when route behavior is unclear. Do not assume a React Router `llms.txt` endpoint exists unless it has been verified during the task; unverified `reactrouter.com/llms.txt`-style URLs may return HTML error pages instead of LLM docs.

## Route Design

- Keep route paths literal and centralized in the app package.
- Use nested routes for layouts that own shared navigation, filters, or outlet context.
- Use `Link` and `NavLink` for in-app navigation, not raw anchors.
- Keep route params typed at the boundary by validating or normalizing values before passing them deeper.
- Put route-level loading, empty, and error states near the route that owns them.
- Keep reusable UI in workspace packages; keep app-specific routing in app packages.

## Implementation Checklist

1. Inspect the current app entry and router shape before editing.
2. Add pages under an app-local `src/pages` or `src/routes` convention already present in the package.
3. Add tests for route rendering or navigation when behavior changes.
4. Verify browser history fallback remains enabled in Rsbuild for SPA routes.

## Avoid

- Do not import from another package's `src` directory for route components.
- Do not hide route definitions across many unrelated files unless the app already uses a file-route convention.
- Do not add framework-mode assumptions unless the app is explicitly set up for React Router framework tooling.
