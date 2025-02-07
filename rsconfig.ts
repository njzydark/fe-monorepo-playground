import { RsbuildConfig } from '@rsbuild/core'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSourceBuild } from '@rsbuild/plugin-source-build'
import { pluginSvgr } from '@rsbuild/plugin-svgr'
import { defineConfig, RslibConfig } from '@rslib/core'

export type SelfToolsOptions = {
  /**
   * @default source
   */
  sourceField?: string
  /**
   * @default true
   */
  bundless?: boolean
  /**
   * @default true
   */
  sourceBuild?: boolean
  /**
   * @default !!process.env.TEST
   */
  isTestEnv?: boolean
  /**
   * @default false
   */
  dts?: boolean
}

export const getSharedConfig = (options?: SelfToolsOptions): RsbuildConfig | RslibConfig => {
  const nodePath = process.env?.NODE_PATH
  const isRsbuild = nodePath?.includes('rsbuild')

  const {
    bundless: _bundless = true,
    sourceBuild = true,
    isTestEnv = !!process.env.TEST,
    sourceField = 'source',
  } = options || {}

  const bundless = isTestEnv ? false : _bundless

  return {
    source: {
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
      sourceMap: isRsbuild
        ? undefined
        : bundless
          ? false
          : {
              js: 'cheap-source-map',
            },
      cssModules: {
        auto: true,
      },
      minify: isTestEnv || bundless ? false : true,
    },
    performance: {
      printFileSize: true,
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
      sourceBuild && pluginSourceBuild({ sourceField }),
    ],
    tools: {
      bundlerChain: (chain) => {
        if (isTestEnv) {
          chain.output.devtoolModuleFilenameTemplate((value) => {
            return `${value.absoluteResourcePath}`
          })
        }
      },
      rspack: (config, { addRules }) => {
        addRules({
          resourceQuery: /raw/,
          type: 'asset/source',
        })

        config.ignoreWarnings = [/only differ in casing/]

        if (isTestEnv) {
          config.optimization!.moduleIds = 'named'
          config.optimization!.chunkIds = 'named'
        }

        return config
      },
    },
  }
}

export const getRslibPresetConfig = (options?: SelfToolsOptions) => {
  const { bundless: _bundless = true, isTestEnv = !!process.env.TEST, dts = false } = options || {}

  const bundless = isTestEnv ? false : _bundless

  const sharedConfig = getSharedConfig(options) as RslibConfig

  return defineConfig({
    ...sharedConfig,
    lib: [
      {
        source: {
          entry: {
            // index: bundless ? 'src/**' : 'src/index.(js|ts|jsx|tsx)',
            index: bundless ? 'src/**' : 'src/index.ts',
          },
        },
        format: 'esm',
        bundle: !bundless,
        autoExtension: true,
        syntax: 'es2015',
        autoExternal: {
          dependencies: true,
          optionalDependencies: true,
          devDependencies: true,
          peerDependencies: true,
        },
        dts: isTestEnv ? false : dts,
      },
    ],
  })
}

export const getRsbuildPresetConfig = (options?: SelfToolsOptions) => {
  const sharedConfig = getSharedConfig(options) as RsbuildConfig

  return { ...sharedConfig }
}
