import { defineConfig, mergeRstestConfig, RstestConfig } from '@rstest/core'

import { getRstestPresetConfig, RsTestCustomOptions } from './preset-config'

export * from '../rs-shared'
export * from './preset-config'
export * from '@rstest/core'
export * from '@testing-library/react'
export * from '@testing-library/user-event'

export const defineConfigWithPreset = (
  options?: Partial<RstestConfig> & { infraToolsOptions?: RsTestCustomOptions },
) => {
  const { infraToolsOptions, ...customConfig } = options || {}
  const presetConfig = getRstestPresetConfig(infraToolsOptions)
  const finalConfig = mergeRstestConfig(presetConfig, customConfig)
  return defineConfig(finalConfig)
}
