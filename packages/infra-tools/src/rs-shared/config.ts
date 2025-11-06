import type { OutputConfig, RsbuildConfig, RsbuildEntry } from '@rsbuild/core'
import { pluginLess, PluginLessOptions } from '@rsbuild/plugin-less'
import { pluginReact, PluginReactOptions } from '@rsbuild/plugin-react'
import { pluginSourceBuild, PluginSourceBuildOptions } from '@rsbuild/plugin-source-build'
import { pluginSvgr, PluginSvgrOptions } from '@rsbuild/plugin-svgr'
import type { RslibConfig } from '@rslib/core'
import { globSync } from 'glob'
import { pluginDevtoolsJson } from 'rsbuild-plugin-devtools-json'

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
   * @default true
   */
  enablePersistentCache?: boolean
  externals?: OutputConfig['externals']
  pluginOptions?: {
    react?: Partial<PluginReactOptions>
    less?: Partial<PluginLessOptions>
    svgr?: Partial<PluginSvgrOptions>
    sourceBuild?: Partial<PluginSourceBuildOptions>
  }
}

export const getRsSharedConfig = (options?: RsSharedOptions): RsbuildConfig | RslibConfig => {
  const nodePath = process.env?.NODE_PATH
  const proxyTarget = process.env?.PROXY_TARGET
  const isRsbuild = nodePath?.includes('rsbuild')

  const {
    entry,
    sourceBuild = true,
    sourceField = 'source',
    enablePersistentCache = true,
    externals,
    pluginOptions = {},
  } = options || {}

  const defaultEntryPattern = isRsbuild
    ? './src/{dev,index}.{ts,js,tsx,jsx,mjs,cjs}'
    : './src/index.{ts,js,tsx,jsx,mjs,cjs}'

  const entryMatchedFiles = entry ? [] : globSync(defaultEntryPattern, { cwd: process.cwd() })

  return {
    source: {
      define,
      entry: entry ?? {
        index: `./${entryMatchedFiles?.[0]}`,
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
      externals,
    },
    performance: {
      printFileSize: isRsbuild ? true : false,
    },
    plugins: [
      pluginDevtoolsJson(),
      pluginReact(pluginOptions.react),
      pluginLess({
        ...pluginOptions.less,
      }),
      pluginSvgr({
        mixedImport: true,
        ...pluginOptions.svgr,
        svgrOptions: {
          exportType: 'named',
          ...pluginOptions.svgr?.svgrOptions,
        },
      }),
      sourceBuild && pluginSourceBuild({ sourceField, ...pluginOptions.sourceBuild }),
    ],
    server: {
      historyApiFallback: true,
      proxy: proxyTarget ? commonProxy(proxyTarget) : undefined,
      port: PORT,
    },
    tools: {
      rspack: (config, { addRules }) => {
        config.experiments ||= {}
        config.experiments.typeReexportsPresence = true

        config.module.parser ||= {}
        config.module.parser.javascript ||= {}
        config.module.parser.javascript.typeReexportsPresence = 'tolerant'

        addRules({
          resourceQuery: /raw/,
          type: 'asset/source',
        })

        config.ignoreWarnings = [/only differ in casing/]

        if (enablePersistentCache) {
          config.experiments.cache = {
            type: 'persistent',
          }
        }

        return config
      },
    },
  }
}
