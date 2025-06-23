import { defineConfig as defineRsbuildConfig, type RsbuildConfig } from '@rsbuild/core'

import { AbToolsRsbuildOptions, getRsbuildPresetConfig } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'

export const defineConfig = (options?: Partial<RsbuildConfig> & { abTools?: AbToolsRsbuildOptions }) => {
  const { abTools } = options || {}
  const presetConfig = getRsbuildPresetConfig(abTools)
  return defineRsbuildConfig(presetConfig)
}
