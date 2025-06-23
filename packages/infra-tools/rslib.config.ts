import { defineConfig } from '@rslib/core'

const nodeEntry = {
  rslib: './src/rslib/index.ts',
  rsbuild: './src/rsbuild/index.ts',
  rstest: './src/rstest/index.ts',
  'bin/rslib': './src/bin/rslib.ts',
  'bin/rsbuild': './src/bin/rsbuild.ts',
  'bin/rstest': './src/bin/rstest.ts',
}

const webEntry = {
  test: './src/test.ts',
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
        entry: nodeEntry,
      },
      output: {
        target: 'node',
      },
    },
    {
      format: 'esm',
      bundle: true,
      syntax: 'es2015',
      autoExternal,
      dts,
      source: {
        entry: webEntry,
      },
      output: {
        target: 'web',
      },
    },
    {
      format: 'cjs',
      bundle: true,
      syntax: 'es2015',
      autoExternal,
      dts: false,
      source: {
        entry: nodeEntry,
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
        entry: webEntry,
      },
      output: {
        target: 'web',
      },
    },
  ],
})
