import { spawnSync } from 'child_process'
import 'reflect-metadata'

const run = (command: string, args: string[]): void => {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status || 1)
}

const waitForDatabase = (): void => {
  console.log('⏳ Waiting for the database to be ready...')
  let retries = 30
  while (retries > 0) {
    const result = spawnSync('nc', ['-z', 'localhost', '3306'], { stdio: 'ignore' })
    if (result.status === 0) {
      console.log('✅ Database ready')
      return
    }
    retries--
    if (retries > 0) {
      console.log(`⏳ Waiting for database... ${retries} retries left`)
      spawnSync('sleep', ['1'], { stdio: 'ignore' })
    }
  }
  console.error('❌ Database not ready after 30 seconds')
  process.exit(1)
}

console.log('🟡 Starting Docker Compose...')
run('docker', ['compose', 'up', '-d'])

waitForDatabase()

const isRunMode = process.argv.includes('--run')
const isIntegrationOnly = process.argv.includes('--integration')
console.log('🚀 Running tests...')
const testPath = isIntegrationOnly ? 'tests/integration' : 'tests'
run('npx', ['vitest', isRunMode ? 'run' : '', testPath].filter(Boolean))

console.log('🧹 Cleaning up...')
run('docker', ['compose', 'down'])
