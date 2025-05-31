import { Kysely } from 'kysely'
import { Database } from '../config'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('reservation_tables')
    .addColumn('reservation_id', 'varchar(36)', (col) => col.primaryKey())
    .addColumn('table_number', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('reservation_tables').execute()
}
