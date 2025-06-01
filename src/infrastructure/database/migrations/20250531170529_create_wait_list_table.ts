import { Kysely } from 'kysely'
import { DB } from 'kysely-codegen'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('wait_list')
    .addColumn('reservation_id', 'varchar(36)', (col) => col.primaryKey())
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('wait_list').execute()
}
