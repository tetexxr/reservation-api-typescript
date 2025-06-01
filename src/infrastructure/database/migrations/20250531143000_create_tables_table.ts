import { Kysely } from 'kysely'
import { DB } from 'kysely-codegen'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('tables')
    .addColumn('number', 'integer', (col) => col.primaryKey())
    .addColumn('maximum_seating_capacity', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('tables').execute()
}
