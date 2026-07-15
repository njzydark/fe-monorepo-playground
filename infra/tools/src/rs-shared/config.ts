import type { OutputConfig, RsbuildConfig, RsbuildEntry } from '@rsbuild/core'
import { pluginLess, PluginLessOptions } from '@rsbuild/plugin-less'
import { pluginReact, PluginReactOptions } from '@rsbuild/plugin-react'
import { pluginSourceBuild, PluginSourceBuildOptions } from '@rsbuild/plugin-source-build'
import { pluginSvgr, PluginSvgrOptions } from '@rsbuild/plugin-svgr'
import { globSync } from 'glob'
import path from 'path'
import { pluginDevtoolsJson } from 'rsbuild-plugin-devtools-json'

import { define } from './define'
import { PORT } from './env'
import { commonProxy } from './proxy'

export type RsSharedTarget = 'rsbuild' | 'rslib' | 'rstest'
type SourceConfig = NonNullable<RsbuildConfig['source']>

export type RsSharedOptions = {
  entry?: RsbuildEntry
  transformImport?: SourceConfig['transformImport']
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

const getDefaultEntryPattern = (target: RsSharedTarget) => {
  return target === 'rsbuild' ? './src/{dev,index}.{ts,js,tsx,jsx,mjs,cjs}' : './src/index.{ts,js,tsx,jsx,mjs,cjs}'
}

const getEntry = (target: RsSharedTarget, entry?: RsbuildEntry): RsbuildConfig['source'] => {
  if (target === 'rstest') {
    return {}
  }

  const entryMatchedFiles = entry ? [] : globSync(getDefaultEntryPattern(target), { cwd: process.cwd() })

  return {
    entry: entry ?? {
      index: `./${entryMatchedFiles?.[0]}`,
    },
  }
}

export const getRsSharedConfig = (target: RsSharedTarget, options?: RsSharedOptions): RsbuildConfig => {
  const proxyTarget = process.env?.PROXY_TARGET
  const isRsbuild = target === 'rsbuild'

  const {
    entry,
    sourceBuild = true,
    sourceField = 'source',
    enablePersistentCache = true,
    externals,
    pluginOptions = {},
    transformImport,
  } = options || {}

  const config: RsbuildConfig = {
    source: {
      define,
      ...getEntry(target, entry),
      transformImport,
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
      printFileSize: isRsbuild,
    },
    plugins: [
      isRsbuild && pluginDevtoolsJson(),
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
    tools: {
      rspack: (rspackConfig, { addRules }) => {
        rspackConfig.module.parser ||= {}
        rspackConfig.module.parser.javascript ||= {}
        rspackConfig.module.parser.javascript.typeReexportsPresence = 'tolerant'

        addRules({
          resourceQuery: /raw/,
          type: 'asset/source',
        })

        rspackConfig.ignoreWarnings = [/only differ in casing/]

        rspackConfig.experiments ||= {}
        if (enablePersistentCache) {
          rspackConfig.cache = {
            type: 'persistent',
          }
        }

        return rspackConfig
      },
    },
  }

  if (target === 'rsbuild') {
    config.server = {
      historyApiFallback: true,
      proxy: proxyTarget ? [commonProxy(proxyTarget)] : undefined,
      port: PORT,
    }
    config.dev = {
      watchFiles: [
        {
          type: 'reload-server',
          paths: `${path.join(__dirname, '../**/*')}`,
        },
      ],
    }
  }

  return config
}
