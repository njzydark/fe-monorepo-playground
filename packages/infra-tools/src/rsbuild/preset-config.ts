import { defineConfig } from '@rsbuild/core'
import { getRsSharedConfig, RsSharedOptions } from 'src/rs-shared/config'

export type AbToolsRsbuildOptions = RsSharedOptions

export const getRsbuildPresetConfig = (options?: AbToolsRsbuildOptions) => {
  const sharedConfig = getRsSharedConfig(options)

  return defineConfig({
    ...sharedConfig,
  })
}
