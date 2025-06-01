import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'
import { db } from '@/infrastructure/database/config'
import { TableInMemoryRepository } from '@/infrastructure/repositories/TableInMemoryRepository'

const tables = [
  new Table(new TableNumber(1), 2),
  new Table(new TableNumber(2), 2),
  new Table(new TableNumber(3), 4),
  new Table(new TableNumber(4), 4),
  new Table(new TableNumber(5), 6),
  new Table(new TableNumber(6), 6),
  new Table(new TableNumber(7), 8),
  new Table(new TableNumber(8), 10)
]

export async function seedTables(): Promise<void> {
  TableInMemoryRepository.initialize(tables)

  await db.deleteFrom('tables').execute()
  for (const table of tables) {
    await db
      .insertInto('tables')
      .values({
        number: table.number.value,
        maximum_seating_capacity: table.maximumSeatingCapacity
      })
      .execute()
  }
}
