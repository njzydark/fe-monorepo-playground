import { mergeRsbuildConfig } from '@rsbuild/core'
import { defineConfig, type RslibConfig } from '@rslib/core'

import { getRslibPresetConfig, RslibCustomOptions } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'
export * from '@rslib/core'

export const defineConfigWithPreset = (options?: Partial<RslibConfig> & { infraToolsOptions?: RslibCustomOptions }) => {
  const { infraToolsOptions, ...customConfig } = options || {}
  const presetConfig = getRslibPresetConfig(infraToolsOptions)
  const finalConfig = mergeRsbuildConfig<RslibConfig>(presetConfig, customConfig as RslibConfig)
  return defineConfig(finalConfig)
}
