import { Table } from '@/domain/tables/Table'
import { TableRepository } from '@/domain/tables/TableRepository'

export class TableInMemoryRepository implements TableRepository {
  async findAll(): Promise<Table[]> {
    return TableInMemoryRepository.tables
  }

  static initialize(tables: Table[]): void {
    TableInMemoryRepository.tables = tables
  }

  private static tables: Table[] = []
}
