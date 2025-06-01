import { CamelCasePlugin, Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { DB } from 'kysely-codegen'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MyStr0ng!P@ssword',
  database: process.env.DB_NAME || 'reservation_api'
}

export const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool(dbConfig)
  }),
  plugins: [new CamelCasePlugin()]
})
