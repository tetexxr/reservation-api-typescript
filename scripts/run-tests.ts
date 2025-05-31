import { spawnSync } from 'child_process'
import 'reflect-metadata'
import { db } from '../src/infrastructure/database/config'
import { sql } from 'kysely'

const run = (command: string, args: string[]): void => {
  console.log('\x1b[90m%s\x1b[0m', `$ ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    console.log('\x1b[31m%s\x1b[0m', `Command failed with status ${result.status}`)
    process.exit(result.status || 1)
  }
}

const waitForDatabase = async (): Promise<void> => {
  process.stdout.write('⏳ Waiting for the database to be ready')
  let retries = 30
  let lastError: Error | null = null

  while (retries > 0) {
    try {
      await sql`SELECT 1`.execute(db)
      console.log('\n✅ Database ready')
      return
    } catch (error) {
      lastError = error as Error
      retries--
      if (retries > 0) {
        process.stdout.write('.')
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  console.error('❌ Database not ready after 15 seconds')
  console.error('Last error:', lastError?.message)
  process.exit(1)
}

const runTests = async (): Promise<void> => {
  try {
    console.log('🟡 Starting Docker Compose...')
    run('docker', ['compose', 'up', '-d'])

    await waitForDatabase()

    console.log('🔄 Running database migrations...')
    run('npx', ['tsx', 'node_modules/kysely-migrate/dist/esm/cli.js', 'up'])

    console.log('🚀 Running tests...')
    const isRunMode = process.argv.includes('--run')
    const isIntegrationOnly = process.argv.includes('--integration')
    const testPath = isIntegrationOnly ? 'tests/integration' : 'tests'
    run('npx', ['vitest', isRunMode ? 'run' : '', testPath])

    console.log('🧹 Cleaning up...')
    run('docker', ['compose', 'down'])
  } catch (error) {
    console.error('❌ Error during test execution:', error)
    process.exit(1)
  }
}

runTests()
