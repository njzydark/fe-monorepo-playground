import { defineConfig } from '@rstest/core'
import path from 'path'

import { getRsSharedConfig, RsSharedOptions } from '../rs-shared/config'

export type AbToolsRstestOptions = RsSharedOptions & {
  /**
   * @default true
   */
  bundless?: boolean
  bundlessExclude?: string
  /**
   * @default false
   */
  dts?: boolean
}

const setupTestsName = 'setupTests.ts'
export const defaultSetupFilePath = path.join(__dirname, `../src/rstest/${setupTestsName}`)

export const getRstestPresetConfig = (options?: AbToolsRstestOptions) => {
  const sharedConfig = getRsSharedConfig(options)

  return defineConfig({
    ...(sharedConfig as any),
    source: {
      ...sharedConfig.source,
      define: {
        ...sharedConfig.source?.define,
        vi: 'rstest',
      },
    },
    testEnvironment: 'jsdom',
    globals: true,
    setupFiles: [defaultSetupFilePath],
  })
}
