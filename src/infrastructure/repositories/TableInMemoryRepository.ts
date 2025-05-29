import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'
import { TableRepository } from '@/domain/tables/TableRepository'

export class TableInMemoryRepository implements TableRepository {
  async findAll(): Promise<Table[]> {
    return TableInMemoryRepository.tables
  }

  private static readonly tables = [
    new Table(new TableNumber(1), 2),
    new Table(new TableNumber(2), 2),
    new Table(new TableNumber(3), 4),
    new Table(new TableNumber(4), 4),
    new Table(new TableNumber(5), 6),
    new Table(new TableNumber(6), 6),
    new Table(new TableNumber(7), 8),
    new Table(new TableNumber(8), 10)
  ]
}
