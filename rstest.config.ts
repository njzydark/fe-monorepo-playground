import { defineConfig, getCommonPresetConfig } from 'infra-tools/rstest'

export default defineConfig({
  projects: [
    {
      name: 'common',
      ...getCommonPresetConfig(),
    },
  ],
})
