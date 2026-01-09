import { defineConfig } from '@rslib/core'
import { globSync } from 'glob'

import { getRsSharedConfig, RsSharedOptions } from '../rs-shared/config'

export type RslibCustomOptions = RsSharedOptions & {
  /**
   * @default true
   */
  bundless?: boolean
  bundlessExclude?: string
  /**
   * @default false
   */
  dts?: boolean
}

export const getRslibPresetConfig = (options?: RslibCustomOptions) => {
  const { bundless = true, bundlessExclude = '!**/*.{md,bak,back}', dts = false, entry: _entry } = options || {}

  const bundleEntryPattern = 'src/index.{ts,js,tsx,jsx,mjs,cjs}'
  const bundleEntryMatchedFiles = _entry || bundless ? [] : globSync(bundleEntryPattern, { cwd: process.cwd() })
  const entry = _entry ?? {
    index: bundless ? ['src/**/*', bundlessExclude] : bundleEntryMatchedFiles?.[0],
  }

  const sharedConfig = getRsSharedConfig({ ...options, entry })

  return defineConfig({
    ...sharedConfig,
    lib: [
      {
        format: 'esm',
        bundle: !bundless,
        autoExtension: true,
        syntax: 'es2015',
        autoExternal: {
          dependencies: true,
          optionalDependencies: true,
          devDependencies: true,
          peerDependencies: true,
        },
        dts,
      },
    ],
  })
}
