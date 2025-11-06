import { spawnSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import { join } from 'path'

export const initInfraToolsCli = (params: { cliName: string; packageName: string }) => {
  const { cliName, packageName } = params

  const args = process.argv.slice(2)

  const hasConfigArg = args.some((arg) => arg === '-c' || arg === '--config')

  const hasConfigFile = globSync(`${cliName}.config.@(js|ts|mjs|mts|cjs|cts)`, { cwd: process.cwd() }).length > 0

  if (!hasConfigArg && !hasConfigFile) {
    const infraToolsDir = join(process.cwd(), `node_modules/.${packageName}`)
    const defaultConfigPath = join(infraToolsDir, `${cliName}.config.ts`)

    if (!existsSync(infraToolsDir)) {
      mkdirSync(infraToolsDir, { recursive: true })
    }

    const defaultConfig = `
import { defineConfigWithPreset } from '${packageName}/${cliName}';

export default defineConfigWithPreset();
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
}
