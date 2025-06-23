import { defineConfig as defineRslibConfig, type RslibConfig } from '@rslib/core'

import { AbToolsRslibOptions, getRslibPresetConfig } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'

export const defineConfig = (options?: Partial<RslibConfig> & { abTools?: AbToolsRslibOptions }) => {
  const { abTools } = options || {}
  const presetConfig = getRslibPresetConfig(abTools)
  return defineRslibConfig(presetConfig)
}
