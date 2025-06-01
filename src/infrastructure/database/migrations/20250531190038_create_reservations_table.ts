import { Kysely } from 'kysely'
import { DB } from 'kysely-codegen'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('reservations')
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey())
    .addColumn('time', 'datetime', (col) => col.notNull())
    .addColumn('customer_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('customer_email', 'varchar(255)', (col) => col.notNull())
    .addColumn('customer_phone_number', 'varchar(20)', (col) => col.notNull())
    .addColumn('party_size', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('reservations').execute()
}
