import { Kysely, MysqlDialect } from 'kysely'
import { defineConfig } from 'kysely-migrate'
import { createPool } from 'mysql2'
import { dbConfig } from './src/infrastructure/database/config'

export default defineConfig({
  db: new Kysely({
    dialect: new MysqlDialect({
      pool: createPool(dbConfig)
    })
  }),
  migrationFolder: 'src/infrastructure/database/migrations'
})
