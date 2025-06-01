import { Kysely } from 'kysely'
import { Database } from '../config'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('tables')
    .addColumn('number', 'integer', (col) => col.primaryKey())
    .addColumn('maximum_seating_capacity', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('tables').execute()
}
