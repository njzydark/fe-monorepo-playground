import { defineConfig, mergeRsbuildConfig, type RsbuildConfig } from '@rsbuild/core'

import { getRsbuildPresetConfig, RsbuildCustomOptions } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'
export * from '@rsbuild/core'

export const defineConfigWithPreset = (
  options?: Partial<RsbuildConfig> & { infraToolsOptions?: RsbuildCustomOptions },
) => {
  const { infraToolsOptions, ...customConfig } = options || {}
  const presetConfig = getRsbuildPresetConfig(infraToolsOptions)
  const finalConfig = mergeRsbuildConfig(presetConfig, customConfig)
  return defineConfig(finalConfig)
}
