import { defineConfig } from 'kysely-migrate'
import { db } from './src/infrastructure/database/config'

export default defineConfig({
  db,
  migrationFolder: 'src/infrastructure/database/migrations'
})
