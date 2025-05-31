import { Kysely } from 'kysely'
import { Database } from '../config'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('wait_list')
    .addColumn('reservation_id', 'varchar(36)', (col) => col.primaryKey())
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('wait_list').execute()
}
