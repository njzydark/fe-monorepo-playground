import type { RsbuildConfig, RsbuildEntry, ToolsConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSourceBuild } from '@rsbuild/plugin-source-build'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import type { RslibConfig } from '@rslib/core'
import { globSync } from 'glob'
import pluginDevtoolsJson from 'rsbuild-plugin-devtool-json'

import { define } from './define'
import { PORT } from './env'
import { commonProxy } from './proxy'

export type RsSharedOptions = {
  entry?: RsbuildEntry
  /**
   * @default true
   */
  sourceBuild?: boolean
  /**
   * @default 'source'
   */
  sourceField?: string
  /**
   * @default !!process.env.TEST
   */
  isTestEnv?: boolean
  /**
   * @default true
   */
  enablePersistentCache?: boolean
}

export const getRsSharedConfig = (options?: RsSharedOptions): RsbuildConfig | RslibConfig => {
  const nodePath = process.env?.NODE_PATH
  const isRsbuild = nodePath?.includes('rsbuild')

  const {
    entry,
    sourceBuild = true,
    sourceField = 'source',
    isTestEnv = !!process.env.TEST,
    enablePersistentCache = true,
  } = options || {}

  const defaultEntryPattern = isRsbuild
    ? 'src/{dev,index}.{ts,js,tsx,jsx,mjs,cjs}'
    : 'src/index.{ts,js,tsx,jsx,mjs,cjs}'

  const entryMatchedFiles = entry ? [] : globSync(defaultEntryPattern, { cwd: process.cwd() })

  return {
    source: {
      define,
      entry: entry ?? {
        index: entryMatchedFiles?.[0],
      },
      transformImport: [
        {
          libraryName: '@arco-design/web-react',
          libraryDirectory: 'es',
          camelToDashComponentName: false,
          style: true,
        },
        {
          libraryName: '@arco-design/web-react/icon',
          libraryDirectory: 'react-icon',
          camelToDashComponentName: false,
        },
        {
          libraryName: '@dp/react-component',
          libraryDirectory: 'es',
          camelToDashComponentName: false,
          style: true,
        },
        {
          libraryName: '@dp/react-component-icon',
          libraryDirectory: 'react-icon',
          camelToDashComponentName: false,
        },
      ],
    },
    output: {
      target: 'web',
      distPath: {
        root: 'dist',
        jsAsync: 'js-async',
        cssAsync: 'css-async',
      },
      legalComments: 'none',
      sourceMap: isRsbuild ? undefined : false,
      cssModules: {
        auto: true,
      },
      minify: isRsbuild ? undefined : false,
    },
    performance: {
      printFileSize: isRsbuild ? true : false,
    },
    plugins: [
      pluginReact(),
      pluginLess({
        lessLoaderOptions: {
          lessOptions: {
            math: 'always',
            javascriptEnabled: true,
          },
        },
      }),
      pluginSvgr({
        mixedImport: true,
        svgrOptions: {
          exportType: 'named',
        },
      }),
      pluginDevtoolsJson(),
      sourceBuild && pluginSourceBuild({ sourceField }),
    ],
    server: {
      historyApiFallback: true,
      // proxy: commonProxy('http://localhost:3000'),
      port: PORT,
    },
    tools: {
      bundlerChain: (chain) => {
        if (isTestEnv) {
          chain.output.devtoolModuleFilenameTemplate((value) => {
            return `${value.absoluteResourcePath}`
          })
        }
      },
      rspack: (config, { addRules, appendPlugins }) => {
        addRules({
          resourceQuery: /raw/,
          type: 'asset/source',
        })

        if (isTestEnv) {
          config.optimization!.moduleIds = 'named'
          config.optimization!.chunkIds = 'named'
        }

        config.ignoreWarnings = [/only differ in casing/]

        if (enablePersistentCache) {
          config.experiments = {
            cache: {
              type: 'persistent',
            },
          }
        }

        return config
      },
    },
  }
}
