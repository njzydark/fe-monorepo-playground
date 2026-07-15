import { defineConfig } from '@rslib/core'

const entry = {
  rsbuild: './src/rsbuild/index.ts',
  rslib: './src/rslib/index.ts',
  rstest: './src/rstest/index.ts',
}

const autoExternal = {
  dependencies: true,
  devDependencies: true,
  peerDependencies: true,
  optionalDependencies: true,
}

const dts = process.env.RSLIB_DTS === 'true'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      bundle: true,
      syntax: 'es2015',
      autoExternal,
      dts,
      source: {
        entry,
      },
      output: {
        target: 'node',
      },
    },
    {
      format: 'cjs',
      bundle: true,
      syntax: 'es2015',
      autoExternal,
      dts: false,
      source: {
        entry,
      },
      output: {
        target: 'node',
      },
    },
  ],
})
