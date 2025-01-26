import { defineConfig } from '@rsbuild/core'

import { getRsbuildPresetConfig } from '../../rsconfig'

export default defineConfig(() => {
  return { ...getRsbuildPresetConfig() }
})
