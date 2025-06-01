import { Kysely } from 'kysely'
import { DB } from 'kysely-codegen'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('reservation_tables')
    .addColumn('reservation_id', 'varchar(36)', (col) => col.primaryKey())
    .addColumn('table_number', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('reservation_tables').execute()
}
