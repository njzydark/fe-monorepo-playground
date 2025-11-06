# fe-monorepo-playground

A template for quick init playground for fe monorepo project

## features

- Out of the box [live types](https://colinhacks.com/essays/live-types-typescript-monorepo)
- Out of the box [source build](https://github.com/rspack-contrib/rsbuild-plugin-source-build)
- Out of the box eslint stylelint prettier lint-staged vscode config
- Shared typescript rsbuild/rslib/rstest config
- Use [pnpm catalogs](https://pnpm.io/catalogs) to unify dependency versions
- Use [corepack](https://github.com/nodejs/corepack) to manage pnpm version

## infra-tools

- pnpm
- typescript
- rsbuild/rslib/rstest
- prettier
- eslint
- stylelint

## quick-start

enbale corepack

```bash
npm install -g corepack
corepack enable
```

**PS:** only need once if you not enable corepack

install dependencies

```bash
corepack install
pnpm i
```

start demo app

```bash
cd demo/app-demo
pnpm run dev
```
