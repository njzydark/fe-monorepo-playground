import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import { join } from 'path'

const cliName = 'rsbuild'

const args = process.argv.slice(2)

const hasConfigArg = args.some((arg) => arg === '-c' || arg === '--config')

const hasConfigFile = globSync(`${cliName}.config.@(js|ts|mjs|mts|cjs|cts)`, { cwd: process.cwd() }).length > 0

if (!hasConfigArg && !hasConfigFile) {
  const abToolsDir = join(process.cwd(), 'node_modules/.infra-tools')
  const defaultConfigPath = join(abToolsDir, `${cliName}.config.ts`)

  if (!existsSync(abToolsDir)) {
    mkdirSync(abToolsDir, { recursive: true })
  }

  const defaultConfig = `
import { defineConfig } from 'infra-tools/${cliName}';

export default defineConfig();
`

  writeFileSync(defaultConfigPath, defaultConfig)

  args.unshift('-c', defaultConfigPath)
}

const originCliPath = join(__dirname, `../../node_modules/.bin/${cliName}`)

const result = spawnSync(originCliPath, args, {
  stdio: 'inherit',
  shell: true,
})

process.exit(result.status ?? 1)
