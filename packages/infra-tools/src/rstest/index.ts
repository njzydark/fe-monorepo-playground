import { defineConfig as defineRstestConfig, RstestConfig } from '@rstest/core'

import { AbToolsRstestOptions, getRstestPresetConfig } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'

export const defineConfig = (options?: Partial<RstestConfig> & { abTools?: AbToolsRstestOptions }) => {
  const { abTools } = options || {}
  const presetConfig = getRstestPresetConfig(abTools)
  return defineRstestConfig(presetConfig)
}
