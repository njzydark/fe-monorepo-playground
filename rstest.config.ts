import { defineConfig, getCommonPresetConfig } from 'infra-tools/rstest'

export default defineConfig({
  ...getCommonPresetConfig(),
  projects: ['**/*/rstest.config.ts'],
})
