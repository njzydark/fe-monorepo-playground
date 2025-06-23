import { defineConfig } from '@rslib/core'
import { globSync } from 'glob'

import { getRsSharedConfig, RsSharedOptions } from '../rs-shared/config'

export type AbToolsRslibOptions = RsSharedOptions & {
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

export const getRslibPresetConfig = (options?: AbToolsRslibOptions) => {
  const {
    bundless: _bundless = true,
    bundlessExclude = '!**/*.{md,bak,back}',
    isTestEnv = !!process.env.TEST,
    dts: _dts = false,
    entry: _entry,
  } = options || {}

  const bundless = isTestEnv ? false : _bundless
  const dts = isTestEnv ? false : _dts

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
