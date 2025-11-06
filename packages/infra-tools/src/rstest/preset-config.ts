import { defineConfig, RstestConfig } from '@rstest/core'
import path from 'path'

import { getRsSharedConfig, RsSharedOptions } from '../rs-shared/config'

export type RsTestCustomOptions = RsSharedOptions & {
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

export const defaultExternals = ['react', 'react-dom']

export const getCommonPresetConfig = (): RstestConfig => {
  return {
    coverage: {
      enabled: false,
      provider: 'istanbul',
      reporters: ['text', 'html'],
      // include: ['src/**/*.[jt]s?(x)'],
    },
    testEnvironment: 'happy-dom',
    globals: true,
    setupFiles: [defaultSetupFilePath],
    onConsoleLog(log) {
      const data: string[] = [
        `outside of NODE_ENV === "production"`,
        `React does not recognize the`,
        `Invalid config encountered`,
        `Encountered unexpected key`,
        `perf sdk ini`,
        `[@arco-design/web-react]:`,
        `Warning: ReactDOM.render is no longer supported`,
      ]
      if (data.some((item) => log?.toLowerCase()?.includes(item.toLowerCase()))) {
        return false
      }
    },
  }
}

export const getRstestPresetConfig = (options?: RsTestCustomOptions) => {
  const externals = Array.isArray(options?.externals)
    ? options.externals
    : options?.externals
      ? [options.externals]
      : []
  const sharedConfig = getRsSharedConfig({
    ...options,
    enablePersistentCache: false,
    externals: [...externals, ...defaultExternals],
  })

  return defineConfig({
    ...(sharedConfig as any),
    output: {
      ...sharedConfig.output,
      target: 'node',
    },
    source: {
      ...sharedConfig.source,
      define: {
        ...sharedConfig.source?.define,
        vi: 'rstest',
      },
    },
    ...getCommonPresetConfig(),
  })
}
