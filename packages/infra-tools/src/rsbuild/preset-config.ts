import { defineConfig } from '@rsbuild/core'

import { getRsSharedConfig, RsSharedOptions } from '../rs-shared/config'

export type RsbuildCustomOptions = RsSharedOptions

export const getRsbuildPresetConfig = (options?: RsbuildCustomOptions) => {
  const sharedConfig = getRsSharedConfig(options)

  return defineConfig({
    ...sharedConfig,
  })
}
